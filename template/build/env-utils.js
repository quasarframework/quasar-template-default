var theme = process.argv[2] || 'mat'

exports.env = {
  dev: process.env.NODE_ENV === 'development',
  prod: process.env.NODE_ENV === 'production'
}

exports.platform = {
  theme: theme,
  cordovaAssets: './cordova/platforms/' + (theme === 'mat' ? 'android' : 'ios') + '/platform_www'
}
