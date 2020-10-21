<template>
    <div id="app"
         v-loading="loading"
         :element-loading-text="$t('common.DISPLAY_UNDER_READING')"
         element-loading-spinner="el-icon-loading"
         element-loading-background="rgba(255,255,255,.4)">
        <router-view />
        <!-- 文件上传 -->
        <Upload></Upload>
        <!-- 使用容量 -->
        <SettingUseCapacity></SettingUseCapacity>
        <!-- サポート問い合わせ -->
        <Inquiry></Inquiry>
        <!-- スナップショット作成 -->
        <CreateSnapShot></CreateSnapShot>
        <!-- Box連携設定 -->
        <BoxSetting></BoxSetting>
        <!-- 印章设定 -->
        <StampSetting></StampSetting>
        <!-- 黑板设定 -->
        <BoardManagement></BoardManagement>
        <!-- CTB文件设定 -->
        <CtbFileSettings></CtbFileSettings>
        <LicenseStting></LicenseStting>
        <!-- error -->
        <Error></Error>
    </div>
</template>

<script>
import bus from '@c/bus'

export default {
    name: 'App',
    components: {
        Upload: resolve => require(['@c/Uploader/Upload'], resolve),
        CreateSnapShot: resolve => require(['@p/Files/AllFiles/Snapshot/CreateSnapShot'], resolve),
        Inquiry: resolve => require(['@p/Settings/Inquiry'], resolve),
        SettingUseCapacity: resolve => require(['@p/Settings/SettingUseCapacity'], resolve),
        BoxSetting: resolve => require(['@p/Settings/Box/BoxSetting'], resolve),
        StampSetting: resolve => require(['@p/Settings/StampSetting'], resolve),
        BoardManagement: resolve => require(['@p/Settings/BoardManagement'], resolve),
        CtbFileSettings: resolve => require(['@p/Settings/CtbFileSettings'], resolve),
        LicenseStting: resolve => require(['@p/Settings/LicenseStting'], resolve),
        Error: resolve => require(['@v/error/500.vue'], resolve)
    },
    data () {
        return {
            loading: false,
            isRouterAlice: true
        }
    },
    provide () {
        return {
            reload: this.reload
        }
    },
    mounted () {
        bus.$on('localLoading', bool => { this.loading = bool })
    },
    methods: {
        reload () {
            this.isRouterAlice = false
            this.$nextTick(function () {
                this.isRouterAlice = true
            })
        }
    }
}
</script>
<style scoped>
@import "./assets/iconfont/iconfont.css";

@import "../static/elementui/index.css";
@import "../static/vxe-table/vxe-table.css";
@import "../static/v-contextmenu/index.css";
/* @import url('https://unpkg.com/element-ui/lib/theme-chalk/index.css'); */
</style>
<style lang="less">
@import "./less/App.less";
</style>

