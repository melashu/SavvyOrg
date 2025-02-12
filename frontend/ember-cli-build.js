/* eslint-disable n/no-missing-require */
/* eslint-disable prettier/prettier */
'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const { Webpack } = require('@embroider/webpack');

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    'ember-cli-babel': { enableTypeScriptTransform: true },

    // Add options here
    postcssOptions: {
      compile: {
        plugins: [
          {
            module: require('tailwindcss'),
            options: {
              config: './tailwind.config.js',
            },
          },
          require('autoprefixer'),
        ],
      },
    },
    minifyCSS: {
      options: {
        advanced: true,
      },
      enabled: false,
    },
  });

  // app.import('./app/styles/app.css');
  app.import('node_modules/@fortawesome/fontawesome-free/css/all.min.css');
  app.import(
    'node_modules/@fortawesome/fontawesome-free/webfonts/fa-solid-900.woff2',
    {
      destDir: 'webfonts',
    },
  );
  app.import('node_modules/flowbite/dist/flowbite.min.css');
  app.import('node_modules/flowbite/dist/flowbite.js');

  return require('@embroider/compat').compatBuild(app, Webpack);

  // return app.toTree();
};
