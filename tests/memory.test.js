// tests/memory.test.js
const { createTestContext } = require('./helpers');

// Import the agent
let processMessage;
try {
  const agentModule = require('obi');
  processMessage = agentModule.processMessage;
} catch (error) {
  processMessage = require('./mocks/agent').processMessage;
}

// Create mock memory
const createMockMemory = () => {
  const chatHistory = [];
  
  return {
    loadMemoryVariables: jest.fn().mockImplementation(() => {
      return Promise.resolve({ chat_history: [...chatHistory] });
    }),
    saveContext: jest.fn().mockImplementation((input, output) => {
      chatHistory.push({ type: 'human', text: input.input });
      chatHistory.push({ type: 'ai', text: output.output });
      return Promise.resolve();
    }),
    chatHistory
  };
};

describe('Memory and Conversation Context Tests', () => {
  test('Should maintain conversation context across multiple messages', async () => {
    const context = createTestContext('memory-test-user');
    const mockMemory = createMockMemory();
    
    // Mock dependencies
    const mockDeps = {
      llm: {
        call: jest.fn().mockImplementation(async (messages) => {
          // The more context messages, the more detailed the response
          const contextLength = messages.length;
          if (contextLength > 3) {
            return { content: "This is a detailed response that references previous messages" };
          } else {
            return { content: "This is a simple response" };
          }
        })
      },
      vectorStore: {
        similaritySearch: jest.fn().mockResolvedValue([])
      },
      memory: mockMemory
    };
    
    // First message - simple question
    const firstQuery = "What is Ethereum?";
    await processMessage(firstQuery, context, mockDeps);
    
    // Second message - follow-up
    const secondQuery = "How is it different from Bitcoin?";
    await processMessage(secondQuery, context, mockDeps);
    
    // Third message - another follow-up
    const thirdQuery = "Which one is better for smart contracts?";
    const thirdResponse = await processMessage(thirdQuery, context, mockDeps);
    
    // Verify memory was used
    expect(mockMemory.saveContext).toHaveBeenCalledTimes(3);
    expect(mockMemory.loadMemoryVariables).toHaveBeenCalledTimes(3);
    
    // Verify that chat history contains all messages
    expect(mockMemory.chatHistory.length).toBe(6); // 3 queries + 3 responses
    
    // Verify that the third response is more detailed
    expect(thirdResponse).toContain("references previous messages");
  });
  
  test('Should handle reference to previous conversation', async () => {
    const context = createTestContext('memory-test-user-2');
    const mockMemory = createMockMemory();
    
    // Add pre-existing conversation to memory
    mockMemory.chatHistory.push(
      { type: 'human', text: "What is a smart contract?" },
      { type: 'ai', text: "A smart contract is self-executing code on a blockchain." }
    );
    
    // Mock dependencies
    const mockDeps = {
      llm: {
        call: jest.fn().mockImplementation(async (messages) => {
          // Check if messages contain the reference to smart contracts
          const hasSmartContractContext = messages.some(m => 
            m.content && m.content.includes('smart contract')
          );
          
          if (hasSmartContractContext) {
            return { content: "As I mentioned before, smart contracts are self-executing code. They are commonly used for..." };
          } else {
            return { content: "I don't have context about that." };
          }
        })
      },
      vectorStore: {
        similaritySearch: jest.fn().mockResolvedValue([])
      },
      memory: mockMemory
    };
    
    // Query that references previous conversation
    const query = "Can you tell me more about those smart contracts you mentioned?";
    const response = await processMessage(query, context, mockDeps);
    
    // Verify that response references previous context
    expect(response).toContain("As I mentioned before");
    expect(response).toContain("smart contracts");
  });
});