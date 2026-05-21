// Pinecone utility for upserting and querying vectors

import { Pinecone } from '@pinecone-database/pinecone';

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

const index = pinecone.Index(process.env.PINECONE_INDEX!);

export async function upsertEmbedding(
  id: string,
  embedding: number[],
  metadata: any
) {
  await index.upsert([
    {
      id,
      values: embedding,
      metadata,
    },
  ]);
}

export async function queryEmbedding(
  embedding: number[],
  topK = 3
) {
  const result = await index.query({
    vector: embedding,
    topK,
    includeMetadata: true,
  });

  return result.matches;
}