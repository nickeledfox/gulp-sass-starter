## About

Gulp/Sass based website starter boilerplate. Helps organize and automate routine.

## Closer look

It can be used for HTML with either [file include](https://dev.to/caiojhonny/html-includes-with-gulp-js-2def) or [pug](https://pugjs.org/api/getting-started.html) in case of multiply pages project. JS files can be bundled by gulp itself or [webpack-stream](https://www.npmjs.com/package/webpack-stream). Long story short webpack-stream allows us to use [ES6 modules](https://webpack.js.org/api/module-methods/) import/export functionality without the entire webpack config. If you don't use any vendors better option is just to let gulp bundle everything.

1. `Compiles sass and adds post css autoprefixer`
2. `HTML/CSS/JavaScript minification`
3. `JavaScript concatenation`
4. `Image optimization`
5. `Converts fonts (otf to ttf; ttf to woff and woff2)`
6. `Browser-Sync Live Reloading`
7. `Converts ECMAScript 2015+ code into a backwards compatible version of JavaScript in current and older browsers or environments`
