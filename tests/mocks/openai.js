// Mock implementation of OpenAI
class MockOpenAI {
    constructor() {
      this.responses = {
        embeddings: { data: [{ embedding: new Array(1536).fill(0.1) }] },
        chat: { choices: [{ message: { content: "This is a mock response" } }] }
      };
    }
  
    async createEmbedding() {
      return this.responses.embeddings;
    }
  
    async createChatCompletion() {
      return this.responses.chat;
    }
  }
  
  module.exports = { MockOpenAI };