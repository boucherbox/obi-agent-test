// tests/inputHandling.test.js
const { createTestContext } = require('./helpers');

// Import the agent
let processMessage;
try {
  const agentModule = require('obi');
  processMessage = agentModule.processMessage;
} catch (error) {
  processMessage = require('./mocks/agent').processMessage;
}

// Standard mock dependencies
const mockDeps = {
  llm: {
    call: jest.fn().mockResolvedValue({ content: "Mock response for testing" })
  },
  vectorStore: {
    similaritySearch: jest.fn().mockResolvedValue([
      { pageContent: "Test content for vector search" }
    ])
  }
};

describe('Input Handling Tests', () => {
  test('Should handle very short queries', async () => {
    const shortQueries = [
      "Blockchain?", 
      "Crypto?", 
      "Wallet?",
      "NFT?"
    ];
    
    for (const query of shortQueries) {
      const context = createTestContext('short-query-user');
      const response = await processMessage(query, context, mockDeps);
      
      expect(response).toBeDefined();
      expect(response.length).toBeGreaterThan(20);
    }
  });
  
  test('Should handle very long queries', async () => {
    const longQuery = "I'm completely new to cryptocurrencies and blockchain technology. " +
      "Could you explain how blockchains work, what makes them secure, and how cryptocurrencies " +
      "like Bitcoin and Ethereum function on top of them? Also, I'm interested in understanding " +
      "the difference between proof of work and proof of stake consensus mechanisms. " +
      "Additionally, could you explain what smart contracts are and how they're used in DeFi? " +
      "Finally, what are the best practices for securely storing cryptocurrency?";
    
    const context = createTestContext('long-query-user');
    const response = await processMessage(longQuery, context, mockDeps);
    
    expect(response).toBeDefined();
    expect(response.length).toBeGreaterThan(100);
  });
  
  test('Should handle queries with typos', async () => {
    const queriesWithTypos = [
      "Waht is etherium?",
      "How does bolckchain work?",
      "Explian smrat contratcs",
      "Wat is decentralzied finannce?"
    ];
    
    for (const query of queriesWithTypos) {
      const context = createTestContext('typo-user');
      const response = await processMessage(query, context, mockDeps);
      
      expect(response).toBeDefined();
      expect(response.length).toBeGreaterThan(50);
    }
  });
  
  test('Should handle queries with emojis and special characters', async () => {
    const specialQueries = [
      "What is Bitcoin? 🚀💰",
      "How to buy ETH? 🤔",
      "Explain NFTs! 🖼️",
      "DeFi explained!!! 💸💸💸"
    ];
    
    for (const query of specialQueries) {
      const context = createTestContext('emoji-user');
      const response = await processMessage(query, context, mockDeps);
      
      expect(response).toBeDefined();
      expect(response.length).toBeGreaterThan(50);
    }
  });
});