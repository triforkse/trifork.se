var gulp = require('gulp')
  , nodemon = require('gulp-nodemon')
  , jshint = require('gulp-jshint')
  , spawn = require('child_process').spawn
  , gutil = require('gulp-util');

JS_FILES = ['./lib/**/*.js', './test/**/*.js'];

gulp.task('lint', function () {
  gulp.src(JS_FILES)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});


gulp.task('handbook', function (e) {
  var formats = [
    {
      ext: "epub",
      writer: "epub"
    },
    {
      ext: "pdf",
      writer: "beamer"
    },
    {
      ext: "docx",
      writer: "docx"
    }];

  formats.forEach(function (f) {
    var child = spawn("pandoc", ["--toc", "-f", "markdown", "-t", f.writer, "-o", "handbook." + f.ext, "handbook.md"], {cwd: process.cwd() + "/public"}),
      stdout = '',
      stderr = '';

    child.stdout.setEncoding('utf8');

    child.stdout.on('data', function (data) {
      stdout += data;
      gutil.log(data);
    });

    child.stderr.setEncoding('utf8');
    child.stderr.on('data', function (data) {
      stderr += data;
      gutil.log(gutil.colors.red(data));
      gutil.beep();
    });

    child.on('close', function (code) {
      gutil.log("Done with exit code", code);
      gutil.log("You access complete stdout and stderr from here"); // stdout, stderr
    });
  });

});


gulp.task('dev', function () {
  gulp.watch('public/handbook.md', ['handbook']);

  nodemon({script: 'server.js', ext: 'js'})
    .on('change', ['lint'])
    .on('restart', function () {
      console.log('restarted!')
    });
});
