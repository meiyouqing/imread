var webpack = require('webpack'),
	path    = require('path');
module.exports = {
	entry: './src/js/index.js',
	output: {
        path: path.join(__dirname, 'tmp'),
        publicPath: 'tmp/',
        filename: 'app/bundle.js',
        chunkFilename: 'modules/[name].bundle.js'
        //library: ['Example', '[name]'],
        //pathInfo: true
	},
	resolve:{
		extensions: ['','.js','.jsx']
	},
	module: {
		loaders:[
			{test: /\.js[x]?$/, exclude: /node_modules/, loader: 'babel-loader'},
			{test: /\.css$/, loader: "style!css" },
			{test: /\.(png|jpg|gif)$/, loader: 'url-loader?limit=20092'}
		]
	},
	plugins: [
		new webpack.ProvidePlugin({
			React: 'react',
			GLOBAL: './global',
			Loading: './loading',
			NoData: './noData',
			Router: './router',
			Token: './token'
		}),
	] 
}