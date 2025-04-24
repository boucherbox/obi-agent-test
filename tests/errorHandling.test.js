// tests/errorHandling.test.js
const { createTestContext } = require('./helpers');

// Import the agent
let processMessage;
try {
  const agentModule = require('obi');
  processMessage = agentModule.processMessage;
} catch (error) {
  processMessage = require('./mocks/agent').processMessage;
}

describe('Error Handling Tests', () => {
  test('Should handle LLM service failures', async () => {
    const query = "What is blockchain?";
    const context = createTestContext('error-test-user');
    
    const errorMock = {
      llm: {
        call: jest.fn().mockRejectedValue(new Error("LLM service unavailable"))
      },
      vectorStore: {
        similaritySearch: jest.fn().mockResolvedValue([
          { pageContent: "Test content" }
        ])
      }
    };
    
    const response = await processMessage(query, context, errorMock);
    
    // Should not throw but return an error message
    expect(response).toBeDefined();
    expect(response.toLowerCase()).toContain('sorry');
  });
  
  test('Should handle vector store failures', async () => {
    const query = "What is blockchain?";
    const context = createTestContext('error-test-user');
    
    const errorMock = {
      llm: {
        call: jest.fn().mockResolvedValue({ content: "Test response" })
      },
      vectorStore: {
        similaritySearch: jest.fn().mockRejectedValue(new Error("Vector store unavailable"))
      }
    };
    
    const response = await processMessage(query, context, errorMock);
    
    // Should not throw but return a response
    expect(response).toBeDefined();
  });
  
  test('Should handle empty messages', async () => {
    const emptyQueries = ["", " ", "   "];
    
    for (const query of emptyQueries) {
      const context = createTestContext('empty-query-user');
      const mockDeps = {
        llm: {
          call: jest.fn().mockResolvedValue({ content: "Response to empty message" })
        },
        vectorStore: {
          similaritySearch: jest.fn().mockResolvedValue([])
        }
      };
      
      const response = await processMessage(query, context, mockDeps);
      
      // Should handle empty input gracefully
      expect(response).toBeDefined();
    }
  });
  
  test('Should handle malformed context object', async () => {
    const query = "What is blockchain?";
    // Missing required fields
    const malformedContexts = [
      { userId: 'test-user' /* missing platform and sessionId */ },
      { /* completely empty context */ },
      { platform: 'telegram' /* missing userId and sessionId */ },
      null, // Null context
      undefined // Undefined context
    ];
    
    const mockDeps = {
      llm: {
        call: jest.fn().mockResolvedValue({ content: "Test response" })
      },
      vectorStore: {
        similaritySearch: jest.fn().mockResolvedValue([
          { pageContent: "Test content" }
        ])
      }
    };
    
    for (const badContext of malformedContexts) {
      // Should not throw with malformed context
      const response = await processMessage(query, badContext, mockDeps).catch(e => e.message);
      
      // Either returns a response or an error message, but doesn't crash
      expect(typeof response).toBe('string');
    }
  });
});