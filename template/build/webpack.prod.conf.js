const
  path = require('path'),
  webpack = require('webpack'),
  merge = require('webpack-merge'),
  ExtractTextPlugin = require('extract-text-webpack-plugin'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin'),
  CopyWebpackPlugin = require('copy-webpack-plugin')

const
  config = require('../config'),
  cssUtils = require('./css-utils'),
  baseWebpackConfig = require('./webpack.base.conf')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const webpackConfig = merge(baseWebpackConfig, {
  devtool: config.build.debug ? '#source-map' : false,
  module: {
    rules: cssUtils.styleLoaders({
      sourceMap: config.build.debug,
      extract: true
    })
  },
  output: {
    path: resolve('dist'),
    publicPath: config.build.publicPath,
    filename: 'js/[name].js',
    chunkFilename: 'js/[id].[chunkhash].js'
  },
  plugins: [
    // extract css into its own file
    new ExtractTextPlugin({
      filename: '[name].[contenthash].css'
    }),
    new HtmlWebpackPlugin({
      filename: resolve('dist/index.html'),
      template: 'src/index.html',
      inject: true,
      minify: config.build.debug ? {} : {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
    }),
    // keep module.id stable when vender modules does not change
    new webpack.HashedModuleIdsPlugin(),
    // split vendor js into its own file
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          (
            module.resource.indexOf('quasar') > -1 ||
            module.resource.indexOf(
              path.join(__dirname, '../node_modules')
            ) === 0
          )
        )
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash = require(being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: resolve('src/statics'),
        to: resolve('dist/statics')
      }
    ])
  ]
})

if (!config.build.debug) {
  webpackConfig.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: config.build.debug
    })
  )
  webpackConfig.plugins.push(
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS = require(different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    })
  )
}

module.exports = webpackConfig
