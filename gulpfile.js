var gulp = require('gulp'),
  jshint = require('gulp-jshint'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  sass = require('gulp-sass'),
  refresh = require('gulp-livereload'),
  lr = require('tiny-lr')(),
  embedlr = require('gulp-embedlr'),
  minifyCSS = require('gulp-minify-css'),
  browserify = require('browserify'),
  source = require('vinyl-source-stream'),
  streamify = require('gulp-streamify'),
  mocha = require('gulp-mocha'),
  path = require('path');

var scriptsLocation = ['lib/scripts/**/*.js', 'lib/app.js', 'app/main.js'],
  testsLocation = ['spec/client/*.js', 'spec/server/*.js'],
  stylesLocation = 'lib/stylesheets/*.css',
  viewsLocation = 'lib/views/*.html',
  LIVERELOAD_PORT = 35729,
  EXPRESS_ROOT = __dirname + '/dist',
  EXPRESS_PORT = 4114;

var app = require('./lib/app.js')();

gulp.task('lint', function() {
  gulp.src(scriptsLocation)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
})

gulp.task('test', function () {
  gulp.src(testsLocation)
    .pipe(mocha({reporter: 'nyan'}));
})

gulp.task('scripts', function() {
  var bundleStream = browserify('./lib/main.js').bundle();

  bundleStream
   .pipe(source('./bundle.js')) 
   .pipe(rename('bundle.min.js'))
   .pipe(streamify(uglify()))
   .pipe(gulp.dest('dist/build'))
   .pipe(refresh(lr))
})
 
gulp.task('styles', function() {
  gulp.src(stylesLocation)
    .pipe(minifyCSS())
    .pipe(gulp.dest('dist/build'))
    .pipe(refresh(lr))
})
 
gulp.task('serve', function() {
  app.listen(EXPRESS_PORT);
  lr.listen(LIVERELOAD_PORT);
})
 
gulp.task('html', function() {
  gulp.src(viewsLocation)
    .pipe(embedlr())
    .pipe(gulp.dest('dist/views/'))
    .pipe(refresh(lr))
})
 
gulp.task('default', ['styles', 'html', 'scripts', 'test', 'serve'], function() {
  gulp.watch(scriptsLocation, ['scripts'])
  gulp.watch(stylesLocation, ['styles'])
  gulp.watch(viewsLocation, ['html'])
})