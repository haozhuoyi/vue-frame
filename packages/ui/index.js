import ChxTest from './test/index'
import ChxButton from './button/index'
import ChxInput from './input/index'
import ChxLayout1 from './layout1/index'
import ChxSegment from './segment/index'
import ChxTree from './tree/index'
import ChxTable from './table/index'

// 所有组件列表
const components = [
    ChxTest,
    ChxButton,
    ChxInput,
    ChxLayout1,
    ChxSegment,
    ChxTree,
    ChxTable
]
// 定义 install 方法，接收 Vue 作为参数
const install = function (Vue) {
    // 判断是否安装，安装过就不继续往下执行
    if (install.installed) return
    // 遍历注册所有组件
    components.map(component => Vue.component(component.name, component))
    // 下面这个写法也可以
    // components.map(component => Vue.use(component))
}
// 检测到 Vue 才执行，毕竟我们是基于 Vue 的
if (typeof window.Vue !== 'undefined' && window.Vue) {
    install(window.Vue)
}

export default {
    install,
    // 所有组件，必须具有 install，才能使用 Vue.use()
    ...components
}
