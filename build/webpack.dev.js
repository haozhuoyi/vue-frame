const path = require('path');
const webpack = require('webpack');
const UglifyPlugin = require("uglifyjs-webpack-plugin");
// 使用gzip
const CompressionPlugin = require("compression-webpack-plugin");

const myConfig = require('./config');

// 利用DllPlugin和DllReferencePlugin将依赖包打包成外部文件在index中引入 && 将版本号添加进打包的js名中
let {
    openGzip
} = require('../package.json');

module.exports = {
    publicPath: './',
    // 输出文件目录
    outputDir: 'dist',
    assetsDir: 'assets',
    lintOnSave: false,
    chainWebpack: (config) => {
        // 修复HMR
        config.resolve.symlinks(true)
        // config.plugins.delete('preload')
        // config.plugins.delete('prefetch')
    },
    configureWebpack: (config) => {
            // 为生产环境修改配置...
            config.mode = process.env.NODE_ENV
            if (openGzip) {
                config.plugins = [
                    ...config.plugins,
                    new CompressionPlugin({
                        test: /\.js$|\.html$|.\css/, //匹配文件名
                        threshold: 10240, //对超过10k的数据压缩
                        deleteOriginalAssets: false //不删除源文件
                    })
                ]
            }

            // 将每个依赖包打包成单独的js文件
            config.optimization = myConfig.optimization

            config.resolve = {
                extensions: [".js", ".vue", ".json"], //文件优先解析后缀名顺序
                alias: myConfig.alias, // 别名配置
                plugins: []
            }
    },
    // 生产环境是否生成 sourceMap 文件
    productionSourceMap: false,
    css: myConfig.css,
    parallel: myConfig.parallel,
}
