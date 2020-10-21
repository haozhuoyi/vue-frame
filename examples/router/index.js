import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: '/examples',
        name: 'home'
    }
    // {
    //   path: '/about',
    //   name: 'About',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    // }
]
/** MD的路由规则
 * path:/examples/[语言]/[控件名]
 * name:md文件名 （不可以重复）
 * component:加载md内容
 */
importPages(require.context('../docs', true, /\.md$/, 'lazy'))
function importPages (r) {
    // 对应到 examples 文件夹下
    r.keys().forEach(key => {
        let path = '/examples' + (key.split('.'))[1]
        // 去除文件名中的编号，只留英文名
        const dirs = path.split('/')
        const filename = dirs.reverse()[0]
        const realname = filename.split('_').length > 1 ? filename.split('_')[1] : filename
        // 删除第一个元素
        dirs.splice(0, 1)
        // 再反转
        dirs.reverse()
        dirs.push(realname)
        path = dirs.join('/')

        routes.push({ path, name: filename, component: () => r(key)})
    })
}

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

router.beforeEach((to, from, next) => {
    // 从URL获取语言
    const dirs = to.path.split('/')
    let currentLang = ''

    if (dirs.length > 1 && ['en-us', 'ja-jp', 'zh-cn'].includes(dirs[2])) {
        currentLang = dirs[2]
        localStorage.setItem('CHEXUI_LANGUAGE', currentLang)
    }

    // 从本地存储获语言
    if (currentLang === '') {
        currentLang = localStorage.getItem('CHEXUI_LANGUAGE')
        if (currentLang === null) {
            currentLang = 'zh-cn'
            localStorage.setItem('CHEXUI_LANGUAGE', currentLang)
        }
    }

    // 修改首页跳转
    if (to.name === 'home') {
        console.log('home')
        router.push('/examples/' + currentLang + '/Guide')
    }
    document.title = 'The samples of CheX UI'
    next()
})

export default router
