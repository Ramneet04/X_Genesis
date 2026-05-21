import { Router, Request, Response } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import pdfParse from 'pdf-parse';
import fs from 'fs';
import path from 'path';

import { indexPdfToPinecone } from '../../utils/ragIndex';
import { queryRag } from '../../utils/ragQuery';
import { checkPlagiarism } from '../../utils/plagiarismCheck';

const router = Router();

// ─── Multer ──────────────────────────────────────────────────────────────────

const upload = multer({ dest: 'uploads/' });

// ─── Cloudinary config helper ─────────────────────────────────────────────────
// Called lazily inside the handler (not at module load time) so that dotenv
// has definitely run by the time we read process.env values.

function configureCloudinary() {
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
  const api_key    = process.env.CLOUDINARY_API_KEY;
  const api_secret = process.env.CLOUDINARY_API_SECRET;

  if (!cloud_name || !api_key || !api_secret) {
    throw new Error(
      'Missing Cloudinary env vars. Make sure CLOUDINARY_CLOUD_NAME, ' +
      'CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET are set in your .env file.'
    );
  }

  cloudinary.config({ cloud_name, api_key, api_secret });
}

// ─── POST /api/v1/upload/upload-pdf ─────────────────────────────────────────
//
// Body (multipart/form-data):
//   pdf      — the PDF file
//   category — NFT category string (required for correct plagiarism threshold)
//   nftId    — optional, used to namespace the Pinecone index
//
// Response (always 200 on success, 400/500 on error):
//   { url, isPlagiarised, plagiarismScore, matches, indexed }
//
router.post(
  '/upload-pdf',
  upload.single('pdf'),
  async (req: Request, res: Response): Promise<void> => {
    let tempPath: string | null = null;

    try {
      // ── Validate ────────────────────────────────────────────────────────────
      if (!req.file) {
        res.status(400).json({ success: false, error: 'No file uploaded.' });
        return;
      }

      const category: string = (req.body.category as string) || 'Project';
      const nftId: string | undefined = req.body.nftId as string | undefined;

      // ── Configure Cloudinary (lazy — env vars guaranteed loaded by now) ─────
      configureCloudinary();

      // ── Upload to Cloudinary ────────────────────────────────────────────────
      const cloudResult = await cloudinary.uploader.upload(req.file.path, {
        resource_type: 'raw',
        folder: 'nft_documents',
      });

      // Remove multer temp file
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);

      // ── Download PDF locally for text extraction ────────────────────────────
      const tempDir = path.join(process.cwd(), 'temp');
      if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

      tempPath = path.join(tempDir, `plag_${Date.now()}.pdf`);
      const dlResponse = await fetch(cloudResult.secure_url);
      if (!dlResponse.ok) throw new Error('Failed to re-download uploaded PDF.');
      fs.writeFileSync(tempPath, Buffer.from(await dlResponse.arrayBuffer()));

      // ── Extract text ────────────────────────────────────────────────────────
      const pdfData = await pdfParse(fs.readFileSync(tempPath));
      const text = pdfData.text;

      if (!text || text.trim().length < 50) {
        // PDF is either scanned / image-only — skip plagiarism, still index
        res.json({
          success: true,
          url: cloudResult.secure_url,
          isPlagiarised: false,
          plagiarismScore: 0,
          matches: [],
          indexed: false,
          warning: 'Could not extract text from PDF (may be image-based). Plagiarism check skipped.',
        });
        return;
      }

      // ── Plagiarism check ────────────────────────────────────────────────────
      const plagResult = await checkPlagiarism(text, category);

      if (plagResult.isPlagiarised) {
        // Don't index plagiarised documents
        res.json({
          success: true,
          url: cloudResult.secure_url,
          isPlagiarised: true,
          plagiarismScore: plagResult.plagiarismScore,
          matches: plagResult.matches,
          indexed: false,
        });
        return;
      }

      // ── Index in Pinecone ───────────────────────────────────────────────────
      await indexPdfToPinecone(cloudResult.secure_url, nftId);

      res.json({
        success: true,
        url: cloudResult.secure_url,
        isPlagiarised: false,
        plagiarismScore: plagResult.plagiarismScore,
        matches: plagResult.matches,
        indexed: true,
        message: 'PDF uploaded, plagiarism-checked, and indexed successfully.',
      });
    } catch (err) {
      console.error('Upload failed:', err);
      res.status(500).json({ success: false, error: 'Upload failed.', details: String(err) });
    } finally {
      // Always clean up the temp file
      if (tempPath && fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    }
  }
);

// ─── POST /api/v1/upload/rag-query ──────────────────────────────────────────
//
// Body: { question: string, nftId?: string }
//
router.post('/rag-query', async (req: Request, res: Response): Promise<void> => {
  try {
    const { question, nftId } = req.body;

    if (!question?.trim()) {
      res.status(400).json({ success: false, error: 'No question provided.' });
      return;
    }

    const answer = await queryRag(question, nftId);
    res.json({ success: true, answer });
  } catch (err) {
    console.error('RAG query failed:', err);
    res.status(500).json({ success: false, error: 'RAG query failed.', details: String(err) });
  }
});

export default router;