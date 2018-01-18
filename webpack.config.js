var ExtractTextPlugin = require('extract-text-webpack-plugin');

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
            loader: ExtractTextPlugin.extract('css-loader'),
          },
        ]
      },
      plugins: [
        new ExtractTextPlugin('../css/bundle.css'),
      ]
    };
  }
}
