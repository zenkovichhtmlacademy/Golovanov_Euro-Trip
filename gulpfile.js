const gulp = require("gulp");
const htmlmin = require("gulp-htmlmin");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const csso = require("postcss-csso");
const rename = require("gulp-rename");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const svgstore = require("gulp-svgstore");
const terser = require("gulp-terser");
const del = require("del");
const sync = require("browser-sync").create();

// HTML

const html = () => {
  return gulp.src("source/*.html")
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest("build"))
    .pipe(sync.stream());
}

exports.html = html;

// Styles

const stylesBuild = () => {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"));
}

exports.stylesBuild = stylesBuild;

const stylesDev = () => {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
}

exports.stylesDev = stylesDev;

// Images

const images = () => {
  return gulp.src("source/img/**/*.{jpg,png,svg}")
    .pipe(imagemin([
      imagemin.mozjpeg({progressive: true}),
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("build/img"));
}

exports.images = images;

// WebP

const createWebP = () => {
  return gulp.src("build/img/**/*.{jpg,png}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("build/img/WebP"));
}

exports.createWebP = createWebP;

// Sprite

const sprite = () => {
  return gulp.src("source/img/icons/*.svg")
    .pipe(imagemin([
      imagemin.svgo({
        plugins: [
          {removeViewBox: false},
        ]
      })
    ]))
    .pipe(svgstore())
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
}

exports.sprite = sprite;

// JS

const scripts = () => {
  return gulp.src("source/js/script.js")
    .pipe(sourcemap.init())
    .pipe(terser())
    .pipe(rename("script.min.js"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/js"))
    .pipe(sync.stream());
}

exports.scripts = scripts;

// Copy

const copy = () => {
  return gulp.src([
    "source/fonts/*.{woff2,woff}",
    "source/*.ico",
    "source/img/**/*.{jpg,png,svg}"
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"))
}

exports.copy = copy;

// Clean

const clean = () => {
  return del("build");
}

exports.clean = clean;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: "build"
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Watcher

const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series("stylesDev"));
  gulp.watch("source/*.html", gulp.series("html"));
  gulp.watch("source/js/*.js", gulp.series("scripts"));
  gulp.watch("source/img/**/*", gulp.series("copy", "sprite"), sync.reload());
}

// Build

const build = gulp.series(
  clean,
  gulp.parallel(
    copy,
    html,
    stylesBuild,
    sprite,
    scripts,
  ),
  images, createWebP, server
);

exports.build = build;

// Dev

exports.default = gulp.series(
  clean,
  gulp.parallel(
    copy,
    html,
    stylesDev,
    sprite,
    scripts,
  ),
  gulp.series(
    createWebP, server, watcher
  )
);
