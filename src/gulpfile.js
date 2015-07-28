var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('styles', function() {
    gulp.src('*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('../build/'))
});


var jade = require('gulp-jade');
 
gulp.task('jade', function() {
  gulp.src('*.jade')
  	.pipe(jade())
    .pipe(gulp.dest('../build/'))
});


//Watch task
gulp.task('default',function() {
    gulp.watch('*.scss',['styles']);
    gulp.watch('*.jade',['jade']);
});