const path = require('path');
const {config} = require('process');
const webpack = require('webpack');

const myConfig = require('./config');

module.exports = {
    // 为开发环境修改配置...
    publicPath: './',
    lintOnSave: false,
    chainWebpack: (config) => {
        // 修复HMR
        config.resolve.symlinks(true)
        // config.plugins.delete('preload')
        // config.plugins.delete('prefetch')
    },
    configureWebpack: (config) => {
        config.mode = process.env.NODE_ENV
        config.resolve = {
            extensions: [".js", ".vue", ".json"], //文件优先解析后缀名顺序
            alias: myConfig.alias, // 别名配置
            plugins: []
        }
    },
    css: config.css,
    parallel: require('os').cpus().length > 1,
    // webpack-dev-server 相关配置
    devServer: {
        open: false,
        host: '0.0.0.0',
        port: 8080,
        https: true,
        hot: true,
        hotOnly: true,
        overlay: {
            warnings: false,
            errors: false
        },
        proxy: {
            '/api': {
                // 目标 API 地址
                target: process.env.VUE_APP_URL,
                // 如果要代理 websockets
                ws: true,
                changeOrigin: true, // 允许websockets跨域
                pathRewrite: {
                    "^/api": ""
                }
            }
        },
        // 代理转发配置，用于调试环境
        disableHostCheck: true,
    }
}
