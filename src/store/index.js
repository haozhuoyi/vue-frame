import Vue from 'vue'
import Vuex from 'vuex'
import persistedState from 'vuex-persistedstate'
import Crypto from '@u/crypto'

Vue.use(Vuex)

/* eslint-disable camelcase */
export default new Vuex.Store({
    state: {
        settingPersonal: {
            'makeDwgPdfFlag': false,
            'reb': false,
            'sendMailFlag': false
        },
        userInfo: {
            'user_id': '',
            'userName': '',
            'projectName': '',
            'isAdmin': '',
            'loginID': '',
            'authorityName': '',
            'mailAdress': ''
        },
        time: 0,
        project_settings: '',
        token: '',
        authInfo: true
    },
    getters: {
        /**
         * this.$store.getters.XXX
         *
         *  filteredList: state => {
                return state.list.filter(item => item > 5)
            },
            listCount: (state, getters) => {
                return getters.filteredList.length;
            }
         */
        getProjectSettings: state => {
            if (state.project_settings) {
                return JSON.parse(Crypto.decrypt(state.project_settings))
            } else {
                return []
            }
        },
        getToken: state => {
            if (state.token) {
                return JSON.parse(Crypto.decrypt(state.token))
            } else {
                return {
                    access_token: '',
                    refresh_token: ''
                }
            }
        },
        getUserId: state => {
            return state.userInfo.user_id || ''
        }
    },
    mutations: {
        settingPersonal: (state, settingPersonal) => {
            state.settingPersonal = settingPersonal
        },
        setUserInfo: (state, userInfo) => {
            state.userInfo = userInfo
        },
        setProjectSettings: (state, project_settings) => {
            state.project_settings = Crypto.encrypt(JSON.stringify(project_settings))
        },
        setToken: (state, token) => {
            state.token = Crypto.encrypt(JSON.stringify(token))
        },
        setTime: (state, time) => {
            state.time = time
        },
        setAuthInfo: (state, authInfo) => {
            state.authInfo = authInfo
        }
    },
    actions: {
        settingPersonal: (context, settingPersonal) => {
            context.commit('settingPersonal', settingPersonal)
        },
        setUserInfo: (context, userInfo) => {
            context.commit('setUserInfo', userInfo)
        },
        setProjectSettings: (context, project_settings) => {
            context.commit('setProjectSettings', project_settings)
        },
        setToken: (context, token) => {
            context.commit('setToken', token)
        },
        setTime: (context, timeData) => {
            console.log('store::setTime--->', timeData)
            context.commit('setTime', timeData.date)
        },
        setAuthInfo: (context, authInfo) => {
            context.commit('setAuthInfo', authInfo)
        }
    },
    plugins: [persistedState({
        key: 'vuex', // 定义KEY名
        storage: window.localStorage, // 定义信息存储模式：window.localStorage（默认）、sessionStorage、cookie
        // eslint-disable-next-line no-unused-vars
        reducer (state) { // 指定需要持久化的state,配置如下
            return {
                // 只储存state中单个对象
                project_settings: state.project_settings,
                token: state.token,
                time: state.time
            }
        }
    })]
})
