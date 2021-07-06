const { src, dest, watch, parallel } = require('gulp');
const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify-es').default;
const autoprefixer = require('gulp-autoprefixer');
//---------------------------------------------------//
function browsersync() {
  browserSync.init({
    server: {
      baseDir: 'app/',
    },
  });
}

function scripts() {
  return src([
    'node_modules/jquery/dist/jquery.js', //some vendor here is 4ex j-querry| not a min because we'll minify it all together with my js files
    'app/js/main.js',
  ])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('app/js'))
    .pipe(browserSync.stream());
}

function styles() {
  return src('app/scss/style.scss')
    .pipe(
      scss({
        outputStyle: 'compressed',
      })
    )
    .pipe(concat('style.min.css'))
    .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'] }))
    .pipe(dest('app/css'))
    .pipe(browserSync.stream());
}

function watching() {
  watch(['app/scss/**/*.scss'], styles);
  watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts); //only one 4now, but we can add more later like with scss
  watch(['app/*.html']).on('change', browserSync.reload);
}

//----------------------------------------------------//
exports.styles = styles;
exports.scripts = scripts;
exports.watching = watching;
exports.browsersync = browsersync;
exports.default = parallel(scripts, browsersync, watching);
