const rules = require('./webpack.rules');

rules.push(
  {
    test: /\.tsx?$/,
    exclude: /node_modules/,
    use: {
      loader: 'ts-loader',
    },
  },
  {
    test: /\.css$/,
    use: ['style-loader', 'css-loader'],
  }
);

module.exports = {
  entry: './src/renderer.tsx',
  module: {
    rules,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
};
