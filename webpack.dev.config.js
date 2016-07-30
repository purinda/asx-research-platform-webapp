var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: {
        app: [
            './src/app.js',
        ]
    },
    output: {
        path: path.resolve(__dirname, './dist/'),
        publicPath: '/dist/',
        filename: 'build.js'
    },
    resolve: {
        extensions: ['', '.js', '.vue'],
        alias: {},
        root: path.resolve(__dirname)
    },
    resolveLoader: {
        root: path.join(__dirname, 'node_modules')
    },
    module: {
        loaders: [
            {
                test: /\.vue$/,
                loader: 'vue'
            },
            {
                test: /.\/src\/.*\.js$/,
                loader: 'babel',
                exclude: /node_modules/
            },
            {
                test: /\.json$/,
                loader: 'json'
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'url',
                query: {
                    limit: 1000,
                    name: '[name].[ext]?[hash:7]'
                }
            },
            {
                test: /\.(css|scss)$/,
                loaders: ["style", "css", "sass"]
            },
            {
                test: /\.woff(2)?(.*)?$/,
                loader: "url-loader?limit=10000&minetype=application/font-woff"
            },
            {
                test: /\.(ttf|eot|svg)(.*)$/,
                loader: "file-loader"
            },
            {
                test: /\.html$/,
                loader: 'vue-html'
            }
        ]
    },
    devServer: {
        host: '0.0.0.0',
        port: '8081',
        historyApiFallback: true,
        noInfo: false
    },
    stats: {
        // Nice colored output
        colors: true
    },
    devtool: 'eval-source-map',
    plugins: [
        new webpack.ProvidePlugin({
            // App Configuration
            'appParameters': path.resolve(__dirname, 'config/parameters.js'),

            // App auth provider
            'auth': path.resolve(__dirname, 'src/lib/auth.js'),

            // Register jQuery as a global module
            '$': 'jquery',
            'jQuery': 'jquery',
            'window.jQuery': 'jquery',
            'window.$': 'jquery',

            // MomentJS
            "window.moment": "moment",
            "moment": "moment",

            // Register Backbone.Js and Underscore
            '_': 'underscore',
            'window._': 'underscore',
            'Backbone': "backbone"
        })
    ],
    vue: {
        loaders: {
            js: 'babel'
        }
    }
};
