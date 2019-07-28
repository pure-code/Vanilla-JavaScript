const webpack = require('webpack');
const devMode = process.env.NODE_ENV !== 'production';
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');



module.exports = {
  entry: './app/index.js',
  output: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, './dist'),
  },

  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },

      {
        test: /\.pug$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              minimize: false,
              removeComments: false,
              collapseWhitespace: false
            }
          },
          {
            loader: 'pug-html-loader',
            options: {
              pretty: true
            }
          }
        ]
      },

      {
        test: /\.(png|jpg|gif|svg|mp3|eot|ttf|woff|woff2)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[hash].[ext]',
              context: 'app'
            },
          },
        ],
      },

      {
        test: /\.(sa|sc|c)ss$/,
        use: ExtractTextPlugin.extract({
          //fallback: "style-loader",
          use: [
            "css-loader",
            'sass-loader'
          ]
        })
      }

    ],
  },

  plugins: [
    new CleanWebpackPlugin(),
    
    new HtmlWebpackPlugin({
        template: 'app/pages/index.pug',
    }),
    
    new ExtractTextPlugin("style.[hash].css"),

    new webpack.HotModuleReplacementPlugin(),
    
  ],

};