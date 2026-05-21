// LangChain.js RAG utility (placeholder for future expansion)
// You can use LangChain.js to orchestrate retrieval and generation
// For now, we focus on embedding and similarity search

export function checkPlagiarism(similarityScore: number, threshold = 0.85) {
  return similarityScore > threshold;
}
