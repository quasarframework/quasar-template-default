var
  config = require('../config'),
  webpack = require('webpack'),
  merge = require('webpack-merge'),
  cssUtils = require('./css-utils'),
  baseWebpackConfig = require('./webpack.base.conf'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')


var webpackConfig =  merge(baseWebpackConfig, {

  module: {
    rules: cssUtils.styleRules({
      sourceMap: config.dev.cssSourceMap,
      postcss: true
    })
  },
  devtool: '#inline-source-map',
   plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/test.env')
    }),
    new webpack.SourceMapDevToolPlugin({
      filename: null, // if no value is provided the sourcemap is inlined
      test: /\.(ts|js)($|\?)/i
    })
  ]
})
// no need for app entry during tests
delete webpackConfig.entry

module.exports = webpackConfig
