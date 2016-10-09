var webpack = require('webpack'),
    // ExtractTextPlugin = require('extract-text-webpack-plugin'),
	path    = require('path'),
	debug   = true;
	//console.log(process.argv)
	
module.exports = {
	entry: {
		app:['./src/js/index.js']
	},
	output: {
        path: path.join(__dirname,'app'),
        publicPath: '/public/',
        filename: debug?'bundle.js':'[hash].bundle.js',
        chunkFilename: debug?'modules/[name].bundle.js':'modules/[chunkhash].bundle.js'
	},
	// resolve:{
	// 	extensions: ['','.js','.jsx'] 
	// },
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
			{test: /\.css$/, loader: "style!css" },
			{test: /\.(png|jpg|gif)$/, loader: 'url-loader?limit=20092'}
		]
	},
	plugins: debug?
				[]:
				[
		// new ExtractTextPlugin("src/css/style.css"),
	    new webpack.optimize.DedupePlugin(),
	    new webpack.optimize.OccurrenceOrderPlugin(),
	    new webpack.HotModuleReplacementPlugin(),
   //  		new HtmlWebpackPlugin({
			// filename: '../index.html',
		 //    template: debug? 'indexTemplate.html' :'indexTemplate-p.html', // Load a custom template 
		 //    inject: 'body', // Inject all scripts into the body 
		 //    hash: !debug
		 //  }),

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
