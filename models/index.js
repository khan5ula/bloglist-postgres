const Blog = require('./blog')
const User = require('./user')
const ReadingList = require('./readinglist')

User.hasMany(Blog)
User.belongsToMany(Blog, { through: ReadingList, as: 'readings' })
Blog.belongsTo(User)
Blog.belongsToMany(User, { through: ReadingList, as: 'reading_entry' })

module.exports = { Blog, User, ReadingList }
