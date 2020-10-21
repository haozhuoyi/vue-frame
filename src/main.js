// 解决axios在IE浏览器中的兼容性问题
// import 'babel-polyfill'
// 兼容支持IE11
import '@babel/polyfill'
// 兼容支持IE9
import 'matchmedia-polyfill'
import 'matchmedia-polyfill/matchMedia.addListener'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
// elementui
import '@ps/elementui.js'
// 引入axios，并加到原型链中
import axios from 'axios'
import QS from 'qs'
// md5加密
import md5 from 'js-md5'
// request库
import request from '@s/index'
// 引入第三方图标库
import './assets/iconfont/iconfont.css'
require('./assets/iconfont/iconfont.js')
// 鼠标右键
import contentmenu from 'v-contextmenu'
import 'v-contextmenu/dist/index.css'
// 表格
import 'xe-utils'
import VXETable from 'vxe-table'
// 分割面板-https://developer.aliyun.com/mirror/npm/package/vue-split-panel
import VueSplit from 'vue-split-panel'
// 图表
import VeBar from 'v-charts/lib/bar.common'
// 多语言
import i18n from '@i/i18n'
// 虚拟滚动
import vuescroll from 'vuescroll/dist/vuescroll-native'

// 导入组件
import ChexUI from '../packages/ui'


Vue.component(VeBar.name, VeBar)

Vue.prototype.$axios = axios
Vue.prototype.qs = QS
Vue.prototype.$md5 = md5
Vue.prototype.$request = request

Vue.use(contentmenu)
Vue.use(VXETable)
Vue.use(VueSplit)
Vue.use(ChexUI)

// 注册组件
Vue.use(ChexUI)
Vue.use(vuescroll)

Vue.prototype.validForbid = function (value) {
    // console.log(value)
    // eslint-disable-next-line no-misleading-character-class
    value = value.replace(/[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig, '').replace(/\s/g, '')
    return value
}

Vue.directive('change', {
    bind (el) {
        const ele = el.tagName === 'INPUT' ? el : el.querySelector('input')
        ele.addEventListener('input', () => {
            let temp = ele.value
            // eslint-disable-next-line no-misleading-character-class
            const regStr = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig
            if (regStr.test(temp)) {
                temp = temp.replace(regStr, '')
            }
            ele.value = temp
        }, true)
    }
})

Vue.config.productionTip = false

new Vue({
    router,
    store,
    axios,
    i18n,
    render: h => h(App)
}).$mount('#app')
