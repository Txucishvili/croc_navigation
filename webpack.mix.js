let mix = require('webpack-mix').mix;
const path = require('path');

mix.js('src/js/app.js', 'js').sourceMaps()
  .sass('src/sass/style.scss', 'css')
  .sass('src/sass/libreries.scss', 'css')
  .setPublicPath('src/dist')
  .options({
    processCssUrls: false,
  })
  .webpackConfig(webpack => {
    return {
      output: {
        filename: '[name].bundle.js',
        chunkFilename: "['name'].bundle.js"
      },
      devtool: "source-map",
      module: {
        loaders: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: [
              {
                loader: "babel-loader",
                options: {
                  "presets": [["es2015", {"modules": false}], "react"]
                }
              }
            ]
          },
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
          },
          {
            test: /\.(gif|png|jpe?g|svg)$/i,
            use: [
              'file-loader',
              {
                loader: 'image-webpack-loader',
                options: {
                  bypassOnDebug: true, // webpack@1.x
                  disable: true, // webpack@2.x and newer
                  sourceMap: true
                },
              },
            ],
          },
          {
            test: /\.scss$/,
            loader: 'style-loader!css-loader!sass-loader',
            options: {
              sourceMap: true
            }
          },
          {
            test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
            use: [{
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'fonts/'
              }
            }]
          }
        ]
      },
      plugins: [
        new webpack.ProvidePlugin({
          $: 'jquery',
        })
      ]
    }
  })
  .browserSync({
    proxy: false,
    server: './src',
    port: 3000,
    watch: true,
    open: false
  })
  .autoload({})
  .disableNotifications()
  .then((stats) => {
    console.log(Object.keys(stats.compilation.assets));
  });
