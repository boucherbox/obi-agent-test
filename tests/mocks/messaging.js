// Mock implementation of messaging platforms
class MockMessagingPlatform {
    constructor() {
      this.sentMessages = [];
    }
  
    async sendMessage(userId, message) {
      this.sentMessages.push({ userId, message });
      return true;
    }
  
    async receiveMessage(userId, message) {
      // Simulate receiving a message
      return { userId, message };
    }
  
    getSentMessages() {
      return this.sentMessages;
    }
  
    reset() {
      this.sentMessages = [];
    }
  }
  
  module.exports = { MockMessagingPlatform };