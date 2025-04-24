// Mock the environment configuration
process.env.NODE_ENV = 'test';
require('dotenv').config({ path: '.env.test' });

// Import the mock blockchain
const { MockBlockchain } = require('./mocks/blockchain');

describe('Blockchain Integration Tests', () => {
  let mockBlockchain;
  
  beforeEach(() => {
    mockBlockchain = new MockBlockchain();
  });
  
  test('Should retrieve token balances', async () => {
    const address = '0x1234567890123456789012345678901234567890';
    
    const ethBalance = await mockBlockchain.getBalance(address);
    const usdcBalance = await mockBlockchain.getBalance(address, 'USDC');
    const pepeBalance = await mockBlockchain.getBalance(address, 'PEPE');
    
    expect(ethBalance).toBe('100000000000000000');
    expect(usdcBalance).toBe('1000000000');
    expect(pepeBalance).toBe('10000000000000000000000');
  });
  
  test('Should handle token transfers', async () => {
    const from = '0x1234567890123456789012345678901234567890';
    const to = '0x0987654321098765432109876543210987654321';
    const amount = '10000000'; // 10 USDC
    
    const result = await mockBlockchain.sendTransaction(from, to, amount, 'USDC');
    
    expect(result).toHaveProperty('hash');
    expect(result).toHaveProperty('success');
    expect(result.success).toBe(true);
    expect(mockBlockchain.transactions.length).toBe(1);
    expect(mockBlockchain.transactions[0].from).toBe(from);
    expect(mockBlockchain.transactions[0].to).toBe(to);
    expect(mockBlockchain.transactions[0].amount).toBe(amount);
    expect(mockBlockchain.transactions[0].token).toBe('USDC');
  });
});