const
  merge = require('webpack-merge'),
  env = require('./dev.env')

module.exports = merge(env, {
  NODE_ENV: '"development"'
})
