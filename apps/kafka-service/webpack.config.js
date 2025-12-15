const path = require('path');
const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');

/**
 * Webpack config for Nx Auth Service
 */
module.exports = {
  target: 'node',
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',

  entry: './src/main.ts',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'main.js',
    clean: true,
  },

  resolve: {
    alias: {
      '@packages': path.resolve(__dirname, '../../packages'),
    },
    extensions: ['.ts', '.js', '.json'], // ✅ include .json
  },

  module: {
    rules: [
      {
        test: /\.json$/i,
        type: 'asset/resource', 
        generator: {
          filename: '[name][ext]', 
        },
      },
    ],
  },

  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      tsconfigPath: path.join(__dirname, 'tsconfig.app.json'),
      main: './src/main.ts',
      tsconfig: './tsconfig.app.json',
      assets: ['src/assets',
         'src/swagger-output.json',
        ], 
      optimization: false,
      outputHashing: 'none',
      generatePackageJson: true,
    }),
  ],
};
