const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer')

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

const optimization = () => {
    const config = {
        splitChunks: {
            chunks: "all"
        }
    }

    if (isProd) {
        config.minimizer = [
            new OptimizeCssAssetWebpackPlugin(),
            new TerserWebpackPlugin()
        ]
    }

    return config
}
const cssLoaders = extra => {
    const loaders = [
        MiniCssExtractPlugin.loader, 'css-loader'
    ]

    if (extra) {
        loaders.push(extra)
    }

    return loaders
}
const jsLoaders = () => {
    const loaders = ['babel-loader']

    if (isDev) {
        loaders.push('eslint-loader')
    }

    return loaders
}
const plugins = () => {
    const base = [
        new HTMLWebpackPlugin({
            template: './index.html',
            minify: {
                collapseWhitespace: isProd
            }
        }),
        new CleanWebpackPlugin(),
        // new CopyWebpackPlugin([
        //     {
        //         from: '',
        //         to: ''
        //     }
        // ]),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css'
        })
    ]

    if (isProd) {
        base.push(new BundleAnalyzerPlugin())
    }

    return base
}

let bundle = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: {
        main: './index.js',
        analytics: './analytics.js'
    },
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: ['.js', '.json', '.png', '.svg', '.jpg'],
        alias: {
            '@images': path.resolve(__dirname, 'src/images'),
            '@styles': path.resolve(__dirname, 'src/styles'),
            '@': path.resolve(__dirname, 'src')
        }
    },
    optimization: optimization(),
    devServer: {
        // open: true,
        port: 3333,
        hot: isDev
    },

    plugins: plugins(),
    module: {
        rules: [
            {
                test: /\.css$/,
                use: cssLoaders()
            },
            {
                test: /\.s[ac]ss$/,
                use: cssLoaders('sass-loader')
            },
            {
                test: /\.(png|jpg|svg|gif)$/,
                use: ['file-loader']
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/,
                use: ['file-loader']
            },
            {
                test: /\.xml$/,
                use: ['file-loader']
            },
            {
                test: /\.csv$/,
                use: ['csv-loader']
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: jsLoaders()
            }
        ]
    }
}

// const devTool = () => {
//
//     if(isDev) {
//         bundle.devtool = 'source-map'
//     }
//
// }
// devTool()

module.exports = bundle;