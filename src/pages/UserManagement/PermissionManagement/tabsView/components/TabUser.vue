<template>
    <div id="user">
        <ul>
            <li class="liHead border"
                style="border-bottom: 1px solid #999999;">{{ $t('tabUser.DISPLAY_GROUP_DG_MEMBER_ROW_TITLE_BELONGING_NAME') }}</li>
            <li class="liHead wo border">{{ $t('tabUser.DISPLAY_GROUP_DG_MEMBER_ROW_TITLE_USER_NAME') }}</li>
        </ul>
        <ul class="ulBody"
            onselectstart="return false;">
            <li v-for="(itme,index) in userData"
                :key="index"
                :class="`user${index}`"
                @click.exact="clickEvent(index, itme)"
                @click.ctrl="ctrlClickEvent(index, itme, $event)"
                @click.meta="ctrlClickEvent(index, itme, $event)"
                @click.shift="shiftClickEvent(index)">
                <ul style="display: flex;">
                    <li class="liHead li">
                        <img style="right: auto;left: 8px;"
                             :src="require('@a/images/usermanagement/usermanagement-user-icon.svg')" />
                        <span style="margin-left: 28px"
                              :title="itme.BELONGING_NAME === '(所属なし)' ? $t('UserManagementU.BELONGING_NAME2') : itme.BELONGING_NAME">
                            {{ itme.BELONGING_NAME === '(所属なし)' ? $t('UserManagementU.BELONGING_NAME2') : itme.BELONGING_NAME }}
                        </span>
                    </li>
                    <li class="liHead wo li">
                        <span :title="itme.GROUP_USER_NAME">{{ itme.GROUP_USER_NAME }}</span>
                        <!-- <img :src="require('@a/images/usermanagement/usermanagement-group-information.svg')"
                             style="left: auto;"> -->
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>

<script>
import $ from 'jquery'

export default {
    name: 'User',
    props: {
        userData: {
            type: Array,
            default: () => {
                return []
            }
        },
        checked: {
            type: Boolean,
            default: true
        }
    },
    data () {
        return {
            data: [],
            row: {index: 0}
        }
    },
    methods: {
        // click
        clickEvent (index, item) {
            this.user()
            this.row = JSON.parse(JSON.stringify(item))
            this.row.index = index
            this.data.push(item)
            $(`.user${index}`).addClass('userl')
            this.$emit('LiClickEvent', this.objunique(this.data))
        },
        // ctrl + click
        ctrlClickEvent (index, item, event) {
            if (
                event.currentTarget.classList.length >= 2 &&
                event.currentTarget.className.indexOf('userl') !== -1
            ) {
                $(`.user${index}`).removeClass('userl')
                const data = this.data.filter(d => { return item !== d })
                this.data = data
            } else {
                this.row = JSON.parse(JSON.stringify(item))
                this.row.index = index
                this.data.push(item)
                $(`.user${index}`).addClass('userl')
            }
            this.$emit('LiClickEvent', this.objunique(this.data))
        },
        // shift + click
        shiftClickEvent (index) {
            console.log(this.row)
            this.user()
            const userData = this.userData
            if (index < this.row.index) {
                for (let i = index; i <= this.row.index; i++) {
                    $(`.user${i}`).addClass('userl')
                    this.data.push(userData[i])
                }
            } else if (index > this.row.index) {
                for (let i = index; i >= this.row.index; i--) {
                    $(`.user${i}`).addClass('userl')
                    this.data.push(userData[i])
                }
            } else {
                $(`.user${index}`).addClass('userl')
                this.data.push(userData[index])
                return
            }
            console.log(this.data)
            this.$emit('LiClickEvent', this.objunique(this.data))
        },
        user () {
            this.data = []
            $('.userl').removeClass('userl')
        },
        // 对象数组去重
        objunique (songs) {
            const result = {}
            let item = []
            const finalResult = []
            for (let i = 0; i < songs.length; i++) {
                // 因为songs[i].USER_NO不能重复,达到去重效果,且这里必须知晓"name"或是其他键名
                result[songs[i].ID] = songs[i]
                item.push(songs[i].ID)
            }
            item = unique(item)
            for (let index = 0; index < item.length; index++) {
                finalResult.push(result[item[index]])
            }
            // 现在result内部都是不重复的对象了，只需要将其键值取出来转为数组即可
            // eslint-disable-next-line no-undef
            return finalResult

            // 数组去重
            function unique (arr) {
                return arr.filter(function (item, index, arr) {
                    // 当前元素，在原始数组中的第一个索引==当前索引值，否则返回当前元素
                    return arr.indexOf(item, 0) === index
                })
            }
        }
    }
}
</script>

<style lang="less" scoped>
@import url("../../../../../less/pages/UserManagement/PermissionManagement/tabsView/components/User.less");
</style>
