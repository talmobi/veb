var gulp = require('gulp'),
    rename = require('gulp-rename'),
    minifycss = require('gulp-minify-css'),
    less = require('gulp-less'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    htmlreplace = require('gulp-html-replace'),
    bower = require('gulp-bower');


function process_scripts() {
  return gulp.src('app/scripts/*.js')
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/scripts'))
    .pipe(rename({suffix: '.min'} ))
    .pipe(uglify())
    .pipe(gulp.dest('dist/scripts'));
}
gulp.task('process-scripts', function() {
  return process_scripts();
});


function process_less() {
  return gulp.src('app/styles/*.less')
    .pipe(concat('main.css'))
    .pipe(less()) // process the less files
    .pipe(gulp.dest('app/styles'));
}
gulp.task('process-less', function() {
  return process_less();
});


function process_css() {
  return gulp.src('app/styles/*.css')
    .pipe(concat('main.css'))
    .pipe(gulp.dest('dist/styles'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/styles'));
}
gulp.task('process-css', function() {
  return process_css();
});


function process_images() {
  return gulp.src('app/images/*')
    .pipe(gulp.dest('dist/images'));
}
gulp.task('process-images', function() {
  return process_images();
});

function process_data() {
  return gulp.src('app/data/*')
    .pipe(gulp.dest('dist/data'));
}
gulp.task('process-data', function() {
  return process_data();
});


function process_music() {
  return gulp.src('app/music/*')
    .pipe(gulp.dest('dist/music'));
}
gulp.task('process-music', function() {
  return process_music();
});


function process_bower() {
  return bower()
    .pipe(concat('bower.js'))
    .pipe(gulp.dest('dist/scripts'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/scripts'));
}
gulp.task('process-bower', function() {
  return process_bower();
});

function process_vendor() {
  return gulp.src('app/scripts/vendor/*.js')
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('dist/scripts'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/scripts'));
}
gulp.task('process-vendor', function() {
  return process_vendor();
})


function process_html() {
  return gulp.src('app/index.html')
    .pipe(htmlreplace({
      'css': 'styles/main.min.css',
      'vendorjs': 'scripts/vendor.min.js',
      'js': 'scripts/main.min.js'
    }))
    .pipe(gulp.dest('dist/'));
}
gulp.task('process-html', function() {
  return process_html();
});


// process client specific files
var verilyFiles = [
  'app/.htaccess', 'app/404.html', 'app/favicon.ico', 'app/robots.txt'
];
function process_verily_files() {
  return gulp.src(verilyFiles)
    .pipe(gulp.dest('dist'));
}
gulp.task('process-verily-files', function() {
  return process_verily_files();
});


gulp.task('watch', function() {
  gulp.watch('src/scripts/*.js', ['process-scripts']);
});

gulp.task('build', function() {
  return process_less()
    .pipe(process_verily_files())
    .pipe(process_css())
    .pipe(process_vendor())
    .pipe(process_scripts())
    .pipe(process_html())
    .pipe(process_data());
});

gulp.task('default', function() {
  console.log('Default Gulp Task');
})