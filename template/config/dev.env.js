const
  merge = require('webpack-merge'),
  env = require('./prod.env')

module.exports = merge(env, {
  NODE_ENV: '"development"'
})
