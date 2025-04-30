const path = require('path');
const rules = require('./webpack.rules');

module.exports = {
  entry: './src/main.ts',
  module: {
    rules,
  },
  resolve: {
    extensions: ['.js', '.ts', '.json'],
  },
};
