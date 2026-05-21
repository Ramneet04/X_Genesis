import { Pinecone } from '@pinecone-database/pinecone';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const History: any[] = [];

async function embedText(text: string): Promise<number[]> {
  const res = await ai.models.embedContent({
    model: 'gemini-embedding-001',
    contents: text,
    config: { outputDimensionality: 768 },
  });
  return res.embeddings![0].values!;
}

async function transformQuery(question: string): Promise<string> {
  History.push({ role: 'user', parts: [{ text: question }] });

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: History,
    config: {
      systemInstruction:
        'You are a query-rewriting expert. Rephrase the follow-up question into a ' +
        'complete standalone question using the chat history for context. ' +
        'Output ONLY the rewritten question, nothing else.',
    },
  });

  History.pop();

  return response.text?.trim() || question;
}

export async function queryRag(question: string, nftId?: string): Promise<string> {
  const rewritten = await transformQuery(question);

  const queryVector = await embedText(rewritten);

  const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
  const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME!);

  const searchResults = await pineconeIndex.query({
    topK: 10,
    vector: queryVector,
    includeMetadata: true,
    ...(nftId ? { namespace: nftId } : {}),
  });

  const context = searchResults.matches
    .map((match: any) => match.metadata?.text ?? '')
    .filter(Boolean)
    .join('\n\n---\n\n');

  History.push({ role: 'user', parts: [{ text: rewritten }] });

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: History,
    config: {
      systemInstruction: `You are an expert assistant that answers questions about credential documents.
Answer ONLY using the provided context. If the answer is not in the context, say:
"I could not find the answer in the provided document."

Context:
${context}`,
    },
  });

  const answer = response.text ?? '';
  History.push({ role: 'model', parts: [{ text: answer }] });

  return answer;
}