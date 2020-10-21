<template>
    <div id="home">
        <el-container>
            <el-header height="48px">
                <Header ref="header"></Header>
            </el-header>
            <el-container>
                <el-aside width="64px">
                    <Aside></Aside>
                </el-aside>
                <el-main>
                    <router-view v-if="isRouterAlice"></router-view>
                </el-main>
            </el-container>
        </el-container>
        <a id="href"
           target="_blank"
           style="color: blue!important; text-decoration: underline!important;"
           href=""></a>
    </div>
</template>

<script>
import bus from '@c/bus.js'
import Header from '@v/Header'
import Aside from '@v/Aside'

export default {
    name: 'Home',
    components: {
        Header, Aside
    },
    data () {
        return {
            oldUrl: '',
            isRouterAlice: false
        }
    },
    provide () {
        return {
            reload: this.reload
        }
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            // 通过 `vm` 访问组件实例,将值传入oldUrl
            vm.oldUrl = from.path
        })
    },
    mounted () {
        this.getAuthInfo()
        bus.$on('getAuthInfo', () => {
            this.getAuthInfo()
        })
        bus.$on('isRouterAlice', () => {
            this.isRouterAlice = true
            setTimeout(() => {
                if (this.$route.fullPath === '/Files/Dustbin') {
                    bus.$emit('trash')
                }
            }, 0)
        })
    },
    methods: {
        reload () {
            this.isRouterAlice = false
            this.$nextTick(function () {
                this.isRouterAlice = true
            })
        },
        // 認証情報を取得する
        getAuthInfo () {
            // console.log(this.$store.state.authInfo)
            if (!this.$store.state.authInfo) {
                this.$refs.header.settingPersonal()
            } else {
                bus.$emit('localLoading', true)
                this.$request.login.getAuthInfo(this.$store.getters.getToken.access_token).then(response => {
                    console.log('getAuthInfo-post请求:', response.status, response.statusText)
                    this.$store.dispatch('setUserInfo', response.data.result)
                    this.$store.dispatch('setToken', {
                        'access_token': response.data.result.access_token,
                        'refresh_token': this.$store.getters.getToken.refresh_token
                    })
                    bus.$emit('storeUpdata')
                    bus.$emit('localLoading', false)
                    this.$refs.header.settingPersonal()
                }).catch(err => {
                    bus.$emit('localLoading', false)
                    if (err.status === 401) {
                        this.$request.login.refreshToken().then(response => {
                            response ? this.getAuthInfo() : ''
                        })
                    } else {
                        this.$request.requestError(`getAuthInfo-post请求:`, err, 'Home')
                    }
                })
            }
        }
    }
}
</script>

<style lang="less" scoped>
@import url("../less/views/Home.less");
</style>
