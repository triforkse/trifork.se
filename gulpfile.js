var gulp = require('gulp')
  , nodemon = require('gulp-nodemon')
  // , jshint = require('gulp-jshint')
  , spawn = require('child_process').spawn
  , gutil = require('gulp-util')
  , webpack = require("webpack")
  , webpackConfig = require("./webpack.config.js")
  , WebpackDevServer = require("webpack-dev-server");

JS_FILES = ['./lib/**/*.js', './test/**/*.js'];

gulp.task('lint', function () {
  // gulp.src(JS_FILES)
  //   .pipe(jshint())
  //   .pipe(jshint.reporter('default'));
});


gulp.task('handbook', function (e) {
  var formats = [
    {
      ext: "epub",
      writer: "epub"
    },
    {
      ext: "pdf",
      writer: "latex"
    },
    {
      ext: "docx",
      writer: "docx"
    }];

  formats.forEach(function (f) {
    var child = spawn("pandoc", ["--toc", "-f", "markdown", "--latex-engine=xelatex", "-t", f.writer, "-o", "handbook." + f.ext, "handbook.md"], {cwd: process.cwd() + "/public"}),
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


gulp.task("webpack:build", function(callback) {
	// modify some webpack config options
	var myConfig = Object.create(webpackConfig);
	myConfig.plugins = myConfig.plugins.concat(
		new webpack.DefinePlugin({
			"process.env": {
				// This has effect on the react lib size
				"NODE_ENV": JSON.stringify("production")
			}
		}),
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.UglifyJsPlugin()
	);

	// run webpack
	webpack(myConfig, function(err, stats) {
		if(err) throw new gutil.PluginError("webpack:build", err);
		gutil.log("[webpack:build]", stats.toString({
			colors: true
		}));
		callback();
	});
});


gulp.task("webpack-dev-server", function() {
	// modify some webpack config options
	var myConfig = Object.create(webpackConfig);
	myConfig.devtool = "eval";
	myConfig.debug = true;

	// Start a webpack-dev-server
	new WebpackDevServer(webpack(myConfig), {
		publicPath: "/" + myConfig.output.publicPath,
		stats: {
			colors: true
		},
    hot: true,

    // Enable special support for Hot Module Replacement
    // Page is no longer updated, but a "webpackHotUpdate" message is send to the content
    // Use "webpack/hot/dev-server" as additional module in your entry point
    // Note: this does _not_ add the `HotModuleReplacementPlugin` like the CLI option does.

    // Set this as true if you want to access dev server from arbitrary url.
    // This is handy if you are using a html5 router.
    historyApiFallback: true
	}).listen(8080, "localhost", function(err) {
		if(err) throw new gutil.PluginError("webpack-dev-server", err);
		gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");
	});
});


gulp.task('dev', ['webpack-dev-server'], function () {
  gulp.watch('public/handbook.md', ['handbook']);

  gutil.log("Website running at: http://localhost:9090/");

  nodemon({script: 'server.js', ext: 'js'})
    .on('change', ['lint'])
    .on('restart', function () {
      console.log('restarted!')
    });
});
