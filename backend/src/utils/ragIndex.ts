import fs from 'fs';
import path from 'path';

import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
// import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { Pinecone } from '@pinecone-database/pinecone';
import { GoogleGenAI } from '@google/genai';
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
/**
 * Download a PDF, split into chunks, embed with Gemini, upsert into Pinecone.
 *
 * Uses the Pinecone SDK directly (no @langchain/pinecone) to avoid the
 * @langchain/core uuid version-mismatch bug in @langchain/pinecone@1.x.
 *
 * @param pdfUrl  Public URL of the PDF (Cloudinary, IPFS, etc.)
 * @param nftId   Optional — used as Pinecone namespace to isolate per-NFT chunks
 */
export async function indexPdfToPinecone(
  pdfUrl: string,
  nftId?: string
): Promise<void> {
  const tempDir = path.join(process.cwd(), 'temp');
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

  const tempPath = path.join(tempDir, `doc_${Date.now()}.pdf`);

  // ── Download PDF ──────────────────────────────────────────────────────────
  const response = await fetch(pdfUrl);
  if (!response.ok) throw new Error(`Failed to download PDF: ${response.statusText}`);
  fs.writeFileSync(tempPath, Buffer.from(await response.arrayBuffer()));

  try {
    // ── Load & split ──────────────────────────────────────────────────────
    const loader = new PDFLoader(tempPath);
    const rawDocs = await loader.load();

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const chunks = await splitter.splitDocuments(rawDocs);

    if (chunks.length === 0) {
      console.warn('[RAG Index] No chunks extracted from PDF — skipping index.');
      return;
    }

    // ── Embed all chunks ───────────────────────────────────────────────────
    const texts = chunks.map((c) => c.pageContent);

const vectors = await Promise.all(
  texts.map(async (text) => {
    const res = await ai.models.embedContent({
      model: 'gemini-embedding-001',
      contents: text,
      config: {
        outputDimensionality: 768,
      },
    });

    return res.embeddings![0].values!;
  })
);

    // ── Upsert into Pinecone directly (no @langchain/pinecone) ────────────
    const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
    const index = pinecone.Index(process.env.PINECONE_INDEX_NAME!);

    // Use nftId as namespace so each NFT's chunks are isolated
    const ns = nftId ? index.namespace(nftId) : index;

    // Pinecone recommends batches of ≤100 vectors
    const BATCH_SIZE = 100;
    for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
      const batch = chunks.slice(i, i + BATCH_SIZE).map((chunk, j) => ({
        // Stable ID: nftId + chunk position — avoids uuid dependency entirely
        id: `${nftId ?? 'doc'}_chunk_${i + j}`,
        values: vectors[i + j],
        metadata: {
          text: chunk.pageContent,
          source: pdfUrl,
          page: chunk.metadata?.loc?.pageNumber ?? chunk.metadata?.page ?? 0,
          ...(nftId ? { nftId } : {}),
        },
      }));

      await ns.upsert(batch);
      console.info(`[RAG Index] Upserted chunks ${i + 1}–${Math.min(i + BATCH_SIZE, chunks.length)} of ${chunks.length}`);
    }

    console.info(`[RAG Index] Done — ${chunks.length} chunks indexed${nftId ? ` (namespace: ${nftId})` : ''}.`);
  } finally {
    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
  }
}