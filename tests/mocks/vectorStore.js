// Mock implementation of a vector store
class MockVectorStore {
    constructor() {
      this.documents = [];
    }
  
    async addDocuments(documents) {
      this.documents.push(...documents);
      return true;
    }
  
    async similaritySearch(query, k = 4) {
      // Return k mock documents
      return this.documents.slice(0, k);
    }
  }
  
  module.exports = { MockVectorStore };