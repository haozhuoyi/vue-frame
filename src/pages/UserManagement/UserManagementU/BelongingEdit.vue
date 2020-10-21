<template>
    <div id="belongingEdit">
        <el-dialog :visible.sync="dialogVisible"
                   :close-on-click-modal="false"
                   :before-close="belongingEditClose"
                   :title="title"
                   :destroy-on-close="true"
                   class="eldialog"
                   v-loading="loading"
                   :element-loading-text="$t('common.DISPLAY_UNDER_READING')"
                   element-loading-spinner="el-icon-loading"
                   element-loading-background="rgba(255,255,255,.4)">
            <div class="body"
                 :style="$i18n.locale === 'en' ? 'width: 450px;' : 'width: 390px;'">
                <div class="title">
                    {{ flag ? $t('UserManagementU.DialogTitle1') : $t('UserManagementU.DialogTitle2') }}
                </div>
                <div class="inputSuffix">
                    {{ $t('UserManagementU.DISPLAY_USER_INFO_DG_BELONGING_ROW_TITLE_BELONGING_NAME') }}：
                    <el-input ref="input"
                              size="small"
                              @input="e => belongingName = validForbid(e)"
                              v-model="belongingName"></el-input>
                </div>
            </div>
            <span slot="footer"
                  class="dialog-footer">
                <button :class="['button', 'buttonHighlight', belongingNameUpdata ? 'disabled' : '']"
                        :disabled="belongingNameUpdata"
                        @click="belonging">
                    {{ flag ? $t('index.DialogButton1') : $t('index.DialogButton2') }}
                </button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'BelongingEdit',
    data () {
        return {
            loading: false,
            dialogVisible: false,
            belongingName: '',
            belongingNamePrototype: '',
            belongingNameUpdata: true,
            flag: false,
            no: 0,
            title: ''
        }
    },
    watch: {
        belongingName () {
            if (this.title === this.$t('UserManagementU.DialogName')) {
                this.belongingNameUpdata = this.belongingNamePrototype === this.belongingName
            } else if (this.title === this.$t('UserManagementU.DialogBelongAdd')) {
                this.belongingNameUpdata = this.belongingName === ''
            }
        }
    },
    methods: {
        // 浏览器刷新事件
        beforeunloadHandlerBelongingEdit (e) {
            const beforeunload = !this.belongingNameUpdata
            console.log('利用者管理-->利用者管理-->所属')
            if (beforeunload) {
                e = e || window.event
                if (e) {
                    e.returnValue = '关闭提示'
                }
                return beforeunload
            }
            return
        },
        show (flag, no, belongingName = '') {
            this.dialogVisible = true
            this.flag = flag
            if (flag) this.no = no
            this.title = this.$t(flag ? 'UserManagementU.DialogName' : 'UserManagementU.DialogBelongAdd')

            setTimeout(() => {
                this.$refs.input.focus()
                this.belongingName = belongingName
                this.belongingNamePrototype = belongingName
            }, 200)
            // 添加监听浏览器刷新事件
            window.addEventListener('beforeunload', this.beforeunloadHandlerBelongingEdit, false)
        },
        belonging () {
            let belongingName = this.belongingName
            if (/[{}\\"]/gm.test(this.belongingName)) {
                belongingName = this.$request.replaceMethod(this.belongingName)
                console.log(belongingName)
            }
            this.$message.closeAll()
            !this.flag ? this.belongingCreate(belongingName) : this.belongingUpdate(belongingName)
        },
        // belongingCreate
        belongingCreate (belongingName) {
            if (belongingName === '') {
                this.$message.warning(this.$t('UserManagementU.DialogInputCheck1'))
            } else if (belongingName === '全て' || belongingName === '(所属なし)') {
                this.$message.warning(this.$t('UserManagementU.DialogInputCheck2'))
            } else {
                this.loading = true
                const body = (`{"belongingName":"${belongingName}"}`)
                this.$request.usermanagement.additionalInformation(body).then(response => {
                    console.log('additionalInformation-post请求成功:', response.status, response.statusText)
                    const data = this.$request.CODE(response.data)
                    if (Object.prototype.toString.call(data) === '[object Object]') {
                        this.$message.success(this.$t('UserManagementU.DialogInputCheck3'))
                        this.belongingEditClose()
                        this.$emit('belonging')
                    }
                    this.loading = false
                }).catch(err => {
                    this.loading = false
                    if (err.status === 401) {
                        this.$request.login.refreshToken().then(response => {
                            response ? this.belongingCreate(belongingName) : ''
                        })
                    } else {
                        if (err.status >= 400 && err.status < 500 && err.status !== 401) {
                            this.belongingEditClose()
                        }
                        this.$request.requestError(`additionalInformation-post请求失败:`, err, 'BelongingEdit')
                    }
                })
            }
        },
        // belongingUpdate
        belongingUpdate (belongingName) {
            if (belongingName === '') {
                this.$message.warning(this.$t('UserManagementU.DialogInputCheck1'))
            } else if (belongingName === '全て' || belongingName === '(所属なし)') {
                this.$message.warning(this.$t('UserManagementU.DialogInputCheck2'))
            } else {
                this.loading = true
                const body = (`{"newBelongingName":"${belongingName}"}`)
                this.$request.usermanagement.editingInformation(this.no, body).then(response => {
                    console.log('editingInformation-patch请求成功:', response.status, response.statusText)
                    const data = this.$request.CODE(response.data)
                    if (Object.prototype.toString.call(data) === '[object Object]') {
                        this.$message.success(this.$t('UserManagementU.DialogInputCheck4'))
                        this.belongingEditClose()
                        this.$emit('belonging')
                    }
                    this.loading = false
                }).catch(err => {
                    this.loading = false
                    if (err.status === 401) {
                        this.$request.login.refreshToken().then(response => {
                            response ? this.belongingUpdate(belongingName) : ''
                        })
                    } else {
                        if (err.status >= 400 && err.status < 500 && err.status !== 401) {
                            this.belongingEditClose()
                        }
                        this.$request.requestError(`editingInformation-patch请求失败:`, err, 'BelongingEdit')
                    }
                })
            }
        },
        // 右上角关闭按钮的事件
        belongingEditClose () {
            this.loading = false
            this.dialogVisible = false
            Object.assign(this.$data, this.$options.data())
            window.removeEventListener('beforeunload', this.beforeunloadHandlerBelongingEdit, false)
        }
    }
}
</script>

<style lang="less" scoped>
@import url("../../../less/pages/UserManagement/UserManagementU/BelongingEdit.less");
</style>
