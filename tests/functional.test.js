// tests/functional.test.js
const { createTestContext } = require('./helpers');
const testQueries = require('./fixtures/testQueries');

// Import the agent directly from your linked package
const { processMessage } = require('obi');
console.log('Using the linked obi agent module');

// Create standard mock dependencies
const createMockDependencies = () => ({
  llm: {
    call: jest.fn().mockImplementation(async (messages) => {
      // Extract the user's query from messages
      const userMessage = messages.find(m => m.role === 'user')?.content || '';
      
      // Generate appropriate response based on query content
      if (userMessage.includes('blockchain')) {
        return { content: "A blockchain is a distributed, decentralized ledger technology." };
      } else if (userMessage.includes('wallet')) {
        return { content: "Crypto wallets store your private keys and allow you to manage your digital assets." };
      } else if (userMessage.includes('defi')) {
        return { content: "DeFi (Decentralized Finance) refers to financial services using smart contracts on blockchains." };
      } else {
        return { content: "This is a general Web3 response for testing purposes." };
      }
    })
  },
  vectorStore: {
    similaritySearch: jest.fn().mockResolvedValue([
      { pageContent: "Blockchain is a distributed ledger technology." },
      { pageContent: "Cryptocurrency is a form of digital currency secured by cryptography." }
    ])
  },
  memory: {
    loadMemoryVariables: jest.fn().mockResolvedValue({
      chat_history: []
    }),
    saveContext: jest.fn().mockResolvedValue(undefined)
  }
});

describe('Web3 Agent Functional Tests', () => {
  // Test basic knowledge queries
  describe('Basic Knowledge', () => {
    testQueries.basicKnowledge.forEach(({ query, keywords }) => {
      test(`Should correctly respond to: "${query}"`, async () => {
        const context = createTestContext('user-test');
        const mockDeps = createMockDependencies();
        
        const response = await processMessage(query, context, mockDeps);
        
        // Verify response quality
        expect(response).toBeDefined();
        expect(typeof response).toBe('string');
        expect(response.length).toBeGreaterThan(50); // Ensure substantive response
        
        // Check for relevant keywords
        const lowercaseResponse = response.toLowerCase();
        const foundKeywords = keywords.filter(kw => 
          lowercaseResponse.includes(kw.toLowerCase())
        );
        
        // Should match at least 60% of expected keywords
        const keywordCoverage = foundKeywords.length / keywords.length;
        expect(keywordCoverage).toBeGreaterThanOrEqual(0.6);
      });
    });
  });
  
  // Test wallet operations
  describe('Wallet Operations', () => {
    testQueries.walletOperations.forEach(({ query, keywords }) => {
      test(`Should correctly respond to: "${query}"`, async () => {
        const context = createTestContext('user-test');
        const mockDeps = createMockDependencies();
        
        const response = await processMessage(query, context, mockDeps);
        
        // Verify response
        expect(response).toBeDefined();
        expect(response.length).toBeGreaterThan(50);
        
        // Check for relevant keywords
        const lowercaseResponse = response.toLowerCase();
        const foundKeywords = keywords.filter(kw => 
          lowercaseResponse.includes(kw.toLowerCase())
        );
        
        expect(foundKeywords.length / keywords.length).toBeGreaterThanOrEqual(0.6);
      });
    });
  });
  
  // Add more test categories as needed
});