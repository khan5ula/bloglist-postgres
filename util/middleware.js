const jwt = require('jsonwebtoken')
const { SECRET } = require('./config.js')
const { Blog, ReadingList } = require('../models/')

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch {
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

const readingListFinder = async (req, res, next) => {
  req.readingList = await ReadingList.findByPk(req.params.id)
  next()
}

module.exports = { tokenExtractor, blogFinder, readingListFinder }
