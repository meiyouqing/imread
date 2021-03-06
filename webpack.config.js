var webpack = require('webpack'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
	path    = require('path'),
	debug   = false;
	
module.exports = {
	entry: {
		app:['./src/js/index.js']
	},
	output: {
        path: path.join(__dirname,'public/p'),
        publicPath: '/p/',
        filename: 'bundle1.js',
        chunkFilename: debug?'modules/[name].bundle.js':'modules/[chunkhash].bundle.js'
	},
	resolve:{
		extensions: ['','.js','.jsx'] 
	},
	module: {
		loaders:[
			// {test: /\.js[x]?$/, loader: 'babel-loader?presets[]=es2015&presets[]=react'},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel',
				query:{
				    presets: ['react', 'es2015'],
				    plugins: ["transform-object-rest-spread"]
				    }				
			},
			{ 
				test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader") 
			},
			{test: /\.(png|jpg|gif)$/, loader: 'url-loader?limit=5048'}
		]
	},
	plugins: debug?
				[new ExtractTextPlugin("style.css")]:
				[
		new ExtractTextPlugin("style.css"),
	    new webpack.optimize.DedupePlugin(),
	    new webpack.optimize.OccurrenceOrderPlugin()//,
	    // new webpack.HotModuleReplacementPlugin()
   //  		new HtmlWebpackPlugin({
			// filename: '../index.html',
		 //    template: debug? 'indexTemplate.html' :'indexTemplate-p.html', // Load a custom template 
		 //    inject: 'body', // Inject all scripts into the body 
		 //    hash: !debug
		 //  }),

		// new webpack.ProvidePlugin({
		// 	React: 'react',
		// 	AJAX: '../modules/ajax',
		// 	GLOBAL: '../modules/global',
		// 	storage: '../modules/storage',
		// 	Loading: './loading',
		// 	NoData: './noData',
		// 	Token: '../modules/token',
		// 	mixins: '../modules/mixins',
		// 	myEvent: '../modules/myEvent',
		// 	parseQuery: '../modules/parseQuery'
		// })
	] 
};
