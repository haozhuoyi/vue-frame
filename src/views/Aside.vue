<template>
    <div id="aside">
        <div class="asideMenu"
             @click="routerTo(menuData[0])">
            <div class="menu"
                 :style="{
                     backgroundColor: name === menuData[0].router || name === 'Bookmarks' || name === 'Dustbin' ? '#fff' : ''
                 }">
                <el-image v-show="name === menuData[0].router || name === 'Bookmarks' || name === 'Dustbin'"
                          :src="menuData[0].image.checked"
                          fit="scale-down"></el-image>
                <el-image v-show="name !== menuData[0].router && name !== 'Bookmarks' && name !== 'Dustbin'"
                          :src="menuData[0].image.unchecked"
                          fit="scale-down"></el-image>
                <div class="menuName"
                     :style="{
                         color: name === menuData[0].router || name === 'Bookmarks' || name === 'Dustbin' ? '#212221' : ''
                     }">{{ $t(menuData[0].aside) }}</div>
            </div>
        </div>
        <div class="asideMenu"
             @click="routerTo(menuData[1])">
            <div class="menu"
                 :style="{
                     backgroundColor: name === menuData[1].router ? '#fff' : '',
                     paddingTop: '10px'
                 }">
                <el-image v-show="name === menuData[1].router"
                          :src="menuData[1].image.checked"
                          fit="scale-down"></el-image>
                <el-image v-show="name !== menuData[1].router"
                          :src="menuData[1].image.unchecked"
                          fit="scale-down"></el-image>
                <div class="menuName"
                     :style="{
                         color: name === menuData[1].router ? '#212221' : '',
                     }">{{ $t(menuData[1].aside) }}</div>
            </div>
        </div>
        <div class="asideMenu"
             @click="routerTo(menuData[2])">
            <div class="menu"
                 :style="{
                     backgroundColor: name.indexOf(menuData[2].router) !== -1 ? '#fff' : '',
                     paddingTop: '4px'
                 }">
                <el-image v-show="name.indexOf(menuData[2].router) !== -1"
                          :src="menuData[2].image.checked"
                          fit="scale-down"></el-image>
                <el-image v-show="name.indexOf(menuData[2].router) === -1"
                          :src="menuData[2].image.unchecked"
                          fit="scale-down"></el-image>
                <div class="menuName"
                     :style="{
                         color: name.indexOf(menuData[2].router) !== -1 ? '#212221' : '',
                     }">{{ $t(menuData[2].aside) }}</div>
            </div>
        </div>
        <div class="asideMenu"
             @click="routerTo(menuData[3])">
            <div class="menu"
                 :style="{
                     backgroundColor: name === menuData[3].router ? '#fff' : ''
                 }">
                <el-image v-show="name === menuData[3].router"
                          :src="menuData[3].image.checked"
                          fit="scale-down"></el-image>
                <el-image v-show="name !== menuData[3].router"
                          :src="menuData[3].image.unchecked"
                          fit="scale-down"></el-image>
                <div class="menuName"
                     :style="{
                         color: name === menuData[3].router ? '#212221' : ''
                     }">{{ $t(menuData[3].aside) }}</div>
            </div>
        </div>
        <div class="asideMenu"
             @click="routerTo(menuData[4])">
            <div class="menu"
                 :style="{
                     backgroundColor: name === menuData[4].router ? '#fff' : ''
                 }">
                <el-image v-show="name === menuData[4].router"
                          :src="menuData[4].image.checked"
                          fit="scale-down"></el-image>
                <el-image v-show="name !== menuData[4].router"
                          :src="menuData[4].image.unchecked"
                          fit="scale-down"></el-image>
                <div class="menuName"
                     :style="{
                         color: name === menuData[4].router ? '#212221' : ''
                     }">{{ $t(menuData[4].aside) }}</div>
            </div>
        </div>
        <!-- <div class="asideMenu"
             @click="routerTo(menuData[5])">
            <div class="menu"
                 :style="{
                     backgroundColor: name === menuData[5].router ? '#fff' : ''
                 }">
                <el-image v-show="name === menuData[5].router"
                          :src="menuData[5].image.checked"
                          fit="scale-down"></el-image>
                <el-image v-show="name !== menuData[5].router"
                          :src="menuData[5].image.unchecked"
                          fit="scale-down"></el-image>
                <div class="menuName">{{ menuData[5].aside }}</div>
            </div>
        </div> -->
    </div>
</template>

<script>
import bus from '@c/bus.js'

export default {
    name: 'Aside',
    data () {
        return {
            menuData: [
                {
                    aside: 'aside.fileManagement',
                    router: 'Allfiles',
                    image: {
                        checked: require('@a/images/aside/aside-folder-checked.svg'), // 选中
                        unchecked: require('@a/images/aside/aside-folder-unchecked.svg') // 未选中
                    }
                },
                {
                    aside: 'aside.outputData',
                    router: 'OutputData',
                    image: {
                        checked: require('@a/images/aside/aside-outputdata-checked.svg'), // 选中
                        unchecked: require('@a/images/aside/aside-outputdata-unchecked.svg') // 未选中
                    }
                },
                {
                    aside: 'aside.userManagement',
                    router: 'Management',
                    image: {
                        checked: require('@a/images/aside/aside-UserManagement-checked.svg'), // 选中
                        unchecked: require('@a/images/aside/aside-UserManagement-unchecked.svg') // 未选中
                    }
                },
                {
                    aside: 'aside.DISPLAY_MAIN_TAB_MEASURE_INFO',
                    router: 'Determination',
                    image: {
                        checked: require('@a/images/aside/aside-Determination-checked.svg'), // 选中
                        unchecked: require('@a/images/aside/aside-Determination-unchecked.svg') // 未选中
                    }
                },
                {
                    aside: 'aside.DISPLAY_RIGHT_CLICK_MENU_MOVE_MAPPIN_INFO',
                    router: 'MapPins',
                    image: {
                        checked: require('@a/images/aside/aside-MapPins-checked.svg'), // 选中
                        unchecked: require('@a/images/aside/aside-MapPins-unchecked.svg') // 未选中
                    }
                },
                {
                    aside: '追加\nオプション',
                    router: 'AdditionalOptions',
                    image: {
                        checked: require('@a/images/aside/aside-AdditionalOptions-checked.svg'), // 选中
                        unchecked: require('@a/images/aside/aside-AdditionalOptions-unchecked.svg') // 未选中
                    }
                }
            ],
            name: ''
        }
    },
    mounted () {
        this.name = this.$router.history.current.name

        bus.$on('JumpToThePageWithoutPermission', () => {
            this.$router.push({name: 'UserManagementU'})
        })
    },
    methods: {
        routerTo (item) {
            this.$nextTick(() => {
                this.name = item.router
                if (item.router !== this.$router.app._route.name) {
                    this.$router.push({
                        name: item.router
                    })
                }
            })
        }
    }
}
</script>

<style lang="less" scoped>
@import url("../less/views/Aside.less");
</style>
