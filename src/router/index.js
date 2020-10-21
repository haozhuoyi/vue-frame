/* eslint-disable indent */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Crypto from '@u/crypto'
import store from '@p/Files/store'
import $store from '../store/index'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'home',
        component: () => import('../views/Home.vue'),
        redirect: '/Files',
        meta: {
            requireLogin: true // 当前路由需要校验，不需要就不用写
        },
        children: [{
                path: '/Files',
                name: 'Files',
                component: () => import('@p/Files/Files.vue'),
                meta: {
                    requireLogin: true // 当前路由需要校验，不需要就不用写
                },
                redirect: '/Files/Allfiles',
                children: [{
                        path: '/Files/Allfiles',
                        name: 'Allfiles',
                        component: () => import('@p/Files/AllFiles/AllFiles.vue'),
                        meta: {
                            title: 'CheX | すべてのファイル',
                            requireLogin: true // 当前路由需要校验，不需要就不用写
                        }
                    },
                    {
                        path: '/Files/Bookmarks',
                        name: 'Bookmarks',
                        component: () => import('@p/Files/Bookmarks/Bookmarks.vue'),
                        meta: {
                            title: 'CheX | お気に入り',
                            requireLogin: true // 当前路由需要校验，不需要就不用写
                        }
                    },
                    {
                        path: '/Files/Dustbin',
                        name: 'Dustbin',
                        component: () => import('@p/Files/Dustbin/Dustbin.vue'),
                        meta: {
                            title: 'CheX | ゴミ箱',
                            requireLogin: true // 当前路由需要校验，不需要就不用写
                        }
                        // },
                        // {
                        //   path: '/Snapshot',
                        //   name: 'Snapshot',
                        //   component: () => import('@p/Files/Snapshot/Snapshot.vue'),
                        //   meta: {
                        //     title: 'CheX | スナップショット',
                        //     requireLogin: true // 当前路由需要校验，不需要就不用写
                        //   }
                    }
                ]
            },
            {
                path: '/Determination',
                name: 'Determination',
                component: () => import('@p/Determination/Determination.vue'),
                meta: {
                    title: 'CheX | 測定業務',
                    requireLogin: true // 当前路由需要校验，不需要就不用写
                }
            },
            {
                path: '/MapPins',
                name: 'MapPins',
                component: () => import('@p/MapPins/MapPins.vue'),
                meta: {
                    title: 'CheX | 地図写真ピン',
                    requireLogin: true // 当前路由需要校验，不需要就不用写
                }
            },
            {
                path: '/Management',
                name: 'Management',
                component: () => import('@p/UserManagement/Index.vue'),
                meta: {
                    title: 'CheX | 利用者管理',
                    requireLogin: true // 当前路由需要校验，不需要就不用写
                },
                redirect: '/Management/UserManagementU',
                children: [{
                        path: '/Management/UserManagementU',
                        name: 'UserManagementU',
                        component: () => import('@p/UserManagement/UserManagementU/UserManagementU.vue'),
                        meta: {
                            title: 'CheX | 利用者管理',
                            requireLogin: true // 当前路由需要校验，不需要就不用写
                        }
                    },
                    {
                        path: '/Management/GroupManagement',
                        name: 'GroupManagement',
                        component: () => import('@p/UserManagement/GroupManagement/GroupManagement.vue'),
                        meta: {
                            title: 'CheX | グループ管理',
                            requireLogin: true // 当前路由需要校验，不需要就不用写
                        }
                    },
                    {
                        path: '/Management/PermissionManagement',
                        name: 'PermissionManagement',
                        component: () => import('@p/UserManagement/PermissionManagement/PermissionManagement.vue'),
                        meta: {
                            title: 'CheX | アクセス権限設定',
                            requireLogin: true // 当前路由需要校验，不需要就不用写
                        }
                    }
                ]
            },
            {
                path: '/OutputData',
                name: 'OutputData',
                component: () => import('@p/OutputData/OutputData.vue'),
                meta: {
                    title: 'CheX | 出力データ',
                    requireLogin: true // 当前路由需要校验，不需要就不用写
                }
            }
        ]
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@v/Login.vue'),
        meta: {
            title: 'CheX | ログイン',
            requireLogin: false // 当前路由需要校验，不需要就不用写
        }
    },
    {
        path: '/forgetThePassword',
        name: 'forgetThePassword',
        component: () => import('@v/ForgetThePassword'),
        meta: {
          title: 'CheX | パスワードを忘れ',
          requireLogin: false // 当前路由需要校验，不需要就不用写
        },
        beforeEnter: (to, from, next) => {
            const p = JSON.parse(Crypto.decrypt(to.query.p1))
            if (p.p1 === 'forgetThePassword') {
                next()
            } else {
                next({ path: '/' })
            }
        }
    },
    {
        path: '/loginReset',
        name: 'loginreset',
        component: () => import('@v/LoginReset'),
        meta: {
          title: 'CheX | パスワード を忘れ',
          requireLogin: false // 当前路由需要校验，不需要就不用写
        },
        beforeEnter: (to, from, next) => {
            // ...
            if (to.query.p1) {
                next()
            } else {
                next({ path: '/' })
            }
        }
    },
    {
        path: '/PasswordSetting',
        name: 'passwordSetting',
        component: () => import('@v/PasswordSetting'),
        meta: {
          title: 'CheX | パスワード設定',
          requireLogin: false // 当前路由需要校验，不需要就不用写
        },
        beforeEnter: (to, from, next) => {
            // ...
            if (to.query.p1) {
                next()
            } else {
                next({ path: '/' })
            }
        }
    },
    {
        path: '/confirmEmail',
        name: 'confirmEmail',
        component: () => import('@p/UserManagement/UserManagementU/ConfirmEmail.vue'),
        meta: {
          title: 'CheX | メールアドレス確認',
          requireLogin: false // 当前路由需要校验，不需要就不用写
        // },
        // beforeEnter: (to, from, next) => {
        //     // ...
        //     if (to.query.p1) {
        //         next()
        //     } else {
        //         next({ path: '/' })
        //     }
        }
    },
    {
        path: '/401',
        name: '401',
        component: () => import('@v/error/401.vue'),
        meta: {
            title: '401',
            requireLogin: false // 当前路由需要校验，不需要就不用写
        }
    },
    {
        path: '/404',
        name: '404',
        component: () => import('@v/error/404.vue'),
        meta: {
            title: '404',
            requireLogin: false // 当前路由需要校验，不需要就不用写
        }
    },
    {
        path: '/4xx',
        name: '4xx',
        component: () => import('@v/error/4xx.vue'),
        meta: {
            title: 'その他',
            requireLogin: false // 当前路由需要校验，不需要就不用写
        }
    },
    {
        path: '*', // 此处需特别注意置于最底部
        redirect: '/404'
    }
]
const router = new VueRouter({
    mode: 'hash',
    // 解决vue框架页面跳转有白色不可追踪色块的bug
    // eslint-disable-next-line no-unused-vars
    scrollBehavior (to, from, savedPosition) {
        return { x: 0, y: 0 }
    },
    routes
})
// 路由钩子----页面切换之前
router.beforeEach((to, from, next) => {
    // console.log(to, from, Crypto.decrypt(store.state.breadcrumb))
    const NO = parseInt(JSON.parse(Crypto.decrypt(store.state.breadcrumb))[0].NO) || 1
    store.dispatch('setDefaultExpandedKeys', from.fullPath === '/login' ? [1] : [NO])

    if (to.meta.title) document.title = to.meta.title
    // 判断该路由是否需要登录权限
    if (to.matched.some(record => record.meta.requireLogin)) {
        // 判断是否有access_token
        if ($store.getters.getToken ? $store.getters.getToken.access_token : '') {
            next()
        } else {
            if (['/loginReset', '/PasswordSetting', '/confirmEmail'].includes(to.fullPath)) return
            next({
                path: '/login'
            })
        }
    } else {
        if (['/loginReset', '/PasswordSetting', '/confirmEmail'].includes(to.fullPath)) return
        next()
    }
})
// 解决Loading chunk (\d)+ failed问题
router.onError((error) => {
    const pattern = /Loading chunk (\d)+ failed/g
    const isChunkLoadFailed = error.message.match(pattern)
    if (isChunkLoadFailed) {
        // 用路由的replace方法，并没有相当于F5刷新页面，失败的js文件并没有从新请求，会导致一直尝试replace页面导致死循环，而用 location.reload 方法，相当于触发F5刷新页面，虽然用户体验上来说会有刷新加载察觉，但不会导致页面卡死及死循环，从而曲线救国解决该问题
        location.reload()
        // const targetPath = $router.history.pending.fullPath;
        // $router.replace(targetPath);
    }
})
// vue router 报错： Uncaught (in promise) NavigationDuplicate{_name: "NavigationDuplicated"} 解决方案
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
    return originalPush.call(this, location).catch(err => err)
  }
export default router
