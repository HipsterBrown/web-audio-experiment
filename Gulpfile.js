var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefix = require('gulp-autoprefixer'),
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
      .pipe(gulp.dest('./public'))
      .pipe(connect.reload());
});

gulp.task('watch', function(){
  'use strict';

  gulp.watch(['public/index.html'], ['html']);
  gulp.watch(['scss/*.scss'], ['styles']);
});

gulp.task('default', ['serve', 'watch']);
