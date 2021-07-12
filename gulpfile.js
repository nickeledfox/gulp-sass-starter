const { src, dest, watch, parallel, series } = require('gulp');
const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify-es').default;
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const fileInclude = require('gulp-file-include');
const htmlmin = require('gulp-htmlmin');
const del = require('del');
//-------------------------------------------------//
function browsersync() {
  browserSync.init({
    server: {
      baseDir: './',
    },
    port: 3000,
    notify: false,
  });
}

function html() {
  return src(['app' + '/*.html', '!' + 'app' + '/_*html'])
    .pipe(fileInclude())
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest('./')) //change on 'dist/html' if needed
    .pipe(browserSync.stream());
}

function scripts() {
  return src([
    // 'node_modules/jquery/dist/jquery.js', // some vendor here is 4ex j-querry| not a min because we'll minify it all together with my js files
    'app/js/hamburger.js',
    'app/js/main.js',
  ])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('app/js'))
    .pipe(browserSync.stream());
}

function styles() {
  return src('app/scss/main.scss')
    .pipe(
      scss({
        outputStyle: 'compressed',
        includePath: ['./node_modules'],
      })
    )
    .pipe(concat('style.min.css'))
    .pipe(
      autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true })
    )
    .pipe(dest('app/css'))
    .pipe(browserSync.stream());
}

function images() {
  return src('app/assets/images/**/*')
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 75, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
        }),
      ])
    )
    .pipe(dest('dist/assets/images'));
}

function clean() {
  return del('dist');
}

function build() {
  return src(
    [
      'app/css/style.min.css',
      'app/fonts/**/*',
      'app/js/main.min.js',
      // 'app/html*.html',
    ],
    { base: 'app' }
  ).pipe(dest('dist'));
}

function watching() {
  watch(['app/scss/**/*.scss'], styles);
  watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts); //only one 4now, but we can add more later like with scss
  watch(['app/*.html'], html).on('change', browserSync.reload);
}

//-------------------------------------------------//
exports.styles = styles;
exports.scripts = scripts;
exports.watching = watching;
exports.images = images;
exports.clean = clean;
exports.browsersync = browsersync;

exports.build = series(clean, images, html, build);
exports.default = parallel(html, styles, scripts, browsersync, watching);
