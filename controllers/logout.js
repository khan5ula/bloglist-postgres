const router = require('express').Router()
const { Session } = require('../models')
const userFinder = require('../util/userFinder')

router.delete('/', userFinder, async (request, response, next) => {
  try {
    if (!request.user)
      response.status(400).send({ error: 'user to logout was not found' })
    await Session.destroy({ where: { userId: request.user.id } })
    return response.status(200).json({ message: 'logged out' })
  } catch (error) {
    next(error)
  }
})

module.exports = router
