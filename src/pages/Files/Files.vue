<template>
    <div id="files">
        <el-container>
            <el-header height="40px">
                <el-menu :default-active="activeIndex"
                         class="el-menu-demo"
                         mode="horizontal"
                         router
                         text-color="#2D2D3C"
                         @select="handleSelect">
                    <el-menu-item v-for="(item, index) in menudata"
                                  :key="index"
                                  :index="item.router"
                                  :route="item.router">{{ $t(item.name) }}</el-menu-item>
                </el-menu>
            </el-header>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </div>
</template>

<script>
import bus from '@c/bus'

export default {
    name: 'Files',
    data () {
        return {
            activeIndex: this.$router.app._route.path,
            menudata: [
                {
                    router: '/Files/Allfiles',
                    name: 'files.DISPLAY_FILE_INFO_ALL_FILES'
                },
                // {
                //   router: '/Bookmarks',
                //   name: 'お気に入り'
                // },
                {
                    router: '/Files/Dustbin',
                    name: 'files.DISPLAY_FILE_INFO_TRASH'
                }
            ]
        }
    },
    mounted () {
        document.getElementById('home').addEventListener('click', (e) => {
            if (e.target.className !== 'detailedSearchBreadcrumb') {
                this.boundingClientRect(this.$route.fullPath, e)
            }
        })
    },
    methods: {
        boundingClientRect (fullPath, event) {
            if (['/Files/Allfiles', '/Files/Dustbin'].includes(this.$route.fullPath)) {
                const boundingClientRect = document.getElementsByClassName('ulBody')[0].getBoundingClientRect()
                if (
                    event.clientY > boundingClientRect.bottom || event.clientY < boundingClientRect.top ||
                    event.clientX > boundingClientRect.right || event.clientX < boundingClientRect.left
                ) {
                    bus.$emit('boundingClientRect')
                }
            }
        },
        handleSelect (key) {
            if (key === '/Files/Dustbin') {
                bus.$emit('settingPersonal')
            }
        }
    }
}
</script>

<style lang="less" scoped>
@import url("../../less/pages/Files/Files.less");
</style>
