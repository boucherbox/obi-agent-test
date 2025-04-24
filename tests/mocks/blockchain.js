// Mock implementation of blockchain interactions
class MockBlockchain {
    constructor() {
      this.balances = {
        'default': '100000000000000000', // 0.1 ETH
        'USDC': '1000000000', // 1000 USDC (6 decimals)
        'PEPE': '10000000000000000000000' // 10,000 PEPE (18 decimals)
      };
      this.transactions = [];
    }
  
    async getBalance(address, token = 'default') {
      return this.balances[token] || '0';
    }
  
    async sendTransaction(from, to, amount, token = 'default') {
      this.transactions.push({ from, to, amount, token });
      return {
        hash: '0x' + Math.random().toString(16).substr(2, 64),
        success: true
      };
    }
  }
  
  module.exports = { MockBlockchain };