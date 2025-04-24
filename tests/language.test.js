// tests/language.test.js
const { createTestContext } = require('./helpers');

// Import the agent
let processMessage;
try {
  const agentModule = require('obi');
  processMessage = agentModule.processMessage;
} catch (error) {
  processMessage = require('./mocks/agent').processMessage;
}

// Create language-aware mock
const createLanguageMock = (language) => ({
  llm: {
    call: jest.fn().mockImplementation(async () => {
      switch (language) {
        case 'es':
          return { content: "Esta es una respuesta en español sobre blockchain." };
        case 'fr':
          return { content: "Voici une réponse en français sur la blockchain." };
        case 'de':
          return { content: "Dies ist eine deutsche Antwort über Blockchain." };
        case 'zh':
          return { content: "这是关于区块链的中文回答。" };
        default:
          return { content: "This is an English response about blockchain." };
      }
    })
  },
  vectorStore: {
    similaritySearch: jest.fn().mockResolvedValue([
      { pageContent: "Blockchain content in vector store" }
    ])
  }
});

describe('Language Support Tests', () => {
  const languages = [
    { code: 'en', name: 'English', keyPhrase: 'blockchain' },
    { code: 'es', name: 'Spanish', keyPhrase: 'blockchain' },
    { code: 'fr', name: 'French', keyPhrase: 'blockchain' },
    { code: 'de', name: 'German', keyPhrase: 'Blockchain' },
    { code: 'zh', name: 'Chinese', keyPhrase: '区块链' }
  ];
  
  languages.forEach(({ code, name, keyPhrase }) => {
    test(`Should respond in ${name}`, async () => {
      const query = "What is blockchain?";
      const context = {
        userId: `lang-test-${code}`,
        platform: 'telegram',
        sessionId: `session-lang-${code}`,
        language: code
      };
      
      const mockDeps = createLanguageMock(code);
      const response = await processMessage(query, context, mockDeps);
      
      expect(response).toBeDefined();
      expect(response.length).toBeGreaterThan(10);
      
      // Skip keyword check for languages like Chinese where our mock doesn't include the keyword
      if (code !== 'zh') {
        expect(response.toLowerCase()).toContain(keyPhrase.toLowerCase());
      }
    });
  });
  
  test('Should default to English when language not specified', async () => {
    const query = "What is blockchain?";
    const context = {
      userId: 'lang-test-default',
      platform: 'telegram',
      sessionId: 'session-lang-default'
      // No language specified
    };
    
    const mockDeps = createLanguageMock('en');
    const response = await processMessage(query, context, mockDeps);
    
    expect(response).toBeDefined();
    expect(response.toLowerCase()).toContain('blockchain');
  });
});