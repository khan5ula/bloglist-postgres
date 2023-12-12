const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('blogs', 'year', {
      type: DataTypes.INTEGER,
      defaultValue: 1991,
      validate: {
        min: {
          args: [1991],
          msg: 'The minumum accepted year is 1991',
        },
        max: {
          args: [new Date().getFullYear()],
          msg: 'The year can not exceed the current year',
        },
      },
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('users', 'admin')
    await queryInterface.removeColumn('users', 'disabled')
  },
}
