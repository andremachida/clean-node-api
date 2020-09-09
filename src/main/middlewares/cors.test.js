const request = require('supertest')
const app = require('../config/app')

describe('CorsMiddleware', () => {
  test('Should enable CORS', async () => {
    app.get('/test_cors', (request, response) => {
      response.send('')
    })

    const response = await request(app).get('/test_cors')

    expect(response.headers['access-control-allow-origin']).toBe('*')
    expect(response.headers['access-control-allow-methods']).toBe('*')
    expect(response.headers['access-control-allow-headers']).toBe('*')
  })
})
