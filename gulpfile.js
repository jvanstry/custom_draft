var gulp = require('gulp'),
  jshint = require('gulp-jshint'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  refresh = require('gulp-livereload'),
  lr = require('tiny-lr')(),
  embedlr = require('gulp-embedlr'),
  minifyCSS = require('gulp-minify-css'),
  browserify = require('browserify'),
  source = require('vinyl-source-stream'),
  streamify = require('gulp-streamify'),
  mocha = require('gulp-spawn-mocha');

var clientScriptsLocation = 'public/scripts/*.js',
  serverScriptsLocation = ['models/*.js', 'config/*.js', 
                            'controllers/*.js', './app.js'],

  scriptsLocation = ['models/*.js', 'config.*js', 'controllers/*.js', 
                      './app.js', 'public/scripts/*.js', 'test/**/*.js', 'test/*.js'],
                      
  testsLocation = ['test/client/*.js', 'test/server/*.js', 'test/models/*.js'],
  stylesLocation = 'public/styles/*.css',
  viewsLocation = 'public/views/*.ejs',
  LIVERELOAD_PORT = 35729,
  EXPRESS_PORT = 4114;

process.env.NODE_ENV = 'dev';
var app = require('./app.js');
var server;

gulp.task('lint', function() {
  gulp.src(scriptsLocation)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
})

gulp.task('test', function () {
  return test().on('error', function (e) {
    throw e;
  });  
})

function test() {
  return gulp.src(testsLocation, {read: false}).pipe(mocha({
    r: 'test/setup.js',
    R: 'spec',
    c: true,
    debug: true
  })).on('error', console.warn.bind(console));
}

gulp.task('client-scripts', function() {
  var bundleStream = browserify('./public/main.js').bundle();

  bundleStream
   .pipe(source('./bundle.js')) 
   .pipe(rename('bundle.min.js'))
   .pipe(streamify(uglify()))
   .pipe(gulp.dest('build/'))
   .pipe(refresh(lr))
})
 
gulp.task('styles', function() {
  gulp.src(stylesLocation)
    .pipe(minifyCSS())
    .pipe(gulp.dest('build/styles'))
    .pipe(refresh(lr))
})
 
gulp.task('serve', function() {
  server = app.start(EXPRESS_PORT);
  lr.listen(LIVERELOAD_PORT);
})
 
gulp.task('html', function() {
  gulp.src(viewsLocation)
    .pipe(embedlr())
    .pipe(gulp.dest('build/views/'))
    .pipe(refresh(lr))
})

//TODO: figure out why the heck we can't get a new app instance
function breakRequireCache(cb){
  for(key in require.cache){
    delete require.cache[key];
  }

  cb()
}

function restartExpressServer(){
  server.close();

  // get the newly modified instance of the express server
  app = require('./app.js')

  server = app.start(EXPRESS_PORT);
}

var defaultTasks = ['styles', 'html', 'lint', 'client-scripts', 
  'test', 'serve'];

gulp.task('default', defaultTasks, function() {
    gulp.watch(clientScriptsLocation, ['lint', 'client-scripts']);
    gulp.watch(serverScriptsLocation, ['lint'])
      .on('change', function(data) {
    // delay executing to ensure linting task completion
    // fileChanged = data.path;
        process.nextTick(function(){
          breakRequireCache(restartExpressServer)
        });
      });
    gulp.watch(stylesLocation, ['styles']);
    gulp.watch(viewsLocation, ['html']);
})
