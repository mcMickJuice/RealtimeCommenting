var webpack = require('webpack')
var rewirePlugin = require('rewire-webpack');

module.exports = function(config) {
	config.set({
		browers: ['Chrome', 'PhantomJS'], //run in chrome
		//singleRun: true, //just run once by default
		frameworks: ['jasmine'], 
		files: [
			'tests.webpack.js' //just load this file
		],
		preprocessors: {
			'tests.webpack.js': ['webpack', 'sourcemap'] //preprocess with webpack and our sourcemap loader
		},
		reporters: ['dots'], //report results in this format
		webpack: { //kind of a copy of your webpack config
			devtool: 'inline-source-map',
			plugins: [
				new rewirePlugin()
			],
			module: {
				loaders: [
					{test: /\.css$/, loader: "style!css"},
					{test: /\.js$/, exclude: /(node_module|bower_components)/,loader: "babel"},
					{test: /\.jsx$/, exclude: /(node_modules|bower_components)/, loader: 'babel'},
					{test: /\.less$/, exclude: /(node_modules|bower_components)/, loader: 'style!css!less'}
				]
			}
		},
		webpackServer: {
			noInfo: true //dont spam the console when running karma
		}
	})
}