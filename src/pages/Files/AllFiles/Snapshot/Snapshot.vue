<template>
    <div id="snapshot">
        <el-container v-loading="loading"
                      :element-loading-text="$t('common.DISPLAY_UNDER_READING')"
                      element-loading-spinner="el-icon-loading"
                      element-loading-background="rgba(255,255,255,.4)"
                      onselectstart="return false;">
            <el-header height="auto">
                <el-collapse-transition>
                    <div v-show="addVisible"
                         style="padding: 10px 20px;border: 1px solid;">
                        <DetailedSearch></DetailedSearch>
                    </div>
                </el-collapse-transition>
                <Header @Header="addVisible = !addVisible"
                        @getFile="getFile"></Header>
            </el-header>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </div>
</template>

<script>
import Header from './SnapshotHeader.vue'
import DetailedSearch from '@c/DetailedSearch.vue'

export default {
    name: 'Snapshot',
    components: {
        Header, DetailedSearch
    },
    data () {
        return {
            loading: false,
            addVisible: false,
            tableData: []
        }
    },
    methods: {
        // // ビューを切り替える
        // viewtype (item) {
        //     this.activeName = item
        // },
        // ファイル&&フォルダを取得する
        getFolder (NO) {
            this.loading = true
            const body = (
                '{"NeedPointCNT": "false", "NeedDirectContentCNT": "false", "NeedQRInfo": "false"}')
            return this.$request.folder.getFolders(NO, body).then(response => {
                console.log('getFolders-get请求成功:', response.status, response.statusText)
                const data = this.$request.CODE(response.data)
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    this.loading = false
                    return response.data.result
                }
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.getFolder(NO) : ''
                    })
                } else {
                    if (err.status >= 400 && err.status < 500 && err.status !== 401) {
                        this.addVisible = false
                    }
                    this.$request.requestError('getFolders-get请求失败', err, 'Snapshot')
                }
            })
        },
        // ドキュメント検索
        getFile (inp) {
            this.loading = true
            const body = (`{"Query": "${inp}"}`)
            this.$request.folder.FolderFuzzyQuery(
                this.breadcrumb[this.breadcrumb.length - 1].NO, body
            ).then(response => {
                console.log('FolderFuzzyQuery-get请求成功:', response.status, response.statusText)
                const data = this.$request.CODE(response.data)
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    if (data.result.length > 0) {
                        this.tableData = data.result
                    } else {
                        this.$message.success(this.$t('Snapshot.MESSAGE_FILE_INFO_SNAP_SHOT_NO_DATA'))
                    }
                }
                this.loading = false
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.getFile(inp) : ''
                    })
                } else {
                    if (err.status >= 400 && err.status < 500 && err.status !== 401) {
                        this.addVisible = false
                    }
                    this.$request.requestError('FolderFuzzyQuery-get请求失败', err, 'Snapshot')
                }
            })
        }
    }
}
</script>

<style lang="less" scoped>
@import url("../../../../less/pages/Files/AllFiles/Snapshot/SnapShot.less");
</style>
