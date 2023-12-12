const router = require('express').Router()

const { ReadingList } = require('../models/readinglist')

router.post('/', async (req, res) => {
  const readingList = await ReadingList.create(req.body)
  res.json(readingList)
})

module.exports = router
