var gulp = require('gulp')
  , nodemon = require('gulp-nodemon')
  , jshint = require('gulp-jshint');

JS_FILES = ['./lib/**/*.js', './test/**/*.js'];

gulp.task('lint', function () {
  gulp.src(JS_FILES)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});


gulp.task('dev', function () {
  nodemon({ script: 'server.js', ext: 'js' })
    .on('change', ['lint'])
    .on('restart', function () {
      console.log('restarted!')
    })
});
