<template>
    <div id="accountManagement">
        <el-dialog title="Box連携アカウント管理"
                   :visible.sync="AccountManagementVisible"
                   :close-on-click-modal="false"
                   :close-on-press-escape="false"
                   :destroy-on-close="true"
                   class="accountManagement"
                   v-loading="loading"
                   :element-loading-text="$t('common.DISPLAY_UNDER_READING')"
                   element-loading-spinner="el-icon-loading"
                   element-loading-background="rgba(255,255,255,.4)">
            <div class="div_body">
                <el-table :data="boxConnectInfoList"
                          height="169px"
                          style="width: 100%"
                          class="account-table">
                    <el-table-column prop="LOGIN_ID"
                                     label="アカウント"
                                     width="254px">
                    </el-table-column>
                    <el-table-column label="連携状況"
                                     width="110px">
                        <template slot-scope="scope">
                            <img v-if="scope.row.STATUS === 'VALID'"
                                 :src="require('@a/images/settings/settings-status-valid.svg')"
                                 class="status-icon" />
                            <img v-if="scope.row.STATUS === 'AUTH_WAIT'"
                                 :src="require('@a/images/settings/settings-status-auth-wait.svg')"
                                 class="status-icon" />
                            <img v-if="scope.row.STATUS === 'INVALID'"
                                 :src="require('@a/images/settings/settings-status-invalid.svg')"
                                 class="status-icon" />
                            <span class="status-span">{{ scope.row.STATUS_NAME }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="UPD_TIME"
                                     label="更新日時"
                                     width="84px"
                                     align="center">
                    </el-table-column>
                </el-table>
            </div>
            <div slot="footer"
                 class="dialog-footer">
                <el-button class="btn-3"
                           @click="AccountManagementVisible = false">更新</el-button>
                <el-button class="btn-3"
                           @click="innerVisibleAddMembership = true">追加</el-button>
                <el-button class="btn-3"
                           @click="BOXAccountReAuth">再認証</el-button>
                <el-button class="btn-red"
                           @click="BOXAccountDle">削除</el-button>
                <div id="add-membership">
                    <el-dialog title="Box連携アカウント追加"
                               :visible.sync="innerVisibleAddMembership"
                               :close-on-click-modal="false"
                               append-to-body
                               class="add-membership">
                        <el-form label-position="left"
                                 label-width="85px"
                                 :model="Name"
                                 ref="form">
                            <span class="span-add-message">Box連携の管理に使用する任意の名称を入力してください。</span>
                            <el-form-item label="アカウント名："
                                          prop="accountName">
                                <el-input v-model="Name.accountName"
                                          @input="e => Name.accountName = validForbid(e)"></el-input>
                            </el-form-item>
                        </el-form>
                        <div slot="footer"
                             class="dialog-footer">
                            <el-button @click="additionalInformation"
                                       class="btn-red">追加</el-button>
                        </div>
                    </el-dialog>
                </div>
            </div>
        </el-dialog>

    </div>
</template>

<script>
export default {
    name: 'AccountManagement',
    props: {
        'boxConnectInfoList': {
            type: Array,
            default: () => {
                return []
            }
        }
    },
    data () {
        return {
            AccountManagementVisible: false,
            innerVisibleAddMembership: false,
            loading: false,
            Name: {
                accountName: ''
            },
            row: {}
        }
    },
    methods: {
        AccountManagement (bool) {
            this.Name = {accountName: ''}
            this.AccountManagementVisible = bool
        },
        // 表头样式自定义
        headerCellClassName ({column}) {
            if (column) {
                return 'col-blue'
            }
        },
        // 单元格点击事件
        cellClick ({row}) {
            this.$refs.xTree.clearSelection()
            this.$refs.xTree.setCheckboxRow(row, true)
            this.row = row
            console.log(this.row)
        },
        // Box連携ユーザー追加
        additionalInformation () {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.loading = true
                    const body = ('{"ACCOUNT_NAME": "' + this.Name.accountName + '"}')
                    this.$request.settings.BOXAccount(body).then(response => {
                        console.log('BOXAccount-post请求成功:', response.status, response.statusText)
                        const data = this.$request.CODE(response.data)
                        if (Object.prototype.toString.call(data) === '[object Object]') {
                            this.$message.success('正常に追加されました。')
                            this.$emit('update:boxConnectInfoList', true)
                        }
                        this.loading = false
                    }).catch(err => {
                        this.loading = false
                        if (err.status === 401) {
                            this.$request.login.refreshToken().then(response => {
                                response ? this.additionalInformation() : ''
                            })
                        } else {
                            if (err.status >= 400 && err.status < 500 && err.status !== 401) {
                                this.innerVisibleAddMembership = false
                                this.AccountManagementVisible = false
                                this.$emit('close')
                            }
                            this.$request.requestError(`BOXAccount-post请求失败:`, err, 'AccountManagement')
                        }
                    })
                    this.innerVisibleAddMembership = false
                    this.Name.accountName = ''
                } else {
                    this.$message('error submit!!')
                    return false
                }
            })
        },
        // BOX連携用户消除
        BOXAccountDle () {
            this.loading = true
            const body = ('{"CONNECT_IDS": "' + this.row.CONNECT_ID + '"}')
            this.$request.settings.BOXAccountDle(body).then(response => {
                console.log('BOXAccountDle-delete请求成功:', response.status, response.statusText)
                const data = this.$request.CODE(response.data)
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    if (data.result.deleteNgArray.length > 0) {
                        this.$message({
                            dangerouslyUseHTMLString: true,
                            message: `<strong>消除失败的連携用户名: ${data.result.DELETE_NG_ARRAY.toString()}</strong>`
                        })
                    } else {
                        this.$message.success('消除成功')
                    }
                    this.$emit('update:boxConnectInfoList', true)
                }
                this.loading = false
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.BOXAccountDle() : ''
                    })
                } else {
                    if (err.status >= 400 && err.status < 500 && err.status !== 401) {
                        this.innerVisibleAddMembership = false
                        this.AccountManagementVisible = false
                        this.$emit('close')
                    }
                    this.$request.requestError(`BOXAccountDle-delete请求失败:`, err, 'AccountManagement')
                }
            })
        },
        // BOX連携设定再认证
        BOXAccountReAuth () {
            this.loading = true
            console.log(this.row)
            const body = ('{"CONNECT_ID": "' + this.row.CONNECT_ID + '"}')
            this.$request.settings.BOXAccountReAuth(body).then(response => {
                console.log('BOXAccountReAuth-patch请求成功:', response.status, response.statusText)
                const data = this.$request.CODE(response.data)
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    console.log(data)
                }
                this.loading = false
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.BOXAccountReAuth() : ''
                    })
                } else {
                    if (err.status >= 400 && err.status < 500 && err.status !== 401) {
                        this.innerVisibleAddMembership = false
                        this.AccountManagementVisible = false
                        this.$emit('close')
                    }
                    this.$request.requestError(`BOXAccountReAuth-patch请求失败:`, err, 'AccountManagement')
                }
            })
        }
    }
}
</script>

<style lang="less" scoped>
@import url("../../../less/pages/Settings/Box/AccountManagement.less");
</style>
