import * as dotenv from 'dotenv';
dotenv.config();

import { GoogleGenAI } from '@google/genai';
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
import { Pinecone } from '@pinecone-database/pinecone';
import { getThreshold } from './plagiarismThresholds';

export interface PlagiarismResult {
  isPlagiarised: boolean;
  plagiarismScore: number; // 0–1, the highest similarity found
  matches: any[];
}

/**
 * Check whether `text` is too similar to documents already indexed in Pinecone.
 * The threshold varies by `category` so that categories like Resume / Skill are
 * far more lenient than ResearchPaper.
 */
export async function checkPlagiarism(
  text: string,
  category: string
): Promise<PlagiarismResult> {
  const res = await ai.models.embedContent({
  model: 'gemini-embedding-001',
  contents: text,
  config: { outputDimensionality: 768 },
});
const queryVector = res.embeddings![0].values!;

  const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
  const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME!);

  const searchResults = await pineconeIndex.query({
    topK: 5,
    vector: queryVector,
    includeMetadata: true,
  });

  const matches = searchResults.matches ?? [];
  const maxScore =
    matches.length > 0
      ? Math.max(...matches.map((m: any) => m.score ?? 0))
      : 0;

  const threshold = getThreshold(category);

  return {
    isPlagiarised: maxScore > threshold,
    plagiarismScore: maxScore,   // ← key name matches what frontend expects
    matches,
  };
}