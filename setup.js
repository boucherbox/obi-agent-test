// Set test environment
process.env.NODE_ENV = 'test';

// Load test environment variables
require('dotenv').config({ path: '.env.test' });

// Global mocks can be set up here
console.log('Test environment set up');