var HtmlWebpackPlugin = require('html-webpack-plugin'),
	OpenBrowserPlugin = require('open-browser-webpack-plugin'),
	//webpackDevMiddleware = require("webpack-dev-middleware"),
    webpack = require('webpack'),
	path    = require('path'),
	debug   = process.argv.indexOf('-p')===-1;
	//console.log(process.argv)
	
module.exports = {
	entry: {
		app:['./src/js/index.js']
	},
	output: {
        path: path.join(__dirname, (debug? 'tmp/':'p/tmp/')),
        publicPath: 'tmp/',
        filename: debug?'app/[name].bundle.js':'app/[hash].bundle.js',
        chunkFilename: debug?'modules/[name].bundle.js':'modules/[chunkhash].bundle.js'
	},
	resolve:{
		extensions: ['','.js','.jsx'] 
	},
	module: {
		loaders:[
			{test: /\.js[x]?$/, loader: 'babel-loader'},
			{test: /\.css$/, loader: "style!css" },
			{test: /\.(png|jpg|gif)$/, loader: 'url-loader?limit=20092'}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			filename: '../index.html',
		    template: debug? 'indexTemplate.html' :'indexTemplate-p.html', // Load a custom template 
		    inject: 'body', // Inject all scripts into the body 
		    hash: !debug
		  }),
		new webpack.ProvidePlugin({
			//React: 'react',
			storage: '../modules/storage',
			GLOBAL: '../modules/global',
			Loading: './loading',
			NoData: './noData',
			Router: '../modules/router',
			Token: '../modules/token',
			Mixins: '../modules/mixins',
			myEvent: '../modules/myEvent',
			POP: '../modules/confirm'
		}),
		new OpenBrowserPlugin({ url: 'http://192.168.0.249:8080'}),
	] 
};
