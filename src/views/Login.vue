<template>
    <div class="login">
        <div class="content">
            <div class="loginForm">
                <div class="loginLogo">
                    <div class="logoImage">
                        <img :src="img">
                    </div>
                </div>
                <div class="loginContent">
                    <el-form ref="login"
                             label-position="left"
                             :model="param"
                             :hide-required-asterisk="false"
                             class="formContent">
                        <el-form-item :required="false">
                            <template slot="label">
                                <span style="font-size: 1rem;">{{ $t('login.DISPLAY_LOGIN_PROJECT') }}</span>
                            </template>
                            <div class="selectBox"
                                 onselectstart="return false;">
                                <span class="selectBoxSpan"
                                      :title="project.projectName"
                                      @click="show=!show;">{{ project.projectName }}</span>
                                <div v-if="projects.length > 0"
                                     style="display: inline-block;">
                                    <ul class="selectBoxul"
                                        v-if="show">
                                        <li class="selectBoxLi"
                                            v-for="item in projects"
                                            :key="item.projectKey"
                                            :title="item.projectName"
                                            @click="selectItem(item)">
                                            {{ item.projectName }}
                                        </li>
                                    </ul>
                                </div>
                                <div v-else
                                     style="display: inline-block;">
                                    <ul class="selectBoxul"
                                        v-if="show">
                                        <li class="selectBoxLi center">
                                            {{ $t('login.DISPLAY_LOGIN_PROJECT_DATA') }}
                                        </li>
                                    </ul>
                                </div>
                                <svg class="iconArrowDown"
                                     xmlns="http://www.w3.org/2000/svg"
                                     width="16"
                                     height="9.88"
                                     viewBox="0 0 16 9.88"
                                     @click="show=!show;">
                                    <g id="组_218"
                                       data-name="组 218"
                                       transform="translate(-818.8 -140.628)">
                                        <path id="SVGID"
                                              d="M832.92,140.628l-6.12,6.107-6.12-6.107-1.88,1.88,8,8,8-8Z"
                                              fill="#32465a"
                                              fill-rule="evenodd" />
                                    </g>
                                </svg>
                            </div>
                        </el-form-item>
                        <div class="loginButton manageProjects">
                            <el-button class="projectButtonActive"
                                       type="primary"
                                       @click="$refs.ProjectSelection.project()">{{ $t('login.DISPLAY_LOGIN_LINK_PROJECT_ADD_DELETE') }}</el-button>
                        </div>
                        <el-form-item :required="false">
                            <template slot="label">
                                <span>{{ $t('login.DISPLAY_LOGIN_LOGIN_ID') }}</span>
                            </template>
                            <el-input ref="usernameInput"
                                      size="small"
                                      @input="e => param.username = validForbid(e)"
                                      v-model="param.username"></el-input>
                        </el-form-item>
                        <el-form-item :required="false">
                            <template slot="label">
                                <span>{{ $t('login.DISPLAY_LOGIN_PASSWORD') }}</span>
                            </template>
                            <el-input size="small"
                                      show-password
                                      v-model="param.password"
                                      @input="e => param.password = validForbid(e)"
                                      @keyup.enter.native="submitFormlog">></el-input>
                        </el-form-item>
                        <div class="loginButton">
                            <el-button class="loginButtonActive"
                                       type="primary"
                                       id="login"
                                       :loading="loading"
                                       @click="submitFormlog">{{ $t('login.DISPLAY_LOGIN_LOGIN_BUTTON_LABEL') }}</el-button>
                        </div>
                    </el-form>
                    <el-button type="text"
                               size="mini"
                               @click="forgetPassword">{{ $t('login.DISPLAY_LOGIN_LINK_WEB') }}</el-button>
                </div>
            </div>
            <p style="text-align: right;font-size: 12px;">Version: {{ version }}</p>
        </div>

        <!-- 项目选择 -->
        <ProjectSelection ref="ProjectSelection"
                          @selectItem="selectItem"
                          @dragCallback="dragCallback"></ProjectSelection>
        <!-- 特殊项目选择 -->
        <SpecialProjectKey ref="SpecialProjectKey"
                           @selectProject="selectProject"></SpecialProjectKey>
    </div>
</template>

<script>
/* eslint-disable camelcase */
/* eslint-disable quotes */
import bus from '@c/bus.js'
import $ from 'jquery'
import Crypto from "@/utils/crypto"
import ProjectSelection from '@v/project/ProjectSelection'
import SpecialProjectKey from '@v/project/SpecialProjectKey'
import config from '../../package.json' // 取得バージョン番号(获取版本号)

export default {
    name: 'Login',
    components: {
        ProjectSelection, SpecialProjectKey
    },
    data () {
        return {
            loading: false,
            show: false,
            version: config.version,
            img: require('@a/images/login-left-logo.svg'),
            param: {
                username: '',
                password: ''
            },
            projects: [], // 項目
            project: {
                projectName: ''
            }, // 選択した項目
            innerHTML: ''
        }
    },
    mounted () {
        const that = this
        that.$nextTick(() => {
            that.notice()
            if (that.$store.getters.getProjectSettings) {
                that.projects = that.$store.getters.getProjectSettings
                for (let index = that.projects.length - 1; index >= 0; index--) {
                    if (that.projects[index].check) {
                        that.project = that.projects[index]
                    }
                }
            } else {
                location.reload()
                this.$store.dispatch('setToken', {
                    'access_token': '',
                    'refresh_token': ''
                })
                this.$store.dispatch('setProjectSettings', {})
            }
            bus.$emit('show', false)
            $(document).click(function (e) {
                if (typeof e.target.className !== 'object' && e.target.className.indexOf('selectBox') === -1) {
                    that.show = false
                }
            })
        })
    },
    methods: {
        // 項目選択後
        selectItem (item) {
            this.show = false
            this.project = item
            this.projects = this.$store.getters.getProjectSettings || []
            for (let index = this.projects.length - 1; index >= 0; index--) {
                if (item.projectKey === this.projects[index].projectKey) {
                    this.projects[index].check = true
                } else {
                    this.projects[index].check = false
                }
            }
            this.$store.dispatch('setToken', {
                'access_token': '',
                'refresh_token': ''
            })
            this.$store.dispatch('setProjectSettings', this.projects)
        },
        // 修正項目リストの順番をドラッグする[(Drag the callback)]
        dragCallback (data) {
            this.projects = data
            this.project = {}
            for (let index = this.projects.length - 1; index >= 0; index--) {
                if (this.projects[index].check) {
                    this.project = this.projects[index]
                }
            }
        },
        // インストールパケット通知
        notice () {
            this.$notify({
                title: 'ダウンロード',
                message: '<div> <span></span></div> <br> <div><span>Win10:</span> <a style="color: blue!important; text-decoration: underline!important;" href="http://3.115.30.36/api/InstallPack?type=PC">Download</a></div>  <br> <div><span>Mac:</span><a style="color: blue!important; text-decoration: underline!important;" href=http://3.115.30.36/api/InstallPack?type=Mac>Download</a></div>',
                position: 'bottom-left',
                duration: 60000,
                dangerouslyUseHTMLString: true
            })
            this.$refs.usernameInput.focus()
        },
        // ログイン
        submitFormlog () {
            if (!this.project.projectName) {
                this.$message.warning(this.$t('login.MESSAGE_PROJECT_ADD_DEL_NON_CHOICE_DELETING_PROJECT'))
                return
            }
            if (this.param.username && this.param.password) {
                const projectKey = this.project.projectKey
                const contractKey = this.project.contractKey
                if (this.project.specialProjectFlag === 'TRUE') {
                    this.getProjects(projectKey, this.encode(this.param.username), this.encode(this.param.password))
                } else {
                    this.login(projectKey, contractKey)
                }
            } else if (!this.param.username && this.param.password) {
                this.$message.warning(this.$t('login.MESSAGE_VALIDATOR_UNINPUT_LOGINID'))
            } else if (this.param.username && !this.param.password) {
                this.$message.warning(this.$t('login.MESSAGE_VALIDATOR_UNINPUT_PASSWORD'))
            } else {
                this.$message.warning(this.$t('login.MESSAGE_VALIDATOR_UNINPUT_LOGINID'))
            }
        },
        selectProject (data) {
            console.log(data)
            this.login(data.PROJECT_KEY, data.CONTRACT_KEY)
        },
        login (projectKey, contractKey) {
            const that = this
            that.loading = true
            that.$request.login.loginUser({
                client_id: "10000",
                client_secret: "CLIENTSECRET2019",
                grant_type: "password",
                userId: that.encode(that.param.username),
                password: that.encode(that.param.password),
                scope: "CheX",
                specialProjectFlag: that.project.specialProjectFlag,
                projectKey,
                contractKey
            }).then(response => {
                console.log("login-post请求:", response.status, response.statusText)
                const data = that.$request.CODE(response.data)
                if (data && data !== "getProjects") {
                    that.$store.dispatch('setToken', {
                        'access_token': data.result.access_token,
                        'refresh_token': data.result.refresh_token
                    })
                    that.innerHTML += 'login方法执行成功;'
                    that.$store.dispatch('setAuthInfo', false)
                    that.getAuthInfo()
                }
                this.loading = false
            }).catch(err => {
                that.loading = false
                if (err.status === 401) {
                    that.$request.login.refreshToken().then(response => {
                        response ? that.login(projectKey, contractKey) : ''
                    }).responseJSON
                } else {
                    that.$request.requestError(`login-post请求:`, err, 'login')
                }
            })
        },
        // リダイレクション
        redirect () {
            // const redirect = this.$route.query.redirect ? this.$route.query.redirect : '/'
            // console.log('路由路径:', redirect)
            // this.$router.push(`${redirect}`)
            const p = document.createElement('p') // 1、创建元素
            p.innerHTML = this.innerHTML + 'redirect方法执行成功'
            p.style.cssText = 'display:none;margin: 0 auto;text-align: center;'

            const loginDom = document.getElementsByClassName('login')[0] // 2、找到父级元素
            loginDom.appendChild(p)// 3、在末尾中添加元素

            this.$router.push(`/`)
            this.loading = false
        },
        // パスワードを忘れる
        forgetPassword () {
            if (!this.project.projectName) {
                this.$message.warning(this.$t('login.MESSAGE_LOGIN_ID_PASSWORD_RESET_LINK_NOT_SELECTED_PROJECT'))
                return
            }
            const routeData = this.$router.resolve({
                path: "/forgetThePassword",
                query: {
                    p1: Crypto.encrypt({
                        p1: 'forgetThePassword'
                    }),
                    projectKey: this.project.projectKey,
                    contractKey: this.project.contractKey,
                    local: this.$i18n.locale
                }
            })
            window.open(routeData.href, "_blank")
        },
        getProjects (projectKey, username, password) {
            this.loading = true
            const body = (`{"projectKey": "${projectKey}","userId": "${username}","password": "${password}"}`)
            this.$request.projectlist.getProjects(body).then(response => {
                console.log('getProjects-get请求成功:', response.status, response.statusText)
                const data = this.$request.CODE(response.data)
                if (data && data.result.length >= 0) {
                    this.$refs.SpecialProjectKey.project(
                        data.result,
                        projectKey,
                        this.encode(this.param.username),
                        this.encode(this.param.password)
                    )
                }
                this.loading = false
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.getProjects(projectKey, username, password) : ''
                    })
                } else {
                    this.$request.requestError(`getProjects-get请求:`, err, 'login')
                }
            })
        },
        // 認証情報を取得する
        getAuthInfo () {
            this.loading = true
            const projectSettings = this.$store.getters.getToken
            this.$request.login.getAuthInfo(projectSettings.access_token).then(response => {
                console.log('getAuthInfo-post请求:', response.status, response.statusText)
                this.$store.dispatch('setToken', {
                    'access_token': response.data.result.access_token,
                    'refresh_token': projectSettings.refresh_token
                })
                this.$store.dispatch('setUserInfo', response.data.result)
                this.innerHTML += 'getAuthInfo方法执行成功;'

                this.redirect()
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.getAuthInfo() : ''
                    })
                } else {
                    this.$request.requestError(`getAuthInfo-post请求:`, err, 'login')
                }
            })
        },
        // えんこーど
        encode (_str) {
            const staticChars = "PXhw7UT1B0a9kQDKZsjIASmOezxYG4CHo5Jyfg2b8FLpEvRr3WtVnlqMidu6cN"
            let encodeChars = ""
            let code = ''
            for (let i = 0; i < _str.length; i++) {
                const num = staticChars.indexOf(_str[i])
                if (num === -1) {
                    code = _str[i]
                } else {
                    code = staticChars[(num + 3) % 62]
                }
                const num1 = parseInt(Math.random() * 62, 10)
                const num2 = parseInt(Math.random() * 62, 10)
                encodeChars += staticChars[num1] + code + staticChars[num2]
            }
            return encodeChars
        }
    }
}
</script>

<style lang="less" scoped>
@import url("../less/views/Login.less");
</style>
