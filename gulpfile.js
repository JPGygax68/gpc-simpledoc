"use strict";

var gulp = require("gulp");
var gutil = require("gulp-util");
//var plumber = require("gulp-plumber");
var sourcemaps = require('gulp-sourcemaps');
var jade = require("gulp-jade");
var stylus = require("gulp-stylus");
var browserify = require('browserify');
var watchify = require('watchify');
var transform = require("vinyl-transform");
var source = require("vinyl-source-stream");
var buffer = require('vinyl-buffer');
var notify = require("gulp-notify");

// Jade ---------------------------------------------------

gulp.task('jade', [], function() {
  
  return gulp.src('src/**/*.jade', {base: 'src/'})
    .pipe( jade({pretty: true}) )
    .pipe( gulp.dest('./dist') )
    .pipe( notify("Jade task complete") );
});

// Browserify ---------------------------------------------

gulp.task("browserify", function() {

  var b = browserify('./src/main.js');

  return bundle();
  
  //--------
  
  function bundle() {
    
    return b.bundle()
      .on('error', notify.onError('Error: <%= error.message %>') )
      .pipe(source('gpc-simpledoc.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./dist'))
      .on('log', gutil.log)
      .pipe(notify('Browserify bundling completed'))
  }
});

// CSS ----------------------------------------------------

gulp.task('css', function() {

  return gulp.src('./src/**/*.styl')
    .pipe( stylus( { whitespace: true } ) )
    //.pipe( csso() )
    .pipe( gulp.dest('./dist/') )
    //.pipe( livereload( server ))
    .pipe( notify('CSS task complete') )
});

// Copy ---------------------------------------------------

gulp.task("copy", [], function() {
  
  return gulp.src('src/**/*.css', {base: 'src/'})
    .pipe( gulp.dest('./dist') )
    .pipe( notify("Copy task complete") );
});

// Overall build tasks ------------------------------------

gulp.task('build', ['jade', 'browserify', 'css']);

gulp.task('watch', function() {
 
  gulp.watch('src/**/*.jade', ['jade']);
  gulp.watch('src/**/*.js', ['browserify']);  
  gulp.watch('src/**/*.styl', ['css']);
  //gulp.watch('src/**/*.css', ['copy']); // TODO: get rid 
});

gulp.task("default", ['build', 'watch']);
