const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyEsPlugin = require('uglify-es-webpack-plugin');

module.exports = {
  config: (routes) => {
    return {
      entry: "./src/asset/javascript/"+ routes +"/"+ routes +".main.js",
      output: {
        filename: routes + ".js"
      },
      module: {
        loaders: [
          {
            exclude: /node_modules/
          },
          {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract('css-loader?minimize'),
          },
        ]
      },
      plugins: [
        new ExtractTextPlugin('../css/bundle.css'),
        new UglifyEsPlugin(),
      ],
    };
  }
}
