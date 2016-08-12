var HtmlWebpackPlugin = require('html-webpack-plugin'),
	webpackDevMiddleware = require("webpack-dev-middleware"),
    webpack = require('webpack'),
	path    = require('path'),
	debug   = process.argv.indexOf('-p')===-1;
	//console.log(process.argv)
	
module.exports = {
	entry: {
		app:['./src/js/index.js']
	},
	output: {
        path: path.join(__dirname, (debug? 'public':'p/public')),
        publicPath: '/',
        filename: debug?'app/[name].bundle.js':'app/[hash].bundle.js',
        chunkFilename: debug?'modules/[name].bundle.js':'modules/[chunkhash].bundle.js'
	},
	resolve:{
		extensions: ['','.js','.jsx'] 
	},
	module: {
		loaders:[
			{test: /\.js[x]?$/, loader: 'babel-loader?presets[]=es2015&presets[]=react'},
			{test: /\.css$/, loader: "style!css" },
			{test: /\.(png|jpg|gif)$/, loader: 'url-loader?limit=20092'}
		]
	},
	plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    		new HtmlWebpackPlugin({
			filename: '../index.html',
		    template: debug? 'indexTemplate.html' :'indexTemplate-p.html', // Load a custom template 
		    inject: 'body', // Inject all scripts into the body 
		    hash: !debug
		  }),
		new webpack.ProvidePlugin({
			React: 'react',
			AJAX: '../modules/AJAX',
			GLOBAL: '../modules/global',
			Link: '../modules/link',
			browserHistory: '../modules/history',
			storage: '../modules/storage',
			Loading: './loading',
			NoData: './noData',
			Token: '../modules/token',
			Mixins: '../modules/mixins',
			myEvent: '../modules/myEvent',
			parseQuery: '../modules/parseQuery'
		})
	] 
};
