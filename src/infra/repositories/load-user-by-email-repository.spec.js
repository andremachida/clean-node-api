const MongoHelper = require('../helpers/mongo-helper')
const LoadUserByEmailRepository = require('./load-user-by-email-repository')

const MissingParamError = require('../../utils/errors/missing-param-error')

let db

const makeSut = () => {
  const userModel = db.collection('users')
  const sut = new LoadUserByEmailRepository(userModel)

  return {
    userModel,
    sut
  }
}

describe('LoadUserByEmailRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    db = await MongoHelper.getDb()
  })

  beforeEach(async () => {
    await db.collection('users').deleteMany()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('Should return null if no user is found', async () => {
    const { sut } = makeSut()
    const user = await sut.load('invalid_email@email.com')

    expect(user).toBeNull()
  })

  test('Should return an user if user found', async () => {
    const { sut, userModel } = makeSut()

    const fakeUser = await userModel.insertOne({
      email: 'valid_email@email.com',
      password: 'hashed_password'
    })

    const user = await sut.load('valid_email@email.com')

    expect(user).toEqual({
      _id: fakeUser.ops[0]._id,
      password: fakeUser.ops[0].password
    })
  })

  test('Should throw exception if no userModel provided', async () => {
    const sut = new LoadUserByEmailRepository()
    const promise = sut.load('any_email@email.com')

    expect(promise).rejects.toThrow()
  })

  test('Should throw exception if no email provided', async () => {
    const { sut } = makeSut()
    const promise = sut.load()

    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })
})
