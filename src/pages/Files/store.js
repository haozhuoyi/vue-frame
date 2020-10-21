import Vue from 'vue'
import Vuex from 'vuex'
import persistedState from 'vuex-persistedstate'
import $ from 'jquery'
import Crypto from '@u/crypto'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        viewtype: Crypto.encrypt('treetable'),
        // input: '',
        breadcrumb: Crypto.encrypt(JSON.stringify([{FILE_NAME: '', NO: '1', DISPLAY_PARENT_PATH: ''}])),
        defaultExpandedKeys: Crypto.encrypt(JSON.stringify([1])),
        fileItem: ''
    },
    mutations: {
        setViewType: (state, viewtype) => {
            state.viewtype = Crypto.encrypt(viewtype)
        },
        // setInput: (state, input) => {
        //     state.input = input
        // },
        setADDBreadcrumb: (state, breadcrumb) => {
            if (breadcrumb.NO) {
                $('#userDropdown').css('display', 'none')
                $('#submenu').css('display', 'none')
                state.breadcrumb = Crypto.encrypt(JSON.stringify(breadcrumb))
                state.defaultExpandedKeys = Crypto.encrypt(state.breadcrumb[0].NO)
                console.log(state.breadcrumb, breadcrumb)
            }
        },
        setBreadcrumb: (state, breadcrumb) => {
            $('#userDropdown').css('display', 'none')
            $('#submenu').css('display', 'none')
            state.breadcrumb = ''
            state.defaultExpandedKeys = ''
            const stateBreadcrumb = []
            const defaultExpandedKeys = []
            for (let index = 0; index < breadcrumb.length; index++) {
                if (breadcrumb[index].NO) {
                    defaultExpandedKeys.push(parseInt(breadcrumb[index].NO))
                    stateBreadcrumb.push(breadcrumb[index])
                }
            }
            console.log(stateBreadcrumb, breadcrumb)
            state.breadcrumb = Crypto.encrypt(JSON.stringify(stateBreadcrumb))
            state.defaultExpandedKeys = Crypto.encrypt(JSON.stringify(defaultExpandedKeys))
        },
        setDefaultExpandedKeys: (state, defaultExpandedKeys) => {
            state.defaultExpandedKeys = Crypto.encrypt(JSON.stringify(defaultExpandedKeys))
        },
        setFileItem: (state, fileItem) => {
            state.fileItem = Crypto.encrypt(JSON.stringify(fileItem))
        }
    },
    actions: {
        setViewType: (context, viewtype) => {
            context.commit('setViewType', viewtype)
        },
        // setInput: (context, input) => {
        //     context.commit('setInput', input)
        // },
        setADDBreadcrumb: (context, breadcrumb) => {
            context.commit('setADDBreadcrumb', breadcrumb)
        },
        setDefaultExpandedKeys: (context, defaultExpandedKeys) => {
            context.commit('setDefaultExpandedKeys', defaultExpandedKeys)
        },
        setFileItem: (context, fileItem) => {
            context.commit('setFileItem', fileItem)
        }
    },
    plugins: [persistedState({
        key: 'vuexPersistedFile', // 定义KEY名
        storage: window.sessionStorage, // 定义信息存储模式：window.localStorage（默认）、sessionStorage、cookie
        reducer (state) { // 指定需要持久化的state,配置如下
            return {
                // 只储存state中单个对象
                viewtype: state.viewtype,
                // input: state.input,
                breadcrumb: state.breadcrumb,
                defaultExpandedKeys: state.defaultExpandedKeys
            }
        }
    })]
})
