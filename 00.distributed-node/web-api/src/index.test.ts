import { app } from './index';
import fetch from 'node-fetch';

beforeAll(async () => {
  // Ensure the app is fully ready before running tests
  await app.ready();
});

afterAll(async () => {
  // Close the app after all tests
  await app.close();
});

// Mock fetch for testing
jest.mock('node-fetch', () => jest.fn());

describe('Fastify App', () => {
  test('GET / should return consumer_pid and producer_data', async () => {
    // Mocked response data for fetch
    const mockProducerData = { key: 'value' };
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockProducerData,
    });

    // Simulate a GET request to "/"
    const response = await app.inject({
      method: 'GET',
      url: '/',
    });

    // Assertions
    expect(response.statusCode).toBe(200);
    const responseBody = JSON.parse(response.body);
    expect(responseBody).toHaveProperty('consumer_pid');
    expect(responseBody.producer_data).toEqual(mockProducerData);
  });
});
