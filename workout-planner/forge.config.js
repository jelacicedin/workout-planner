const { WebpackPlugin } = require('@electron-forge/plugin-webpack');
const path = require('path');

module.exports = {
  packagerConfig: {},
  rebuildConfig: {},
  makers: [],
  plugins: [
    new WebpackPlugin({
      mainConfig: './webpack.main.config.js',
      renderer: {
        config: './webpack.renderer.config.js',
        entryPoints: [
          {
            name: 'main_window',
            html: './src/index.html',
            js: './src/renderer.tsx',
            preload: {
              js: './src/preload.ts',
            },
          },
        ],
      },
    }),
  ],
};
