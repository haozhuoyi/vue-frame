<template>
    <div id="confirmEmail">
        <div class="logo">
            <div class="logoImg">
                <img :src="require('@a/images/login-left-logo.svg')">
            </div>
        </div>
        <div v-if="success"
             class="absolute">
            <div class="main"
                 v-loading="loading"
                 :element-loading-text="$t('common.DISPLAY_UNDER_READING')"
                 element-loading-spinner="el-icon-loading"
                 element-loading-background="rgba(255,255,255,.4)">
                <p class="title">{{ $t('UserManagementU.ConfirmEmailAddress') }}</p>
                <el-form ref="form"
                         :model="form"
                         label-width="140px"
                         label-position="right">
                    <el-form-item :label="$t('UserManagementU.DISPLAY_USER_INFO_DG_USER_ROW_TITLE_LOGIN_ID')">
                        <input ref="input"
                               v-change
                               class="password"
                               type="text"
                               v-model="form.name"
                               :placeholder="$t('UserManagementU.DISPLAY_USER_INFO_DG_USER_ROW_TITLE_LOGIN_ID')">
                        <!-- <i class="el-icon-view"
                           @click="eye('password')"></i> -->
                    </el-form-item>
                    <el-form-item :label="$t('common.Password')">
                        <input v-change
                               class="confirmPassword"
                               type="password"
                               v-model="form.affirmName"
                               :placeholder="$t('common.Password')">
                        <i class="el-icon-view"
                           @click="eye('confirmPassword')"></i>
                    </el-form-item>
                </el-form>
                <p class="footer">
                    <button class="button buttonHighlight margin"
                            @click.prevent.stop="reset">{{ $t('UserManagementU.Confirmation') }}</button>
                </p>
            </div>
            <span class="tip">{{ $t('UserManagementU.AfterConfirmation') }}</span>
        </div>
        <div v-else
             class="success">
            <p class="success-body">
                メールアドレスが正常に変更されました。<br />
                ご利用を続ける場合は、ログイン画面よりログインを行ってください。
            </p>
            <button class="button buttonHighlight"
                    @click="LOOKTG">ログイン画面へ</button>
        </div>
    </div>
</template>

<script>
import $ from 'jquery'

export default {
    name: 'ConfirmEmail',
    data () {
        return {
            loading: false,
            success: true,
            form: {
                name: '',
                affirmName: ''
            }
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
            if (this.form.name === '') {
                this.$message.warning(this.$t('UserManagementU.DialogConfirmEmail1'))
                return
            }
            if (this.form.affirmName === '') {
                this.$message.warning(this.$t('UserManagementU.DialogConfirmEmail2'))
                return
            }
            let name = this.form.name
            let affirmName = this.form.affirmName
            if (/[{}\\"]/gm.test(name)) {
                name = this.form.name.replace(/\\/g, '\\\\').replace(/'/g, '\'')
                    .replace(/"/g, '\\"').replace(/{/g, '\{').replace(/}/g, '\}')
                console.log(name)
            }
            if (/[{}\\"]/gm.test(affirmName)) {
                affirmName = this.form.affirmName.replace(/\\/g, '\\\\').replace(/'/g, '\'')
                    .replace(/"/g, '\\"').replace(/{/g, '\{').replace(/}/g, '\}')
                console.log(affirmName)
            }
            this.loading = true
            const body = (`{"registrationKey": "${this.$route.query.p1}","contractKey": "${this.$route.query.p3}","userId": "${name}","password": "${affirmName}"}`)
            this.$request.usermanagement.UsersChangeEmail(body).then(response => {
                console.log('UsersChangeEmail-patch请求:', response.status, response.statusText)
                const data = this.$request.CODE(response.data)
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    this.$message.success(this.$t('UserManagementU.EmailAddressConfirmation'))
                    this.success = false
                }
                this.loading = false
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.reset() : ''
                    })
                } else {
                    this.$request.requestError(`UsersChangeEmail-patch请求:`, err, 'ConfirmEmail')
                }
            })
        },
        LOOKTG () {
            this.$router.push({path: '/login'})
        }
    }
}
</script>
<style lang="less" scoped>
@import url("../../../less/pages/UserManagement/UserManagementU/ConfirmEmail.less");
</style>
