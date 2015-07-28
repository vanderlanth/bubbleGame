var gulp = require('gulp');
var sass = require('gulp-sass');
var jade = require('gulp-jade');


gulp.task('styles', function() {
    gulp.src('src/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('build/'))
});

 
gulp.task('jade', function() {
  gulp.src('src/*.jade')
  	.pipe(jade())
    .pipe(gulp.dest('build/'))
});



gulp.task('scripts', function() {
  gulp.src('src/*.js')
    .pipe(gulp.dest('build/'))
});


//Watch task
gulp.task('default', ['jade', 'styles', 'scripts'], function() {
    gulp.watch('src/*.scss',['styles']);
    gulp.watch('src/*.jade',['jade']);
});