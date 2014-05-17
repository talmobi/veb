var gulp = require('gulp'),
    rename = require('gulp-rename'),
    minifycss = require('gulp-minify-css'),
    less = require('gulp-less'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify');


gulp.task('process-scripts', function() {
  return gulp.src('app/scripts/*.js')
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/scripts'))
    .pipe(rename({suffix: '.min'} ))
    .pipe(uglify())
    .pipe(gulp.dest('dist/scripts'))
});

gulp.task('process-css', function() {
  return gulp.src('app/styles/*.css')
    .pipe(concat('main.css'))
    .pipe(gulp.dest('dist/scripts'))
    .pipe(rename({suffix: '.min'} ))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/scripts'))
});


gulp.task('watch', function() {
  gulp.watch('src/scripts/*.js', ['process-scripts'])
});

gulp.task('default', function() {
  console.log('Default Gulp Task');
})