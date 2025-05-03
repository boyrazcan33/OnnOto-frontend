const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { DefinePlugin } = require('webpack');
const dotenv = require('dotenv');

// Load environment variables
const env = dotenv.config().parsed || {};
const envKeys = Object.keys(env).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(env[next]);
  return prev;
}, {});

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: './src/index.tsx',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'js/[name].[contenthash:8].js',
      publicPath: '/',
      clean: true,
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.jsx'],
      alias: {
        '@': path.resolve(__dirname, '../src'),
      },
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: 'ts-loader',
        },
        {
          test: /\.(scss|css)$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            'sass-loader',
          ],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'images/[name].[hash:8][ext]',
          },
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name].[hash:8][ext]',
          },
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './static/index.html',
        //favicon: path.resolve(__dirname, './static/icons/favicon.ico'),
      }),
      new DefinePlugin(envKeys),
      ...(isProduction ? [new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash:8].css',
      })] : []),
    ],
    devServer: {
      historyApiFallback: true,
      port: 3000,
      hot: true,
      static: {
        directory: path.join(__dirname, 'static'),
      },
    },
    devtool: isProduction ? 'source-map' : 'eval-cheap-module-source-map',
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
    },
  };
};