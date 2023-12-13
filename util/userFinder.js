const jwt = require('jsonwebtoken')
const { SECRET } = require('./config.js')
const { User } = require('../models')
const validateSession = require('../util/validateSession')

const userFinder = async (request, response, next) => {
  try {
    const token = getToken(request)
    const decodedToken = jwt.verify(token, SECRET)
    const user = await User.findByPk(decodedToken.id)
    const id = user.id
    const validSession = await validateSession({ id, token })

    if (!decodedToken.id || !validSession) throw Error('session is not valid')
    if (user.disabled) throw Error('user is disabled')

    request.user = user
    next()
  } catch (error) {
    next(error)
  }
}

const getToken = (request) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.replace('bearer ', '')
  }
  return null
}

module.exports = userFinder
