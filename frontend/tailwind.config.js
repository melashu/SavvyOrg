/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
const textFillPlugin = require('tailwindcss-text-fill');
module.exports = {
  content: [
    './app/**/*.hbs',
    './app/**/*.ts',
    './app/**/*.js',
    './app/**/*.html',
    './node_modules/flowbite/**/*.js',
    './app/styles/app.css',
  ],
  theme: {
    extend: {},
  },
  plugins: [require('flowbite/plugin'), textFillPlugin],
};
