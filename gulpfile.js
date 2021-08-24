const { src, dest, watch, parallel, series } = require('gulp');
const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify-es').default;
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const fileInclude = require('gulp-file-include');
const htmlmin = require('gulp-htmlmin');
const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');
const del = require('del');
// const pug = require("gulp-pug");

function browsersync() {
  browserSync.init({
    server: {
      baseDir: 'dist/',
    },
    port: 3000,
    notify: false,
  });
}

function html() {
  return src(['app' + '/*.html', '!' + 'app' + '/_*html'])
    .pipe(fileInclude())
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest('dist'))
    .pipe(browserSync.stream());
}

// const pughtml = () => {
//   return src('app/pug/pages/**/*.pug')
//     .pipe(
//       pug({
//         pretty: true,
//       })
//     )
//     .pipe(htmlmin({ collapseWhitespace: true }))
//     .pipe(dest("dist"))
//     .pipe(sync.stream());
// };

function scripts() {
  return src(['app/js/main.js', 'src/app/js/**/*.js', '!src/js/script.min.js'])
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

function fonts() {
  src('app/assets/fonts/**/*').pipe(ttf2woff()).pipe(dest('dist/assets/fonts'));
  return src('app/assets/fonts/**/*')
    .pipe(ttf2woff2())
    .pipe(dest('app/assets/fonts'));
}

// gulp.task("otf2ttf", function () {
//   return src(["app/assets" + "/fonts/*.otf"])
//     .pipe(fonter({ formats: ["ttf"] }))
//     .pipe(dest("app/assets/fonts"));
// });

function clean() {
  return del('dist');
}

function build() {
  return src(
    [
      'app/css/style.min.css',
      'app/assets/fonts*.woff, *.woff2',
      'app/js/main.min.js',
      'app/html*.html',
      // 'app/pug/pages/**/*.pug',
    ],
    { base: 'app' }
  ).pipe(dest('dist'));
}

function watching() {
  watch(['app/scss/**/*.scss'], styles);
  watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts);
  watch(['app/*.html'], html).on('change', browserSync.reload);
  // watch(['app/pug/**/*.pug'], pughtml).on('change', browserSync.reload);
}

exports.fonts = fonts;
exports.styles = styles;
exports.scripts = scripts;
exports.watching = watching;
exports.images = images;
exports.clean = clean;
exports.browsersync = browsersync;
// exports.pughtml = pughtml;

exports.build = series(clean, images, html, build, fonts); // or pughtml instead of html
exports.default = parallel(html, styles, scripts, browsersync, watching);
