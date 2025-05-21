const request = require('supertest');
const app = require('../app');

describe('GET /api/items', () => {
  it('should return all items', async () => {
    const res = await request(app).get('/api/items');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });
});