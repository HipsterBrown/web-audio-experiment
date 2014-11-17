var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefix = require('gulp-autoprefixer'),
    hint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    sourcemap = require('gulp-sourcemaps'),
    connect   = require('gulp-connect');

gulp.task('serve', function(){
  'use strict';

  connect.server({
    root: ['public'],
    livereload: true
  });
});

gulp.task('html', function(){
  'use strict';

  gulp.src('public/index.html')
      .pipe(connect.reload());
});

gulp.task('styles', function(){
  'use strict';

  gulp.src('scss/style.scss')
      .pipe(sass())
      .pipe(autoprefix())
      .pipe(gulp.dest('public'))
      .pipe(connect.reload());
});

gulp.task('hint', function(){
  'use strict';

  gulp.src('js/*.js')
      .pipe(hint('.jshintrc'))
      .pipe(hint.reporter('default'));
});

gulp.task('scripts', function(){
  'use strict';

  gulp.src(['js/fills.js', 'js/modal.js'])
      // .pipe(sourcemap.init())
      .pipe(concat('modal.js'))
      // .pipe(sourcemap.write())
      // .pipe(uglify())
      .pipe(gulp.dest('public'))
      .pipe(connect.reload());
});

gulp.task('watch', function(){
  'use strict';

  gulp.watch(['public/index.html'], ['html']);
  gulp.watch(['scss/*.scss'], ['styles']);
  gulp.watch(['js/*.js'], ['hint', 'scripts']);
});

gulp.task('default', ['serve', 'watch']);
