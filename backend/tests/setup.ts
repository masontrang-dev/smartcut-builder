import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load test environment variables BEFORE setting NODE_ENV
dotenv.config({ path: '.env.test' });

// Set test environment
process.env.NODE_ENV = 'test';

// Increase timeout for database operations
jest.setTimeout(30000);

// Global setup before all tests
beforeAll(async () => {
  // Connect to test database if not already connected
  if (mongoose.connection.readyState === 0) {
    const mongoUri = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/smartcut-builder-test';
    await mongoose.connect(mongoUri);
  }
  
  // Ensure all models are loaded and indexes are created
  // This is important for index-related tests
  await mongoose.connection.syncIndexes();
});

// Global teardown after all tests
afterAll(async () => {
  // Clean up and close connection
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  }
  
  // Give time for cleanup
  await new Promise(resolve => setTimeout(resolve, 500));
});
