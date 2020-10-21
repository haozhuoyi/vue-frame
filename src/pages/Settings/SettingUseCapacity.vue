<template>
    <div id="settingUseCapacity">
        <el-dialog :visible.sync="settingUseCapacityDialogVisible"
                   :close-on-click-modal="false"
                   :before-close="close"
                   title="使用状況確認">
            <div v-loading="loading"
                 :element-loading-text="$t('common.DISPLAY_UNDER_READING')"
                 element-loading-spinner="el-icon-loading"
                 element-loading-background="rgba(255,255,255,.4)">
                <div class="transitionBox">
                    <div class="titleMessage">
                        <div>人数 (登録者数 / 契約人数)：&nbsp;&nbsp;</div>
                        <div>{{ formLabelAlign.user }}人 / {{ isNaN(formLabelAlign.maxUser)? 'FREE' : formLabelAlign.maxUser + '人' }}</div>
                    </div>
                    <div class="chart">
                        <div class="Mbit">
                            <p>容量</p>
                            <div class="capacity"> ({{ formLabelAlign.capacity.toFixed(2) }}/ {{ isNaN(formLabelAlign.maxCapacity)? 'FREE' : formLabelAlign.maxCapacity + 'GB' }})&nbsp;&nbsp;</div>
                        </div>
                        <div class="divChart">
                            <template>
                                <ve-bar :data="chartData"
                                        width="265px"
                                        height="30px"
                                        :colors="colors"
                                        :tooltip-visible="false"
                                        :extend="chartExtend"
                                        :settings="chartSettings"></ve-bar>
                            </template>
                        </div>
                    </div>
                    <!-- 图例 -->
                    <div class="legend">
                        <div class="filediv">
                            <div class="filelegend"></div>
                            <p>ファイル ({{ formLabelAlign.file.toFixed(2) }}GB)</p>
                        </div>
                        <div class="picturediv">
                            <div class="picturelengend"></div>
                            <p>写真 ({{ formLabelAlign.picture.toFixed(2) }}GB)</p>
                        </div>
                        <div class="snapshotdiv">
                            <div class="snapshotlengend"></div>
                            <p>スナップショット ({{ formLabelAlign.snapshot.toFixed(2) }}GB)</p>
                        </div>
                    </div>
                    <div class="legend">
                        <div class="exceldiv">
                            <div class="excellengend"></div>
                            <p>Excel帳票 ({{ formLabelAlign.excel.toFixed(2) }}GB)</p>
                        </div>
                        <div class="measurediv">
                            <div class="measurelengend"></div>
                            <p>測定 ({{ formLabelAlign.measure.toFixed(2) }}GB)</p>
                        </div>
                        <div class="remainingCapacitydiv">
                            <div class="remainingCapacitylengend"></div>
                            <p>空き ({{ formLabelAlign.remainingCapacity.toFixed(2) }}GB)</p>
                        </div>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import bus from '@c/bus.js'
import 'echarts/lib/component/legend'

export default {
    name: 'SettingUseCapacity',
    data () {
        this.chartSettings = {
            stack: {
                'stack': ['ファイル', '写真', 'スナップショット', 'Excel帳票', '測定', '空き']
            }
        }
        return {
            settingUseCapacityDialogVisible: false,
            loading: false,
            formLabelAlign: {
                file: 0, // ファイル使用容量
                picture: 0, // 画像の使用容量
                snapshot: 0, // スナップショットの使用容量
                excel: 0, // エクセル使用容量
                measure: 0, // 使用容量を測定する
                user: 0, // 使用者数
                maxUser: 0, // 契約ユーザー数
                capacity: 0, // 使用容量合計
                maxCapacity: 0, // 容量
                remainingCapacity: 0// 残り容量
            },
            progressFile: 0,
            progressPicture: 0,
            progressSnapshot: 0,
            progressExcel: 0,
            progressMeasure: 0,
            remainingCapacity: 0,
            chartData: {},
            chartExtend: {
                title: {
                    show: false
                },
                legend: {
                    show: false
                },
                xAxis: {
                    show: false
                },
                yAxis: {
                    show: false
                }

            },
            colors: ['#0D6CC4', '#F5DE6B', '#32CC31', '#CC315C', '#06DFD7', '#3C3C3C']
        }
    },
    mounted () {
        bus.$on('getSettingUse', () => {
            this.getSettingUseCapacity()
        })
    },

    methods: {
        bytesToSize (num) {
            if (num !== 'free') {
                num = parseInt(num)
                const gb = 1024 * 1024 * 1024
                return Math.ceil(num / gb * 100) / 100
            } else {
                return num
            }
        },
        close () {
            this.settingUseCapacityDialogVisible = false
        },
        getSettingUseCapacity () {
            this.settingUseCapacityDialogVisible = true
            this.loading = true
            this.$request.settings.SettingUseCapacity('').then(response => {
                console.log('SettingUseCapacity-get请求成功:', response.status, response.statusText)
                const data = this.$request.CODE(response.data)
                this.formLabelAlign = {
                    file: this.bytesToSize(data.result.file),
                    picture: this.bytesToSize(data.result.picture),
                    snapshot: this.bytesToSize(data.result.snapshot),
                    excel: this.bytesToSize(data.result.excel),
                    measure: this.bytesToSize(data.result.measure),
                    user: data.result.user,
                    maxUser: data.result.maxUser,
                    capacity: this.bytesToSize(data.result.capacity),
                    maxCapacity: this.bytesToSize(data.result.maxCapacity),
                    remainingCapacity: this.bytesToSize(data.result.maxCapacity) - this.bytesToSize(data.result.capacity)
                }
                console.log(this.formLabelAlign)
                this.progressFile = this.formLabelAlign.file / (isNaN(this.formLabelAlign.maxCapacity) ? 100 : this.formLabelAlign.maxCapacity) * 100
                this.progressPicture = this.formLabelAlign.picture / (isNaN(this.formLabelAlign.maxCapacity) ? 100 : this.formLabelAlign.maxCapacity) * 100
                this.progressSnapshot = this.formLabelAlign.snapshot / (isNaN(this.formLabelAlign.maxCapacity) ? 100 : this.formLabelAlign.maxCapacity) * 100
                this.progressExcel = this.formLabelAlign.excel / (isNaN(this.formLabelAlign.maxCapacity) ? 100 : this.formLabelAlign.maxCapacity) * 100
                this.progressMeasure = this.formLabelAlign.measure / (isNaN(this.formLabelAlign.maxCapacity) ? 100 : this.formLabelAlign.maxCapacity) * 100
                this.remainingCapacity = this.formLabelAlign.remainingCapacity / (isNaN(this.formLabelAlign.maxCapacity) ? 100 : this.formLabelAlign.maxCapacity) * 100
                this.chartData = {
                    columns: ['日期', 'ファイル', '写真', 'スナップショット', 'Excel帳票', '測定', '空き'],
                    rows: [
                        {'日期': '', 'ファイル': this.progressFile, '写真': this.progressPicture, 'スナップショット': this.progressSnapshot, 'Excel帳票': this.progressExcel, '測定': this.progressMeasure, '空き': this.remainingCapacity}
                    ]
                }
                this.loading = false
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.getSettingUseCapacity() : ''
                    })
                } else {
                    if (err.status >= 400 && err.status < 500 && err.status !== 401) {
                        this.close()
                    }
                    this.$request.requestError(`SettingUseCapacity-get请求失败:`, err, 'SetSettingUseCapacity')
                }
            })
        }
    }
}
</script>
<style lang="less" scoped>
@import url("../../less/pages/Settings/SettingUseCapacity.less");
</style>
