const path = require('path');

module.exports = {
  resolve: {
    fallback: { path: require.resolve('path-browserify') },
  },
  module: {
    rules: [
      {
        test: [/\.(js|jsx)$/],
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
      {
        resolve: {
          extensions: ['.js', '.jsx'],
        },
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(woff|woff2|eot|ttf)$/,
        use: ['url-loader?limit=100000'],
      },
      {
        test: /\.(gif|png|jpe?g|jpg|svg)$/i,
        use: ['file-loader'],
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
    ],
  },
};
