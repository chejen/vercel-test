const path = require('path');

module.exports = {
  mode: 'development',
  entry: './ui/index.js',
  devServer: {
    devMiddleware: {
      publicPath: '/',
    },
    static: './public',
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'public'),
  },
};
