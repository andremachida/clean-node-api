jest.mock('jsonwebtoken', () => ({
  token: 'any_token',

  sign (payload, secret) {
    this.payload = payload
    this.secret = secret

    return this.token
  }
}))

const jwt = require('jsonwebtoken')
const TokenGenerator = require('./token-generator')

const MissingParamError = require('../errors/missing-param-error')

const makeSut = () => {
  return new TokenGenerator('secret')
}

describe('TokenGenerator', () => {
  test('Should return null if JWT returns null', async () => {
    const sut = makeSut()
    jwt.token = null
    const token = await sut.generate('any_id')

    expect(token).toBeNull()
  })

  test('Should return a token if JWT return token', async () => {
    const sut = makeSut()
    const token = await sut.generate('any_id')

    expect(token).toBe(jwt.token)
  })

  test('Should call JWt with correct values', async () => {
    const sut = makeSut()
    await sut.generate('any_id')

    expect(jwt.payload).toEqual({
      _id: 'any_id'
    })
    expect(jwt.secret).toBe(sut.secret)
  })

  test('Should throw an exception if no secret provided', async () => {
    const sut = new TokenGenerator()
    const promise = sut.generate('any_id')

    expect(promise).rejects.toThrow(new MissingParamError('secret'))
  })

  test('Should throw an exception if no id provided', async () => {
    const sut = makeSut()
    const promise = sut.generate()

    expect(promise).rejects.toThrow(new MissingParamError('id'))
  })
})
