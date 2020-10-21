<template>
    <div id="group">
        <ul>
            <li class="liHead border">{{ $t('tabGroup.DISPLAY_GROUP_DG_GROUP_ROW_TITLE_GROUP_NAME') }}</li>
        </ul>
        <ul class="ulBody"
            onselectstart="return false;">
            <li v-for="(itme, index) in groupsData"
                :key="index"
                :class="`group${index}`"
                @click.exact="clickEvent(index, itme)"
                @click.ctrl="ctrlClickEvent(index, itme, $event)"
                @click.meta="ctrlClickEvent(index, itme, $event)"
                @click.shift="shiftClickEvent(index)">
                <ul style="display: flex;">
                    <li class="liHead li">
                        <span class="backgroundColor"
                              :style="{backgroundColor: itme.GROUP_COLOR || itme.COLOR}">
                        </span>
                        <span style="margin-left: 38px;"
                              :title="itme.GROUP_USER_NAME || itme.GROUP_NAME">
                            {{ itme.GROUP_USER_NAME || itme.GROUP_NAME }}
                        </span>
                        <ImgButton class="imgButton"
                                   :src="require('@a/images/usermanagement/usermanagement-group-information.svg')"
                                   :no="itme.GROUP_USER_NO || itme.GROUP_NO"
                                   :name="itme.GROUP_USER_NAME || itme.GROUP_NAME"
                                   :color="itme.GROUP_COLOR || itme.COLOR"
                                   @edit="userConfirmationWithinTheGroup"></ImgButton>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>

<script>
import bus from '@c/bus.js'
import $ from 'jquery'

export default {
    name: 'Group',
    components: {ImgButton: resolve => require(['@c/ImgButton'], resolve)},
    props: {
        groupsData: {
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
            this.group()
            this.row = JSON.parse(JSON.stringify(item))
            this.row.index = index
            this.data.push(item)
            $(`.group${index}`).addClass('groupl')
            this.$emit('LgClickEvent', this.objunique(this.data))
        },
        // ctrl + click
        ctrlClickEvent (index, item, event) {
            if (
                event.currentTarget.classList.length >= 2 &&
                event.currentTarget.className.indexOf('groupl') !== -1
            ) {
                $(`.group${index}`).removeClass('groupl')
                const data = this.data.filter(d => { return item !== d })
                this.data = data
            } else {
                this.row = JSON.parse(JSON.stringify(item))
                this.row.index = index
                this.data.push(item)
                $(`.group${index}`).addClass('groupl')
            }
            this.$emit('LgClickEvent', this.objunique(this.data))
        },
        // shift + click
        shiftClickEvent (index) {
            console.log(this.row)
            this.group()
            const groupsData = this.groupsData
            if (index < this.row.index) {
                for (let i = index; i <= this.row.index; i++) {
                    $(`.group${i}`).addClass('groupl')
                    this.data.push(groupsData[i])
                }
            } else if (index > this.row.index) {
                for (let i = index; i >= this.row.index; i--) {
                    $(`.group${i}`).addClass('groupl')
                    this.data.push(groupsData[i])
                }
            } else {
                $(`.group${index}`).addClass('groupl')
                this.data.push(groupsData[index])
                return
            }
            console.log(this.data)
            this.$emit('LgClickEvent', this.objunique(this.data))
        },
        group () {
            this.data = []
            $('.groupl').removeClass('groupl')
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
        },
        userConfirmationWithinTheGroup (NO, NAME, COLOR) {
            bus.$emit('UserConfirmationWithinTheGroup', {
                NO,
                GroupName: NAME,
                Color: COLOR
            })
        }
    }
}
</script>

<style lang="less" scoped>
@import url("../../../../../less/pages/UserManagement/PermissionManagement/tabsView/components/Group.less");
</style>
