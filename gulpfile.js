var gulp = require('gulp'),
    rename = require('gulp-rename'),
    minifycss = require('gulp-minify-css'),
    less = require('gulp-less'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    htmlreplace = require('gulp-html-replace'),
    bower = require('gulp-bower-files');

gulp.task('process-scripts', function() {
  return gulp.src('app/scripts/*.js')
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/scripts'))
    .pipe(rename({suffix: '.min'} ))
    .pipe(uglify())
    .pipe(gulp.dest('dist/scripts'));
});

gulp.task('process-less', function() {
  return gulp.src('app/styles/*.less')
    .pipe(concat('main.css'))
    .pipe(less()) // process the less files
    .pipe(gulp.dest('app/styles'))
});

gulp.task('process-css', function() {
  return gulp.src('app/styles/*.css')
    .pipe(concat('main.css'))
    .pipe(gulp.dest('dist/styles'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/styles'));
});

gulp.task('process-images', function() {
  return gulp.src('app/images/*')
    .pipe(gulp.dest('dist/images'));

});

gulp.task('process-music', function() {
  return gulp.src('app/music/*')
    .pipe(gulp.dest('dist/music'));
});

gulp.task('process-bower', function() {
  return bower()
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('dist/scripts'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/scripts'));
});

gulp.task('process-html', function() {
  return gulp.src('app/index.html')
    .pipe(htmlreplace({
      'css': 'styles/main.min.css',
      'vendorjs': 'scripts/vendor.min.js',
      'js': 'scripts/main.min.js'
    }))
    .pipe(gulp.dest('dist/'));
});


// process client specific files
var verilyFiles = [
  'app/.htaccess', 'app/404.html', 'app/favicon.ico', 'app/robots.txt'
];
gulp.task('process-verily-files', function() {
  return gulp.src(verilyFiles)
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
  gulp.watch('src/scripts/*.js', ['process-scripts']);
});

gulp.task('default', function() {
  console.log('Default Gulp Task');
})