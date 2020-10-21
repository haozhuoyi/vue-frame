<template>
    <div id="loginReset">
        <div class="logo">
            <div class="logoImage">
                <img :src="require('@a/images/login-left-logo.svg')">
            </div>
        </div>
        <div class="main"
             v-loading="loading"
             :element-loading-text="$t('common.DISPLAY_UNDER_READING')"
             element-loading-spinner="el-icon-loading"
             element-loading-background="rgba(255,255,255,.4)">
            <p class="title">{{ $t('loginReset.DISPLAY_LOGIN_RESET_PASSWORD') }}</p>
            <p class="explain">
                {{ $t('loginReset.ID') }}
                : {{ $route.query.p2 }}
            </p>
            <el-form ref="form"
                     :model="formLabelAlign"
                     label-position="right">
                <el-form-item :label="$t('loginReset.DISPLAY_CHANGE_PASSWORD_NEW_PASS1')">
                    <input ref="input"
                           v-change
                           class="p1"
                           type="password"
                           maxlength="200"
                           v-model="formLabelAlign.password"
                           :placeholder="$t('loginReset.DISPLAY_CHANGE_PASSWORD_NEW_PASS1_PLACEHOLDER')">
                    <i class="el-icon-view"
                       @click="eye('p1')"></i>
                    <p v-if="formLabelAlign.password.length>0 && formLabelAlign.password.length<6"
                       class="tip affirmPassword">
                        {{ $t('loginReset.DISPLAY_USER_INFO_USER_EDIT_PASSWORD_NOTE2') }}
                    </p>
                    <p class="tip">{{ $t('loginReset.DISPLAY_USER_INFO_USER_EDIT_PASSWORD_NOTE1') }}</p>
                </el-form-item>
                <el-form-item :label="$t('loginReset.DISPLAY_CHANGE_PASSWORD_NEW_PASS2')">
                    <input v-change
                           class="p2"
                           type="password"
                           maxlength="200"
                           v-model="formLabelAlign.affirmPassword"
                           :placeholder="$t('loginReset.DISPLAY_CHANGE_PASSWORD_NEW_PASS2_PLACEHOLDER')">
                    <i class="el-icon-view"
                       @click="eye('p2')"></i>
                    <p v-if="formLabelAlign.affirmPassword.length>0 && formLabelAlign.affirmPassword.length<6"
                       class="tip affirmPassword">
                        {{ $t('loginReset.DISPLAY_USER_INFO_USER_EDIT_PASSWORD_NOTE2') }}
                    </p>
                </el-form-item>
            </el-form>
            <p class="footer">
                <button class="button buttonHighlight"
                        @click.prevent.stop="reset">{{ $t('loginReset.DISPLAY_LOGIN_RESET_PASSWORD_BUTTON') }}</button>
            </p>
        </div>
    </div>
</template>

<script>
import $ from 'jquery'

export default {
    name: 'ForgetThePassword',
    data () {
        return {
            loading: false,
            formLabelAlign: {
                password: '',
                affirmPassword: ''
            },
            time: 3
        }
    },
    mounted () {
        this.$nextTick(() => {
            setTimeout(() => { this.$refs.input.focus() }, 200)
        })
    },
    methods: {
        eye (cn) {
            const p = $(`.${cn}`)
            if (p.attr('type') === 'text') {
                p.attr('type', 'password')
            } else {
                p.attr('type', 'text')
            }
        },
        reset () {
            if (this.formLabelAlign.password) {
                if (this.formLabelAlign.password.length < 6 || this.formLabelAlign.password.length > 200) {
                    this.$message.warning(this.$t('loginReset.MESSAGE_USER_INFO_USER_EDIT_PASSWORD_NOTE1'))
                } else {
                    // eslint-disable-next-line no-control-regex
                    if (/[^\x00-\xff]/g.test(this.formLabelAlign.password)) {
                        this.$message.warning(this.$t('loginReset.MESSAGE_USER_INFO_USER_EDIT_PASSWORD_NOTE2'))
                    } else {
                        if (this.formLabelAlign.password !== this.formLabelAlign.affirmPassword) {
                            this.$message.warning(this.$t('loginReset.MESSAGE_USER_INFO_USER_EDIT_PASSWORD_NOTE3'))
                        } else {
                            this.loading = true
                            const body = `{"registrationKey": "${this.$route.query.p1}","contractKey": "${this.$route.query.p3}","password": "${this.formLabelAlign.password}","passwordCheck": "${this.formLabelAlign.affirmPassword}"}`
                            this.$request.usermanagement.ResetPassword(body).then(response => {
                                console.log('ResetPassword-patch请求:', response.status, response.statusText)
                                const data = this.$request.CODE(response.data)
                                if (Object.prototype.toString.call(data) === '[object Object]') {
                                    this.$message.success(this.$t('loginReset.MESSAGE_USER_INFO_USER_EDIT_PASSWORD_NOTE4'))
                                    this.cancelCountdown()
                                }
                                this.loading = false
                            }).catch(err => {
                                this.loading = false
                                if (err.status === 401) {
                                    this.$request.login.refreshToken().then(response => {
                                        response ? this.reset() : ''
                                    })
                                } else {
                                    this.$request.requestError(`ResetPassword-patch请求:`, err, 'LoginReset')
                                }
                            })
                        }
                    }
                }
            } else {
                this.$message.warning(this.$t('loginReset.MESSAGE_USER_INFO_USER_EDIT_PASSWORD_NOTE5'))
            }
        },
        cancelCountdown () {
            if (this.time > 0) {
                this.time--
                setTimeout(this.cancelCountdown, 1000)
            } else {
                this.$router.push({path: '/login'})
            }
        }
    }
}
</script>
<style lang="less" scoped>
@import url("../less/views/LoginReset.less");
</style>
