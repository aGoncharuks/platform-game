const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
	entry: './index.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, './dist'),
	},
	devServer: {
		static: './dist',
	},
	plugins: [
		new MiniCssExtractPlugin(),
		new HtmlWebpackPlugin({
		 title: 'Krugalet',
		}),
	],
	module: {
		rules: [
			{
			 test: /\.css$/i,
			 use: [MiniCssExtractPlugin.loader, "css-loader"],
			},
		],
	},
	mode: 'none'
}
