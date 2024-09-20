const webpack = require('webpack');
const FriendlyErrors = require('friendly-errors-webpack-plugin');
const path = require('path');
const src = path.resolve(__dirname, 'src');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { merge } = require('webpack-merge'); // Updated merge import
const ESLintPlugin = require('eslint-webpack-plugin'); // eslint-webpack-plugin
const requireDesired = require('./build/modules/require-desired.js');
const localConfig = merge(
    requireDesired(`${__dirname}/build/config`),
    requireDesired(`${__dirname}/build/config.local`)
);

if (localConfig.mode === 'development') {
    process.env.NODE_ENV = 'development';
}

const webpackConfig = merge(
    {
        mode: process.env.NODE_ENV || 'production',
        context: src,
        output: {
            path: path.resolve(__dirname, 'crio/inc/boldgrid-theme-framework'),
            publicPath: '/wp-content/themes/crio/inc/boldgrid-theme-framework/',
            clean: true, // Webpack 5 cleans the output folder
        },
        devServer: {
            static: '/wp-content/themes/crio/inc/boldgrid-theme-framework/', // Replaced contentBase with static
            historyApiFallback: true,
            quiet: true,
            port: 4009,
            overlay: {
                errors: true,
                warnings: true,
            },
        },
        module: {
            rules: [
                {
                    test: /\.ejs$/,
                    loader: 'ejs-loader',
                },
                {
                    test: /\.html$/,
                    use: [
                        {
                            loader: 'html-loader',
                            options: {
                                minimize: true,
                            },
                        },
                    ],
                },
                {
                    test: /\.svg$/,
                    loader: 'svg-inline-loader',
                },
                {
                    test: /\.s?[ac]ss$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        {
                            loader: 'sass-loader',
                            options: {
                                additionalData: `@import "variables.scss";`, // Import your global SASS variables or mixins here if needed
                            },
                        },
                    ],
                },
                {
                    test: /\.js$/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env'],
                        },
                    },
                },
            ],
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: './assets/css/[name]-bundle.min.css',
            }),
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery',
                'window.jQuery': 'jquery',
            }),
            new ESLintPlugin({ // Replaced eslint-loader with ESLintPlugin
                extensions: ['js'],
                emitWarning: true,
            }),
            new FriendlyErrors(),
        ],
    },
    localConfig
);

module.exports = webpackConfig;