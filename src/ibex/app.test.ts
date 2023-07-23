import request from 'supertest';
import app from '.';

describe('Express App Test', () => {
  it('should return "Hello, World!" on GET /', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello, World!');
  });
});
