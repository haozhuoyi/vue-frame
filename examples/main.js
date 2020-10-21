import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/less/index.less';
import "highlight.js/styles/github.css";

//导入组件
import ChexUI from '../packages/ui'
import DemoBlock from "./components/demo-block";
//注册组件
Vue.use(ChexUI)
Vue.use(DemoBlock)

// 引入element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import "../packages/assets/elementui/index.css";
Vue.use(ElementUI)

import hljs from "highlight.js";
router.afterEach(route => {
  Vue.nextTick(() => {
    const blocks = document.querySelectorAll("pre code:not(.hljs)");
    Array.prototype.forEach.call(blocks, hljs.highlightBlock);
  });
});

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
