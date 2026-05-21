// Gemini API embedding utility
import axios from 'axios';

export async function getGeminiEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('Missing Gemini API key');
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedText';
  const response = await axios.post(
    `${url}?key=${apiKey}`,
    { text },
    { headers: { 'Content-Type': 'application/json' } }
  );
  return response.data.embedding;
}
