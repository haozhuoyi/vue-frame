<template>
    <div id="stampSetting">
        <el-dialog title="スタンプ管理"
                   :visible.sync="stampManagementDialogVisible"
                   :show-close="true"
                   :close-on-click-modal="false"
                   :close-on-press-escape="false"
                   :destroy-on-close="true"
                   class="stampManagement"
                   v-loading="loading"
                   :element-loading-text="$t('common.DISPLAY_UNDER_READING')"
                   element-loading-spinner="el-icon-loading"
                   element-loading-background="rgba(255,255,255,.4)">
            <div class="gridContent purple">
                <div class="titleButton"
                     style="text-align: left;display:inline-block">
                    表示：
                    <el-radio-group v-model="radio"
                                    @change="stampSelect">
                        <el-radio-button class="shortButton"
                                         label="allStamps">すべて</el-radio-button>
                        <el-radio-button class="longButton"
                                         label="favorite">お気に入りのみ</el-radio-button>
                        <el-radio-button class="longButton"
                                         label="noFavorite">お気に入り以外</el-radio-button>
                        <el-radio-button class="shortButton"
                                         label="newStamps">新着のみ</el-radio-button>
                    </el-radio-group>
                </div>
                <el-row>
                    <div class="content">
                        <el-col :span="3"
                                v-for="item in Stamp"
                                :key="item.STAMP_NO">
                            <div class="contentSvg"
                                 v-if="item.STAMP_NO !== null"
                                 v-html="item.Stamp">
                                {{ item.Stamp }}
                            </div>
                            <div class="collect"
                                 v-if="item.STAMP_NO !== null"
                                 @click="collectStamp(item)">
                                <svg xmlns="http://www.w3.org/2000/svg"
                                     width="10.81"
                                     height="10.3"
                                     viewBox="0 0 30.662 29.532">
                                    <path id="路径_257"
                                          data-name="路径 257"
                                          d="M11561.333,1142.332l-4,10h-10l8,7-3,10,9-6,9,6-3-10,8-7h-10Z"
                                          transform="translate(-11546.002 -1140.986)"
                                          :fill="item.FavoriteNo === null ? 'none' : '#ff0'"
                                          stroke="#707070"
                                          stroke-width="1" />
                                </svg>
                            </div>
                        </el-col>
                    </div>
                </el-row>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import bus from '@c/bus.js'
export default {
    name: 'StampSetting',
    data () {
        return {
            stampManagementDialogVisible: false,
            loading: false,
            radio: 'allStamps',
            Stamp: []
        }
    },
    mounted () {
        bus.$on('getStempSetting', () => {
            this.stampManagement()
        })
    },
    methods: {
        stampManagement () {
            this.stampManagementDialogVisible = true
            this.stampSelect()
        },
        // stamp設定クエリ
        stampSelect () {
            this.loading = true
            const body = (`{"StampType":"${this.radio}"}`)
            this.$request.settings.StampSelect(body).then(response => {
                console.log('StampSelect-get请求成功:', response.status, response.statusText)
                const data = this.$request.CODE(response.data)
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    this.Stamp = data.result
                }
                this.loading = false
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.stampSelect() : ''
                    })
                } else {
                    if (err.status >= 400 && err.status < 500 && err.status !== 401) {
                        this.stampManagementDialogVisible = false
                    }
                    this.$request.requestError(`StampSelect-get请求失败:`, err, 'StampSetting')
                }
            })
        },
        // コレクション/コレクションのキャンセル
        collectStamp (item) {
            if (item.FavoriteNo === null) {
                // コレクション
                this.loading = true
                const body = `{"ContractType":"${item.CONTRACT_TYPE}"}`
                this.$request.settings.StampFavoritesAdd(item.STAMP_NO, body).then(response => {
                    console.log('StampFavoritesAdd-get请求成功:', response.status, response.statusText)
                    const data = this.$request.CODE(response.data)
                    if (Object.prototype.toString.call(data) === '[object Object]') {
                        console.log(data.result)
                        this.$message.success('添加收藏成功')
                    }
                    this.loading = false
                }).catch(err => {
                    this.loading = false
                    if (err.status === 401) {
                        this.$request.login.refreshToken().then(response => {
                            response ? this.collectStamp(item) : ''
                        })
                    } else {
                        if (err.status >= 400 && err.status < 500 && err.status !== 401) {
                            this.stampManagementDialogVisible = false
                            this.$emit('close')
                        }
                        this.$request.requestError(`StampFavoritesAdd-get请求失败:`, err, 'StampSetting')
                    }
                })
            } else {
                // コレクションのキャンセル
                this.loading = true
                this.$request.settings.StampFavoritesDle(item.FavoriteNo, '').then(response => {
                    console.log('StampFavoritesDle-get请求成功:', response.status, response.statusText)
                    const data = this.$request.CODE(response.data)
                    if (Object.prototype.toString.call(data) === '[object Object]') {
                        console.log(data.result)
                        this.$message.success('取消收藏成功')
                    }
                    this.loading = false
                }).catch(err => {
                    this.loading = false
                    if (err.status === 401) {
                        this.$request.login.refreshToken().then(response => {
                            response ? this.collectStamp(item) : ''
                        })
                    } else {
                        if (err.status >= 400 && err.status < 500 && err.status !== 401) {
                            this.stampManagementDialogVisible = false
                            this.$emit('close')
                        }
                        this.$request.requestError(`StampFavoritesDle-get请求失败:`, err, 'StampSetting')
                    }
                })
            }
            // データを更新
            this.stampSelect()
        }
    }
}
</script>

<style lang="less" scoped>
@import url("../../less/pages/Settings/StampSetting.less");
</style>
