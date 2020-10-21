const path = require('path');

exports.alias = {
    "@": path.resolve(__dirname, "../src"),
    "@a": path.resolve(__dirname, "../src/assets"),
    "@c": path.resolve(__dirname, "../src/components"),
    "@v": path.resolve(__dirname, "../src/views"),
    "@i": path.resolve(__dirname, "../src/i18n"),
    "@l": path.resolve(__dirname, "../src/lang"),
    "@p": path.resolve(__dirname, "../src/pages"),
    "@ps": path.resolve(__dirname, "../src/plugins"),
    "@u": path.resolve(__dirname, "../src/utils"),
    "@s": path.resolve(__dirname, "../src/service"),
    "@l": path.resolve(__dirname, "../src/lang")
}

exports.optimization = {
    runtimeChunk: 'single',
    splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 20000,
        cacheGroups: {
            vendor: {
                test: /[\\/]node_modules[\\/]/,
                name(module) {
                    const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
                    return `npm.${packageName.replace('@', '')}`
                }
            }
        }
    }
}

exports.css = {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: true,
    // 开启 CSS source maps?是否在构建样式地图，false将提高构建速度
    sourceMap: true,
    // css预设器配置项
    loaderOptions: {},
    // 启用 CSS modules for all css / pre-processor files.
    requireModuleExtension: false
}

exports.parallel = require('os').cpus().length > 1
