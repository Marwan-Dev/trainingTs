import supertest from 'supertest';
import app from '../index';

// Create a request object
const request = supertest(app);

describe('Test basic end point server', () => {
  it('Get the / end point', async () => {
    const response = await request.get('/');
    expect(response.status).toBe(200);
  });
});
