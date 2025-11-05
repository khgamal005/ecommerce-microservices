const path = require('path');
const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');

/**
 * Webpack config for Nx Auth Service
 */
module.exports = {
  target: 'node',
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',

  entry: './src/main.ts', // 👈 your main file
  output: {
    path: path.join(__dirname, 'dist'),
  },

  

  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc', // uses TypeScript compiler instead of SWC
      tsconfigPath: path.join(__dirname, 'tsconfig.app.json'),
      main: './src/main.ts',
      tsconfig:'./tsconfig.app.json',
      assets: ['src/assets'],
      optimization: false,
      outputHashing: 'none',
      generatePackageJson: true,
    }),
  ],
};
