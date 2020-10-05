const TerserPlugin = require('terser-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
    css: {
        loaderOptions: {
            sass: {
                prependData: `
                @import "@/assets/scss/_base.scss";
                @import "@/assets/scss/_breakpoints.scss";
                @import "@/assets/scss/_languages.scss";
                @import "@/assets/scss/_typography.scss";
                `,
            },
        },
    },
    productionSourceMap: false,
    publicPath: './',

    pages: {
        index: {
            entry: 'src/main.js',
            title: 'Burberry®',
        },
    },

    devServer: {
        open: process.platform === 'darwin',
        host: '0.0.0.0',
        port: 8080,
        https: isProd,
        hotOnly: false,
    },
    configureWebpack: {
        optimization: {
            minimize: isProd,
            minimizer: isProd ? [
                new TerserPlugin({
                    terserOptions: {
                        mangle: true,
                        output: {
                            comments: false,
                        },
                    },
                    extractComments: false,
                }),
            ] : [],
        },
    },
};
