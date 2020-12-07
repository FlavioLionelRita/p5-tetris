const path = require('path')

module.exports = {
  mode: 'development',
  entry: './src/client/main.ts',
  resolve: {
    extensions: [ '.ts', '.js' ]
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  output: {
    filename: 'main.js',
    path: path.join(__dirname, 'public/dist')
  },
  devtool: 'sourcemap'
}
