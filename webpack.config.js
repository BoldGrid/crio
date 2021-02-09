const webpack              = require( 'webpack' );
const ESLintPlugin         = require( 'eslint-webpack-plugin' );
const FriendlyErrors       = require( 'friendly-errors-webpack-plugin' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const TerserPlugin         = require( 'terser-webpack-plugin' );
const ImageMinimizerPlugin = require( 'image-minimizer-webpack-plugin' );
const globImporter         = require( 'node-sass-glob-importer' );
const path                 = require( 'path' );
const src                  = path.resolve( __dirname, 'src/inc/boldgrid-theme-framework' );
const { merge }            = require( 'webpack-merge' );
const requireDesired       = require( './build/modules/require-desired.js' );
const localConfig          = merge( requireDesired( `${__dirname}/build/config` ), requireDesired( `${__dirname}/build/config.local` ) );


if ( 'development' === localConfig.mode ) {
	process.env.NODE_ENV = 'development';
}

const webpackConfig = merge( {
	mode: process.env.NODE_ENV || 'production',
	context: src,
	output: {
		path: path.resolve( __dirname, 'crio/inc/boldgrid-theme-framework' ),
		publicPath: '/wp-content/themes/prime/inc/boldgrid-theme-framework/'
	},
	optimization: {
		minimizer: [ new TerserPlugin(
			{
				terserOptions: {
					mangle: false
				}
			}
		) ]
	},
	module: {
		rules: [
			{
				test: /\.ejs$/,
				loader: 'ejs-loader'
			},
			{
				test: /\.html$/,
				use: [
					{
						loader: 'html-loader',
						options: {
							minimize: true
						}
					}
				]
			},
			{
				test: /\.js$/,
				resolve: {
					fullySpecified: false
				},
				use: {
					loader: 'babel-loader',

					options: {
						presets: [ '@babel/preset-env' ]
					}
				}
			},
			{
				test: /\.s?[ac]ss$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							sourceMap: true
						}
					},
					{
						loader: 'postcss-loader',
						options: {
							sourceMap: true
						}
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true,
							sassOptions: {
								importer: globImporter()
							}
						}
					}
				]
			},
			{
				test: /\.(png|jpg|gif)$/,
				exclude: [
					path.resolve(__dirname, './node_modules')
				],
				use: [
					{
						loader: 'file-loader',
						options: {
							outputPath: 'inc/boldgrid-theme-framework/',
							name: '[path][name].[ext]'
						}
					}
				]
			},
			{
				test: /\.svg$/,
				loader: 'svg-inline-loader'
			}
		]
	},
	plugins: [
		new ESLintPlugin({
			emitWarning: true
		} ),
		new MiniCssExtractPlugin( {
			filename: './assets/css/[name].min.css'
		} ),
		new webpack.ProvidePlugin( {
			$: 'jquery',
			jQuery: 'jquery',
			'window.jQuery': 'jquery'
		} ),
		new FriendlyErrors(),
		new ImageMinimizerPlugin( {
			minimizerOptions: {

				// Lossless optimization with custom option
				// Feel free to experiment with options for better result for you
				plugins: [
					[ 'gifsicle', { interlaced: true } ],
					[ 'jpegtran', { progressive: true } ],
					[ 'optipng', { optimizationLevel: 5 } ],
					[
						'svgo',
						{
							plugins: [ { removeViewBox: false } ]
						}
					]
				]
			}
		} )
	]
}, localConfig );

module.exports = webpackConfig;
