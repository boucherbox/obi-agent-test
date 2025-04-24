// tests/helpers.js
/**
 * Creates a test message object
 */
exports.createTestMessage = (content, userId = 'test-user') => {
    return { 
      content, 
      userId, 
      platform: 'test', 
      sessionId: `session-${userId}` 
    };
  };
  
  /**
   * Creates a test context object
   */
  exports.createTestContext = (userId = 'test-user') => {
    return {
      userId,
      platform: 'telegram',
      sessionId: `session-${userId}`,
      language: 'en'
    };
  };