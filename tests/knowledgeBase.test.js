// Mock the environment configuration
process.env.NODE_ENV = 'test';
require('dotenv').config({ path: '.env.test' });

// Mocks
const { MockVectorStore } = require('../src/mocks/vectorStore');

// Test data
const testDocuments = [
  { pageContent: 'Bitcoin is a cryptocurrency.', metadata: { source: 'test-doc-1' } },
  { pageContent: 'Ethereum is a blockchain platform with smart contracts.', metadata: { source: 'test-doc-2' } },
  { pageContent: 'Web3 refers to a decentralized internet.', metadata: { source: 'test-doc-3' } },
];

describe('Knowledge Base Tests', () => {
  let mockVectorStore;
  
  beforeEach(async () => {
    mockVectorStore = new MockVectorStore();
    await mockVectorStore.addDocuments(testDocuments);
  });
  
  test('Should retrieve relevant documents for query', async () => {
    const query = "What is Ethereum?";
    const results = await mockVectorStore.similaritySearch(query, 2);
    
    expect(results).toBeDefined();
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBe(2);
    expect(results[0]).toHaveProperty('pageContent');
    expect(results[0]).toHaveProperty('metadata');
  });
});