var fs = require('fs')
var path = require('path')
var webpack = require('webpack')
module.exports = {

  entry: path.resolve(__dirname, 'server.js'),

  output: {
    filename: 'server.bundle.js'
  },

  target: 'node',

  // keep node_module paths out of the bundle
  externals: fs.readdirSync(path.resolve(__dirname, 'node_modules')).concat([
    'react-dom/server', 'react/addons',
  ]).reduce(function (ext, mod) {
    ext[mod] = 'commonjs ' + mod
    return ext
  }, {}),

  node: {
    __filename: true,
    __dirname: true
  },

  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader?presets[]=es2015&presets[]=react' }
    ]
  },

  plugins: [
    new webpack.ProvidePlugin({
      React: 'react',
      GLOBAL: '../modules/global',
      AJAX: '../modules/AJAX',
      Link: '../modules/link',
      browserHistory: '../modules/history',
      storage: '../modules/storage',
      Loading: './loading',
      NoData: './noData',
      Token: '../modules/token',
      Mixins: '../modules/mixins',
      myEvent: '../modules/myEvent',
      parseQuery: '../modules/parseQuery'
    })
  ] 
}