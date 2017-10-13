const
  cssUtils = require('./css-utils'),
  env = require('./env-utils'),
  config = require('../config')

module.exports = {
  loaders: cssUtils.cssLoaders({
    sourceMap: env.prod
      ? config.build.debug
      : config.dev.cssSourceMap,
    extract: env.prod
  }),
  transformToRequire: {
    video: 'src',
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  }
}
