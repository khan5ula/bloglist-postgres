const jwt = require('jsonwebtoken')
const router = require('express').Router()

const { SECRET } = require('../util/config')
const { User, Session } = require('../models')

router.post('/', async (request, response) => {
  const user = await User.findOne({
    where: {
      username: request.body.username,
    },
  })

  const passwordCorrect = request.body.password === 'salainen'

  if (!user || !passwordCorrect) {
    return response.status(401).json({
      error: 'invalid username or password',
    })
  }

  if (user.disabled) {
    return res.status(401).json({
      error: 'user is disabled',
    })
  }

  await Session.destroy({
    where: {
      userId: user.id,
    },
  })

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(userForToken, SECRET)

  await Session.create({
    userId: user.id,
    token: token,
  })

  response.status(200).send({ token, username: user.username, name: user.name })
})

module.exports = router
