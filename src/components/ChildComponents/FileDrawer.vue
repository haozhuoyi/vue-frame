<template>
    <div id="fileDrawer">
        <el-tabs v-model="drawerActiveName"
                 :stretch="true"
                 @tab-click="handleClick">
            <el-tab-pane label="写真情報"
                         name="first">写真情報</el-tab-pane>
            <el-tab-pane label="Excel 帳票"
                         name="second">Excel 帳票</el-tab-pane>
            <el-tab-pane label="スナップショット"
                         name="third">スナップショット</el-tab-pane>
            <el-tab-pane label="XC-Gate"
                         name="fourth">XC-Gate</el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
export default {
    name: 'FileDrawer',
    data () {
        return {
            drawerActiveName: 'first'
        }
    },
    mounted () {
        if (this.drawerActiveName === 'first') {
            document.getElementById('fileDrawer').getElementsByClassName('el-tabs__active-bar is-top')[0].style.cssText = 'width: 62px; transform: translateX(5px);'
        } else if (this.drawerActiveName === 'second') {
            document.getElementById('fileDrawer').getElementsByClassName('el-tabs__active-bar is-top')[0].style.cssText = 'width: 63px; transform: translateX(77px);'
        } else if (this.drawerActiveName === 'third') {
            document.getElementById('fileDrawer').getElementsByClassName('el-tabs__active-bar is-top')[0].style.cssText = 'width: 96px; transform: translateX(150px);'
        } else if (this.drawerActiveName === 'fourth') {
            document.getElementById('fileDrawer').getElementsByClassName('el-tabs__active-bar is-top')[0].style.cssText = 'width: 62px; transform: translateX(256px);'
        }
    },
    methods: {
        handleClick (tab, event) {
            console.log(tab, event)
        }
    }
}
</script>

<style lang="less" scoped>
@import url("../../less/components/ChildComponents/FileDrawer.less");
</style>
