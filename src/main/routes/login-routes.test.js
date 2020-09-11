const request = require('supertest')
const bcrypt = require('bcrypt')

const app = require('../config/app')
const MongoHelper = require('../../infra/helpers/mongo-helper')

let userModel

describe('LoginRoutes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    userModel = await MongoHelper.getCollection('users')
  })

  beforeEach(async () => {
    await userModel.deleteMany()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('Should return 200 when valid credentials provided', async () => {
    await userModel.insertOne({
      email: 'valid_email@email.com',
      password: bcrypt.hashSync('hashed_password', 10)
    })

    await request(app).post('/api/login')
      .send({
        email: 'valid_email@email.com',
        password: 'hashed_password'
      })
      .expect(200)
  })

  test('Should return 401 when invalid credentials provided', async () => {
    await request(app).post('/api/login')
      .send({
        email: 'invalid_email@email.com',
        password: 'invalid_password'
      })
      .expect(401)
  })
})
