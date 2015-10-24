module.exports = {
	entry: "./src/main.js",
	output: {
		path: __dirname,
		filename: "bundle.js"
	},
	module: {
		loaders: [
			{test: /\.css$/, loader: "style!css"},
			{test: /\.js$/, exclude: /(node_module|bower_components)/,loader: "babel"},
			{test: /\.jsx$/, exclude: /(node_modules|bower_components)/, loader: 'babel'},
			{test: /\.less$/, exclude: /(node_modules|bower_components)/, loader: 'style!css!less'}
		]
	},
	devtool: '#inline-source-map'
}