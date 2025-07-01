const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { DefinePlugin } = require('webpack');
const dotenv = require('dotenv');
const CopyPlugin = require('copy-webpack-plugin');

// Load environment variables
const env = dotenv.config().parsed || {};
const envKeys = Object.keys(env).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(env[next]);
  return prev;
}, {});

// Make sure we have process.env.NODE_ENV defined
if (!envKeys['process.env.NODE_ENV']) {
  envKeys['process.env.NODE_ENV'] = JSON.stringify(process.env.NODE_ENV || 'development');
}

// Ensure critical environment variables are properly defined
// This ensures they're replaced correctly in the build process
const criticalEnvVars = {
  'process.env.REACT_APP_API_URL': JSON.stringify(process.env.REACT_APP_API_URL || 'https://onnoto-backend-57045655083.us-central1.run.app/api'),
  'process.env.REACT_APP_DEFAULT_LANGUAGE': JSON.stringify(process.env.REACT_APP_DEFAULT_LANGUAGE || 'et'),
  'process.env.REACT_APP_GOOGLE_MAPS_API_KEY': JSON.stringify(process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''),
  'process.env.REACT_APP_MAP_ID': JSON.stringify(process.env.REACT_APP_MAP_ID || ''),
  'process.env.REACT_APP_WS_URL': JSON.stringify(process.env.REACT_APP_WS_URL || 'wss://onnoto-backend-57045655083.us-central1.run.app/ws')
};

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
          test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
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
        scriptLoading: 'defer',
        inject: true,
        minify: isProduction
      }),
      new DefinePlugin({
        ...envKeys,
        ...criticalEnvVars, // Include our critical environment variables
        'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development')
      }),
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
      port: 3000,
      open: true,
      hot: true,
      static: {
        directory: path.join(__dirname, 'static'),
        publicPath: '/'
      },
      proxy: {
        '/api': {
    target: 'https://onnoto-backend-57045655083.us-central1.run.app',  // ← Change this line
    changeOrigin: true,
    secure: true,
    logLevel: 'debug',
    pathRewrite: {
      '^/api': '/api'  // Keep the /api path
    }
  }
      },

      // 🆕 ADD THIS: Custom middleware to serve env-config.js in development
      setupMiddlewares: (middlewares, devServer) => {
        // Add the /env-config.js route (same logic as production server.js)
        devServer.app.get('/env-config.js', (req, res) => {
          res.set('Content-Type', 'application/javascript');
          
          // Create the same runtime configuration as production server.js
          const envConfig = `
            window._env_ = {
              REACT_APP_API_URL: "${process.env.REACT_APP_API_URL || 'https://onnoto-backend-57045655083.us-central1.run.app/api'}",
              REACT_APP_DEFAULT_LANGUAGE: "${process.env.REACT_APP_DEFAULT_LANGUAGE || 'et'}",
              REACT_APP_GOOGLE_MAPS_API_KEY: "${process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''}",
              REACT_APP_MAP_ID: "${process.env.REACT_APP_MAP_ID || ''}",
              REACT_APP_WS_URL: "${process.env.REACT_APP_WS_URL || 'wss://onnoto-backend-57045655083.us-central1.run.app/ws'}"
            };
          `;
          
          res.send(envConfig);
        });

        return middlewares;
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