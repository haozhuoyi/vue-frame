<template>
    <div id="userManagement">
        <el-container>
            <el-header height="40px">
                <el-menu :default-active="activeIndex"
                         mode="horizontal"
                         router
                         text-color="#2D2D3C">
                    <el-menu-item v-for="(item, index) in menudata"
                                  :key="index"
                                  :index="item.router"
                                  :route="item.router"
                                  :disabled="item.disabled">{{ $t(item.name) }}</el-menu-item>
                </el-menu>
            </el-header>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </div>
</template>

<script>
import bus from '@c/bus.js'

export default {
    name: 'UserManagement',
    data () {
        return {
            activeIndex: '/Management/UserManagementU',
            menudata: [{
                router: '/Management/UserManagementU',
                name: 'index.UserManagement',
                disabled: false
            },
            {
                router: '/Management/GroupManagement',
                name: 'index.GroupManagement',
                disabled: !(
                    this.$store.state.userInfo.isAdmin || this.$store.state.userInfo.authorityName === 'プロジェクト管理者'
                )
            },
            {
                router: '/Management/PermissionManagement',
                name: 'index.PermissionManagement',
                disabled: !(
                    this.$store.state.userInfo.isAdmin || this.$store.state.userInfo.authorityName === 'プロジェクト管理者'
                )
            }
            ],
            oldUrl: ''
        }
    },
    watch: {
        $route (to /* , from */) {
            this.activeIndex = to.path
        }
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            // 通过 `vm` 访问组件实例,将值传入oldUrl
            vm.oldUrl = from.path
        })
    },
    mounted () {
        this.activeIndex = this.$route.fullPath
        bus.$on('storeUpdata', () => {
            const urlMap = {
                '': true,
                '/': true,
                '/login': true,
                '/Files/Allfiles': true
            }
            const disabled = this.$store.state.userInfo.isAdmin || this.$store.state.userInfo.authorityName === 'プロジェクト管理者'
            this.menudata[1].disabled = !disabled
            this.menudata[2].disabled = !disabled

            // console.log(this.oldUrl, !urlMap[this.oldUrl])
            if (!disabled && !urlMap[this.oldUrl]) {
                bus.$emit('JumpToThePageWithoutPermission')
            }
        })
    }
}
</script>

<style lang="less" scoped>
@import url("../../less/pages/UserManagement/Index.less");
</style>
