const router = require('express').Router()

const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')
const { Op } = require('sequelize')
const { tokenExtractor } = require('../util/middleware')
const { Blog, User } = require('../models')

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['id', 'username', 'name'],
    },
    where: {
      [Op.or]: {
        title: {
          [Op.iLike]: `%${req.query.search || ''}%`,
        },
        author: {
          [Op.iLike]: `%${req.query.search || ''}%`,
        },
      },
    },
    order: [['likes', 'DESC']],
  })
  res.json(blogs)
})

router.get('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    res.json(req.blog)
  } else {
    res.status(404).end()
  }
})

router.post('/', tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
  const blog = await Blog.create({
    ...req.body,
    userId: user.id,
    date: new Date(),
  })
  return res.json(blog.toJSON()).status(204).end()
})

router.delete('/:id', tokenExtractor, blogFinder, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
  if (user && req.blog) {
    await req.blog.destroy()
    res.status(200).end()
  } else {
    return res.status(404).end()
  }
})

router.put('/:id', blogFinder, async (req, res) => {
  req.blog.likes = req.body.likes
  await req.blog.save()
  res.json(req.blog).status(204).end()
})

module.exports = router
