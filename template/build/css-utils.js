const
  ExtractTextPlugin = require('extract-text-webpack-plugin'),
  purify = require('purify-css'),
  glob = require('glob'),
  path = require('path'),
  fs = require('fs')

const env = require('./env-utils')

module.exports.cssLoaders = function (options) {
  options = options || {}

  const cssLoader = {
    loader: 'css-loader',
    options: {
      minimize: env.prod,
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    const loaders = [cssLoader]
    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// Generate loaders for standalone style files (outside of .vue)
module.exports.styleLoaders = function (options) {
  const output = []
  const loaders = module.exports.cssLoaders(options)
  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }
  return output
}

module.exports.purify = function () {
  var css = glob.sync(path.join(__dirname, '../dist/**/*.css'))
  var js = glob.sync(path.join(__dirname, '../dist/**/*.js'))

  return Promise.all(css.map(file => {
    return new Promise((resolve, reject) => {
      console.log('\n Purifying ' + path.relative(path.join(__dirname, '../dist'), file).bold + '...')
      purify(js, [file], {minify: true}, purified => {
        var oldSize = fs.statSync(file).size
        fs.writeFileSync(file, purified)
        var newSize = fs.statSync(file).size

        console.log(
          ' * Reduced size by ' + ((1 - newSize / oldSize) * 100).toFixed(2) + '%, = require(' +
          getSize(oldSize) + ' to ' + getSize(newSize) + '.'
        )
        resolve()
      })
    })
  }))
}
