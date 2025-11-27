/**
 * Jest setup file
 * Runs before each test suite
 */

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};
