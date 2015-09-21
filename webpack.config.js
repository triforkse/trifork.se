var path = require("path");
var webpack = require("webpack");
module.exports = {
	cache: true,
	entry: {
		team: "./team/team.jsx"
	},
	output: {
		path: path.join(__dirname, "dist"),
		publicPath: "static/",
		filename: "[name].js",
		chunkFilename: "[chunkhash].js"
	},
	module: {
		loaders: [
			// required to write "require('./style.css')"
			{ test: /\.css$/,    loader: "style-loader!css-loader" },

			// required for react jsx
			{ test: /\.jsx?$/,    loader: "babel",
	      exclude: /(node_modules|bower_components)/,
	      loader: 'babel?stage=0' }
		]
	},
	externals: {
    //don't bundle the 'react' npm package with our bundle.js
    //but get it from a global 'React' variable
    'react': 'React'
  },
	plugins: [
	]
};
