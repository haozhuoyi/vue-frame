const path = require('path');
const webpack = require('webpack');
const UglifyPlugin = require("uglifyjs-webpack-plugin");
// 使用gzip
const CompressionPlugin = require("compression-webpack-plugin");
// 利用DllPlugin和DllReferencePlugin将依赖包打包成外部文件在index中引入 && 将版本号添加进打包的js名中
let {
    openGzip
} = require('./package.json');

console.log('')
console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
console.log('     This is [' + process.env.VUE_APP_ENV + '] Environment.')
if(process.env.NODE_ENV !== 'development'){
    console.log('     The API is : ' + process.env.VUE_APP_PRO)
}else{
    console.log('     The API is : ' + process.env.VUE_APP_URL)
}
console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
console.log('')

const localEnv = require('./build/webpack.'+process.env.VUE_APP_ENV)
module.exports = localEnv;
