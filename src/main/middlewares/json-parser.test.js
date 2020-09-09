const request = require('supertest')
const app = require('../config/app')

describe('JSONParserMiddleware', () => {
  test('Should parse body as JSON', async () => {
    app.post('/test_json_parser', (request, response) => {
      response.send(request.body)
    })

    await request(app).post('/test_json_parser').send({ name: 'Andre' })
      .expect({ name: 'Andre' })
  })
})
