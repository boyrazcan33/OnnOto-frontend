// Modified webpack.config.js to ensure environment variables get properly defined
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { DefinePlugin, EnvironmentPlugin } = require('webpack');
const dotenv = require('dotenv');
const CopyPlugin = require('copy-webpack-plugin'); 

// Load environment variables
const env = dotenv.config().parsed || {};

// Define default environment variables
const defaultEnv = {
  'REACT_APP_API_URL': '/api',
  'REACT_APP_DEFAULT_LANGUAGE': 'et',
  'NODE_ENV': process.env.NODE_ENV || 'development'
};

// Merge with .env file values
const envVars = { ...defaultEnv, ...env };

// Create environment variables for webpack
const envKeys = Object.keys(envVars).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(envVars[next]);
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
      extensions: ['.tsx', '.ts', '.js', '.jsx', '.json'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
      fallback: {
        // Add polyfills for Node.js core modules
        "path": require.resolve("path-browserify"),
        "os": require.resolve("os-browserify/browser"),
        "fs": false,
        "util": require.resolve("util/"),
        "buffer": require.resolve("buffer/"),
        "process": require.resolve("process/browser")
      }
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
                compilerOptions: {
                  noEmit: false,
                  module: 'esnext',
                  moduleResolution: 'node',
                  jsx: 'react-jsx'
                }
              }
            }
          ]
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
        filename: 'index.html',
        // Add these options to ensure proper handling of the manifest and other assets
        minify: isProduction,
        scriptLoading: 'defer',
        inject: true
      }),
      new DefinePlugin({
        ...envKeys,
        // Important: Make sure process.env is defined
        'process.env': JSON.stringify(envVars)
      }),
      new EnvironmentPlugin(Object.keys(envVars)),
      new CopyPlugin({
        patterns: [
          { 
            from: 'static',
            to: '', // Copy to root dist folder
            globOptions: {
              ignore: ['**/index.html'] // Avoid copying index.html as it's handled by HtmlWebpackPlugin
            }
          }
        ],
      }),
      ...(isProduction ? [new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash:8].css',
      })] : []),
    ],
    devServer: {
      historyApiFallback: true, // This is critical for SPA routing
      port: 8080,
      open: true,
      hot: true,
      static: {
        directory: path.join(__dirname, 'static'),
        publicPath: '/'
      },
      proxy: {
        '/api': {
          target: 'http://localhost:8087',
          pathRewrite: { '^/api': '/api' },
          changeOrigin: true,
          secure: false,
          logLevel: 'debug',
          onError: (err, req, res) => {
            console.error('Proxy error:', err);
            res.writeHead(500, {
              'Content-Type': 'text/plain',
            });
            res.end('Proxy error: ' + err);
          },
          bypass: function(req, res, proxyOptions) {
            if (req.url.startsWith('/static/')) {
              return req.url;
            }
          }
        },
      }
    },
    devtool: isProduction ? 'source-map' : 'eval-cheap-module-source-map',
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
    },
  };
};