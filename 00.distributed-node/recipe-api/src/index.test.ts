import request from 'supertest';
import { app } from './index';

beforeAll(async () => {
  // Ensure the app is fully ready before running tests
  await app.ready();
});

afterAll(async () => {
  // Close the app after all tests
  await app.close();
});

describe('Recipe API', () => {
  it('should return hello world', async () => {
    const response = await request(app.server).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('hello world');
  });

  it('should return a recipe', async () => {
    const response = await request(app.server).get('/recipes/42');
    expect(response.status).toBe(200);
    const body = response.body;
    expect(body.recipe.id).toBe(42);
    expect(body.recipe.name).toBe('Chicken Tikka Masala');
  });

  it('should return 404 for unknown recipe', async () => {
    const response = await request(app.server).get('/recipes/999');
    expect(response.status).toBe(404);
    const body = response.body;
    expect(body.error).toBe('Not Found');
  });

  it('should return the correct producer_pid', async () => {
    const response = await request(app.server).get('/recipes/42');
    expect(response.status).toBe(200);
    const body = response.body;
    expect(body.producer_pid).toBe(process.pid);
  });

  it('should return the correct ingredients', async () => {
    const response = await request(app.server).get('/recipes/42');
    expect(response.status).toBe(200);
    const body = response.body;
    expect(body.recipe.ingredients).toEqual([
      { id: 1, name: 'Chicken', quantity: '1 lb' },
      { id: 2, name: 'Sauce', quantity: '2 cups' },
    ]);
  });

  it('should return 404 for unknown recipe (duplicate test)', async () => {
    const response = await request(app.server).get('/recipes/999');
    expect(response.status).toBe(404);
    const body = response.body;
    expect(body.error).toBe('Not Found');
  });
});
