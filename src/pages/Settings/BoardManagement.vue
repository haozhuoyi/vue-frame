<template>
    <div id="boardManagement">
        <el-dialog title="黒板管理"
                   :visible.sync="boardManagementDialogVisible"
                   :show-close="true"
                   :close-on-click-modal="false"
                   :close-on-press-escape="false"
                   :destroy-on-close="true"
                   class="boardManagement"
                   v-loading="loading"
                   :element-loading-text="$t('common.DISPLAY_UNDER_READING')"
                   element-loading-spinner="el-icon-loading"
                   element-loading-background="rgba(255,255,255,.4)">
            <div class="gridContent purple">
                <div class="titleButton"
                     style="text-align: left;display:inline-block">
                    表示：
                    <el-radio-group v-model="radio"
                                    @change="settingBlackBoard">
                        <el-radio-button class="shortButton"
                                         label="allBlockblords">すべて</el-radio-button>
                        <el-radio-button class="longButton"
                                         label="favorite">お気に入りのみ</el-radio-button>
                        <el-radio-button class="longButton"
                                         label="noFavorite">お気に入り以外</el-radio-button>
                        <el-radio-button class="shortButton"
                                         label="newBlockblords">新着のみ</el-radio-button>
                    </el-radio-group>
                </div>

                <el-row>
                    <div class="content">
                        <el-col :span="3"
                                v-for="item in blackBoard"
                                :key="item.NO">
                            <div class="contentSvg"
                                 v-if="item.NO !== null"
                                 v-html="item.DATA">
                                {{ item.DATA }}
                            </div>
                            <div class="contentCollect"
                                 v-if="item.NO !== null"
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
import bus from '@/components/bus.js'

export default {
    name: 'BoardManagement',
    data () {
        return {
            boardManagementDialogVisible: false,
            loading: false,
            radio: 'allBlockblords',
            blackBoard: []
        }
    },
    mounted () {
        bus.$on('getBoardSetting', () => {
            this.boardManagementDialogVisible = true
            this.settingBlackBoard()
        })
    },
    methods: {
        settingBlackBoard () {
            this.loading = true
            const body = `{"BlackboardType":"${this.radio}"}`
            this.$request.settings.SettingBlackBoard(body).then(response => {
                console.log(
                    'SettingBlackBoard-get请求成功:',
                    response.status,
                    response.statusText
                )
                const data = this.$request.CODE(response.data)
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    console.log(data.result)
                    this.blackBoard = data.result
                }
                this.loading = false
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.settingBlackBoard() : ''
                    })
                } else {
                    if (err.status >= 400 && err.status < 500 && err.status !== 401) {
                        this.boardManagementDialogVisible = false
                    }
                    this.$request.requestError(`SettingBlackBoard-get请求失败:`, err, 'BoardManagement')
                }
            })
        },
        // コレクション/コレクションのキャンセル
        collectStamp (item) {
            if (item.FavoriteNo === null) {
                // コレクション
                this.loading = true
                this.$request.settings.BlackBoardFavoritesAdd(item.NO, '').then(response => {
                    console.log('BlackBoardFavoritesAdd-get请求成功:', response.status, response.statusText)
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
                            this.boardManagementDialogVisible = false
                        }
                        this.$request.requestError(`BlackBoardFavoritesAdd-get请求失败:`, err, 'BoardManagement')
                    }
                })
            } else {
                // レクションのキャンセル
                this.loading = true
                this.$request.settings.BlackBoardFavoritesDle(item.FavoriteNo, '').then(response => {
                    console.log('BlackBoardFavoritesDle-get请求成功:', response.status, response.statusText)
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
                            this.boardManagementDialogVisible = false
                        }
                        this.$request.requestError(`BlackBoardFavoritesDle-get请求失败:`, err, 'BoardManagement')
                    }
                })
            }
            // データを更新
            this.settingBlackBoard()
        }
    }
}
</script>

<style lang="less" scoped>
@import url("../../less/pages/Settings/BoardManagement.less");
</style>
