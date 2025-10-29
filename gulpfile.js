const path = require("path");

const { series, src, dest, parallel, watch } = require("gulp");
//const webpack = require("webpack");
const del = require("del");
const autoprefixer = require("gulp-autoprefixer");
///const sass = require("gulp-sass")(require("sass"));
const sourcemaps = require("gulp-sourcemaps");
const browserSync = require("browser-sync").create();

//const webpackConfig = require("./webpack.config.js");

const paths = {
  scripts: {
    src: "src/js/**/*.js",
    watch: "src/js/**/*.js",
  },
  styles: {
    src: "src/css/**/*.css",
  },
  img: {
    src: "src/img/**/*",
  },
  html: {
    src: "src/index.html",
  },
  dest: "dist",
  temp: ".tmp",
};

function clean() {
  return del([paths.dest, paths.temp]);
}

function server() {
  browserSync.init({
    server: {
      baseDir: "./dist",
    },
  });
}

function styles() {
  return src("src/css/**/*.css")  
    .pipe(sourcemaps.init())
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(sourcemaps.write())
    .pipe(dest(paths.dest))
    .pipe(browserSync.stream());
}

function scripts() {
  return src("src/js/**/*.js")
    .pipe(dest(paths.dest))
    .pipe(browserSync.stream());
}

function html() {
  return src(paths.html.src).pipe(browserSync.stream()).pipe(dest(paths.dest));
}

const imagemin = require('gulp-imagemin');

function img() {
  return src(paths.img.src)
    .pipe(imagemin())
    .pipe(dest(paths.dest + "/img"));
}

const build = series(clean, parallel(styles, scripts, html, img));
const dev = () => {
  watch(paths.scripts.watch, { ignoreInitial: false }, scripts).on(
    "change",
    browserSync.reload
  );
  watch(paths.styles.src, { ignoreInitial: false }, styles);
  watch(paths.img.src, { ignoreInitial: false }, img);
  watch(paths.html.src, { ignoreInitial: false }, html).on(
    "change",
    browserSync.reload
  );
  server();
};

exports.build = build;
exports.server = server;
exports.styles = styles;
exports.scripts = scripts;
exports.default = dev;
