const request = require('supertest');

const app = require('../index');
 
describe('GET /', () => {

  it('responds with Hello message', async () => {

    const res = await request(app).get('/');

    expect(res.statusCode).toBe(200);

    expect(res.text).toBe('Hello from Node.js app!');

  });

});
 
describe('GET /health', () => {

  it('responds with JSON status ok', async () => {

    const res = await request(app).get('/health');

    expect(res.statusCode).toBe(200);

    expect(res.body).toEqual({ status: 'ok' });

  });

});

 

