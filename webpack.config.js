const webpack = require('webpack');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const autoprefixer = require('autoprefixer');
const purgecss = require('@fullhuman/postcss-purgecss');

module.exports = {
	mode: 'development',
	entry: './src/index.ts',
	devtool: 'source-map',
	plugins: [
		new webpack.ProgressPlugin(),
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			template: './src/index.html',
			filename: 'index.html',
			minify: {
				collapseBooleanAttributes: true,
				collapseWhitespace: true,
				decodeEntities: true,
				removeAttributeQuotes: true,
				removeComments: true,
				removeEmptyAttributes: true,
				removeRedundantAttributes: true,
				removeScriptTypeAttributes: true,
				removeStyleLinkTypeAttributes: true,
				useShortDoctype: true
			}
		}),
		new FixStyleOnlyEntriesPlugin(),
		new MiniCssExtractPlugin({ filename: '[name].[contenthash].css' })
	],
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: [
					{
						loader: 'babel-loader'
					}
				]
      },
			{
				test: /\.scss$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader
					},
					{
						loader: 'css-loader',
						options: {
							sourceMap: true
						}
					},
					{
						loader: 'postcss-loader',
						options: {
							plugins: [
								autoprefixer,
								purgecss({
									whitelist: [],
									content: ['./src/**/*.html', './src/**/*.ts']
								})
							],
							sourceMap: true
						}
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true
						}
					}
				]
			},
			{
				test: /\.(png|jpg|svg)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name].[contenthash].[ext]',
							esModule: false
						}
					},
					{
						loader: 'image-webpack-loader'
					}
				]
			}
		]
	},
	optimization: {
		minimizer: [
			new TerserPlugin({
				sourceMap: true
			})
		]
	},
	output: {
		filename: '[name].[contenthash].js'
	}
};
