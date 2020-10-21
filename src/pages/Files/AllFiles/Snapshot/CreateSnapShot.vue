<template>
    <div id="createSnapShot">
        <el-dialog :title="$t('createSnapShot.DISPLAY_MAKE_SNAP_SHOT_POPUP_TITLE')"
                   :visible.sync="show"
                   :close-on-click-modal="false"
                   :close-on-press-escape="false"
                   :destroy-on-close="true"
                   class="snapShot"
                   box-sizing="border-box">
            <el-form :model="form"
                     label-position="right"
                     label-width="145px"
                     ref="form"
                     class="formSnapShot">
                <el-form-item :label="$t('createSnapShot.DISPLAY_FILE_INFO_DG_SNAP_SHOT_INFO_DETAIL_KBN_TITLE')"
                              prop="TargetContents">
                    <el-radio-group v-model="form.TargetContents">
                        <el-radio-button label="ALL">{{ $t('createSnapShot.DISPLAY_FILE_INFO_DG_SNAP_SHOT_INFO_DETAIL_KBN_ALL') }}</el-radio-button>
                        <el-radio-button class="longButton"
                                         label="MERGE">{{ $t('createSnapShot.DISPLAY_FILE_INFO_DG_SNAP_SHOT_INFO_DETAIL_KBN_MERGE') }}</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :label="$t('createSnapShot.DISPLAY_PIN_SORT_TITLE')"
                              prop="PinSortType">
                    <el-radio-group v-model="form.PinSortType">
                        <el-radio-button class="longButton"
                                         label="pinRegtime">{{ $t('createSnapShot.DISPLAY_PIN_SORT_REGIST_DATETIME') }}</el-radio-button>
                        <el-radio-button label="pinNo">{{ $t('createSnapShot.DISPLAY_PIN_SORT_PIN_NO') }}</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :label="$t('createSnapShot.DISPLAY_PIN_SORT_EACH_COLOR')"
                              prop="PinSortRange">
                    <el-radio-group v-model="form.PinSortRange">
                        <el-radio-button label="eachColor">{{ $t('createSnapShot.DISPLAY_PIN_SORT_EACH_COLOR_YES') }}</el-radio-button>
                        <el-radio-button label="all">{{ $t('createSnapShot.DISPLAY_PIN_SORT_EACH_COLOR_NO') }}</el-radio-button>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer"
                 class="dialog-footer">
                <button class="bottonAdd buttonCommon"
                        @click="create">
                    {{ $t('createSnapShot.DISPLAY_FILE_INFO_DG_SNAP_SHOT_INFO_MAKE') }}
                </button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import bus from '@/components/bus.js'

export default {
    name: 'CreateSnapShot',
    data () {
        return {
            show: false,
            loading: false,
            form: {
                TargetContents: 'ALL',
                PinSortType: 'pinRegtime',
                PinSortRange: 'all'
            },
            no: ''
        }
    },
    computed: {
    },
    mounted () {
        this.$nextTick(() => {
            bus.$on('CreateSnapShot', msg => {
                this.show = msg.show
                this.no = msg.NO
            })
        })
    },
    methods: {
        create () {
            this.loading = true
            const Body =
                '{"No":"' + this.no + '","TargetContents":"' + this.form.TargetContents + '","PinSortType":"' + this.form.PinSortType + '","PinSortRange":"' + this.form.PinSortRange + '"}'
            this.$request.snapShot.CreateSnapShot(Body).then(response => {
                console.log('CreateSnapShot-get请求成功:', response.status, response.statusText)
                const data = this.$request.CODE(response.data)
                if (data && data === 'getProjects') {
                    // 重新获取项目数据
                    bus.$emit('getProjects')
                }
                this.loading = false
                this.show = false
                this.$message.success(this.$t('createSnapShot.MESSAGE_MAKE_SNAP_SHOT_MAKE_ACCEPTED'))
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.create() : ''
                    })
                } else {
                    if (err.status >= 400 && err.status < 500 && err.status !== 401) {
                        this.show = false
                    }
                    this.$request.requestError('CreateSnapShot-post请求失败', err, 'CreateSnapShot')
                }
            })
        }
    }
}
</script>

<style lang="less" scoped>
@import url("../../../../less/pages/Files/AllFiles/Snapshot/CreateSnapShot.less");
</style>
