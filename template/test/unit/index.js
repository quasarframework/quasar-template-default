// Polyfill fn.bind() for PhantomJS
/* eslint-disable no-extend-native */
Function.prototype.bind = require('function-bind')

import Vue from 'vue'
import Quasar from 'quasar'

Vue.use(Quasar)

// require all test files (files that ends with .spec.js)
let testsContext = require.context('./specs', true, /\.spec$/)
testsContext.keys().forEach(testsContext)

// require all src files except main.js for coverage.
// you can also change this to match only the subset of files that
// you want coverage for.
let srcContext = require.context('../../src', true, /^\.\/((?!(main|router)(\.js)?$|statics\/|assets\/))/)
srcContext.keys().forEach(srcContext)
