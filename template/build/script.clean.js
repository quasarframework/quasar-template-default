const
  shell = require('shelljs'),
  path = require('path')

const
  config = require('../config')

const dir = path.resolve(__dirname, config.build.dir)

shell.rm('-rf', path.join(dir, '*'))
shell.rm('-rf', path.join(dir, '.*'))
console.log(' Cleaned build artifacts.\n')
