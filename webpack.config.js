var webpack = require('webpack');


module.exports = {

  entry: {
    app: ['webpack/hot/dev-server', './app/app.js'],
  },

  output: {
    path: '.build',
    filename: 'bundle.js',
    publicPath: 'http://localhost:8080'
  },

  devServer: {
    contentBase: '.build',
    publicPath: 'http://localhost:8080'
  },

  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/
    }, {
      test: /\.css$/,
      loader: 'style-loader!css-loader',
      exclude: /node_modules/
    }]
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],

  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.js'
    }
  },

  target: 'electron'
}