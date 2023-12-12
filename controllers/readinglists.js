const router = require('express').Router()
const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')
const { tokenExtractor, readingListFinder } = require('../util/middleware')
const { User, ReadingList } = require('../models')

router.post('/', tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
  const readingList = await ReadingList.create({
    userId: user.id,
    blogId: req.body.blogId,
  })
  return res.json(readingList).status(204).end()
})

router.put('/:id', tokenExtractor, readingListFinder, async (req, res) => {
  req.readingList.isRead = req.body.read
  await req.readingList.save()
  res.json(req.readingList).status(204).end()
})

module.exports = router
