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
            loaders: ['style-loader', 'css-loader'],
          },
        ]
      }
    };
  }
}
