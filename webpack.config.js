const path = require('path');

module.exports = {
  mode: 'production',
  entry: './ui/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'public'),
  },
};
