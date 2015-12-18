module.exports = {
  entry: './index',
  output: {
    path: __dirname + '/dist',
    filename: 'gitlactica.js',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: {
          presets: ['es2015'],
          plugins: ['transform-es2015-modules-commonjs'],
        }
      }
    ],
    resolve: {
      extensions: ['', '.js', '.jsx']
    }
  }
};
