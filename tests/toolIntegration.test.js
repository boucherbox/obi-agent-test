// tests/toolIntegration.test.js
const { createTestContext } = require('./helpers');

// Import the agent
// Import the agent directly from your linked package
// Replace 'web3-guidance-agent' with your actual package name
const { processMessage } = require('obi');
console.log('Using the linked agent module');

// Mock blockchain data
const mockBlockchainData = {
  ethPrice: "1865.42",
  gasPrice: "35",
  walletBalance: "1.245",
  transaction: {
    hash: "0x123...abc",
    status: "confirmed",
    blockNumber: 12345678
  }
};

// Create mock tools
const createMockTools = () => [
  {
    name: "eth_price_checker",
    description: "Check the current price of Ethereum",
    func: jest.fn().mockResolvedValue(mockBlockchainData.ethPrice)
  },
  {
    name: "gas_price_checker",
    description: "Check the current gas price on Ethereum",
    func: jest.fn().mockResolvedValue(mockBlockchainData.gasPrice)
  },
  {
    name: "wallet_balance_checker",
    description: "Check the balance of an Ethereum wallet",
    func: jest.fn().mockResolvedValue(mockBlockchainData.walletBalance)
  },
  {
    name: "transaction_checker",
    description: "Check the status of a transaction",
    func: jest.fn().mockResolvedValue(mockBlockchainData.transaction)
  }
];

describe('Tool Integration Tests', () => {
  test('Should use price checking tool when asked about prices', async () => {
    const query = "What is the current ETH price?";
    const context = createTestContext('tool-test-user');
    
    const mockTools = createMockTools();
    const mockDeps = {
      llm: {
        call: jest.fn().mockResolvedValue({ content: "The price of Ethereum is $1865.42 USD" })
      },
      vectorStore: {
        similaritySearch: jest.fn().mockResolvedValue([])
      },
      tools: mockTools
    };
    
    const response = await processMessage(query, context, mockDeps);
    
    // Verify that tool was used and price is in response
    expect(response).toContain(mockBlockchainData.ethPrice);
    expect(mockTools[0].func).toHaveBeenCalled();
  });
  
  test('Should use gas price tool when asked about gas fees', async () => {
    const query = "What are the current gas fees on Ethereum?";
    const context = createTestContext('tool-test-user');
    
    const mockTools = createMockTools();
    const mockDeps = {
      llm: {
        call: jest.fn().mockResolvedValue({ content: "The current gas price is 35 gwei" })
      },
      vectorStore: {
        similaritySearch: jest.fn().mockResolvedValue([])
      },
      tools: mockTools
    };
    
    const response = await processMessage(query, context, mockDeps);
    
    // Verify that tool was used and gas price is in response
    expect(response).toContain(mockBlockchainData.gasPrice);
    expect(mockTools[1].func).toHaveBeenCalled();
  });
  
  test('Should use wallet balance tool when asked about balance', async () => {
    const query = "What's my wallet balance?";
    const context = createTestContext('tool-test-user');
    
    const mockTools = createMockTools();
    const mockDeps = {
      llm: {
        call: jest.fn().mockResolvedValue({ content: "Your wallet balance is 1.245 ETH" })
      },
      vectorStore: {
        similaritySearch: jest.fn().mockResolvedValue([])
      },
      tools: mockTools
    };
    
    const response = await processMessage(query, context, mockDeps);
    
    // Verify that tool was used and balance is in response
    expect(response).toContain(mockBlockchainData.walletBalance);
    expect(mockTools[2].func).toHaveBeenCalled();
  });
});