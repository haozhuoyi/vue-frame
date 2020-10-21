<template>
    <div id="forgetThePassword">
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
            <p class="title">{{ $t('forgetThePassword.DISPLAY_FORGET_THE_PASSWORD_TITLE') }}</p>
            <p class="explain">{{ $t('forgetThePassword.DISPLAY_FORGET_THE_PASSWORD_CONTENT') }}</p>
            <el-form ref="form"
                     :model="formLabelAlign"
                     label-width="210px"
                     label-position="right">
                <el-form-item :label="$t('forgetThePassword.DISPLAY_FORGET_THE_PASSWORD_ID_OR_MAIL')">
                    <input ref="input"
                           v-change
                           type="text"
                           v-model="formLabelAlign.name"
                           placeholder="ID or example@mail.com"
                           @keyup.enter="reset"
                           onkeydown="if(event.keyCode==13){return false;}">
                </el-form-item>
            </el-form>
            <p class="footer">
                <button class="button rigth"
                        onkeydown="if(event.keyCode==13){return false;}"
                        @click.prevent.stop="cancel">
                    {{ $t('forgetThePassword.DISPLAY_FORGET_THE_PASSWORD_BACK_BUTTON') }}
                </button>
                <button class="button buttonHighlight"
                        @click.prevent.stop="sendMail">
                    {{ $t('forgetThePassword.DISPLAY_FORGET_THE_PASSWORD_SEND_EMAIL_BUTTON') }}
                </button>
            </p>
        </div>
    </div>
</template>
<script>
export default {
    name: 'ForgetThePassword',
    data () {
        return {
            loading: false,
            formLabelAlign: {
                name: ''
            },
            time: 3
        }
    },
    mounted () {
        document.onkeydown = function () {
            if (window.event && window.event.keyCode === 13) {
                window.event.returnValue = false
            }
        }
        this.$nextTick(() => {
            const query = this.$route.query
            const local = query.local
            this.$i18n.locale = local
            setTimeout(() => { this.$refs.input.focus() }, 200)
        })
    },
    methods: {
        sendMail () {
            if (this.formLabelAlign.name) {
                this.loading = true
                const query = this.$route.query
                const body = (`{"email": "${this.formLabelAlign.name}","projectKey": "${query.projectKey}","contractKey": "${query.contractKey}"}`)
                this.$request.usermanagement.PasswordReset(body).then(response => {
                    console.log('sendMail-patch请求:', response.status, response.statusText)
                    const data = this.$request.CODE(response.data)
                    if (Object.prototype.toString.call(data) === '[object Object]') {
                        if (data.result) {
                            this.cancelCountdown()
                            this.$message.success(this.$t('forgetThePassword.MESSAGE_FORGET_THE_PASSWORD_SEND_MAIL_COMPLEAT'))
                        } else {
                            this.$message.error(this.$t('forgetThePassword.MESSAGE_FORGET_THE_PASSWORD_SEND_MAIL_ERROR'))
                        }
                    }
                    this.loading = false
                }).catch(err => {
                    this.loading = false
                    if (err.status === 401) {
                        this.$request.login.refreshToken().then(response => {
                            response ? this.sendMail() : ''
                        })
                    } else {
                        this.$request.requestError(`sendMail-get请求失败:`, err, 'ForgetThePassword')
                    }
                })
            } else {
                this.$message.warning(this.$t('forgetThePassword.MESSAGE_FORGET_THE_PASSWORD_CHOOSE_THE_ID_OR_MAIL'))
            }
        },
        cancel () {
            window.open('', '_self')
            window.close()
        },
        cancelCountdown () {
            if (this.time > 0) {
                this.time--
                setTimeout(this.cancelCountdown, 1000)
            } else {
                window.opener = null
                this.cancel()
            }
        }
    }
}
</script>
<style lang="less" scoped>
@import url("../less/views/ForgetThePassword.less");
</style>
