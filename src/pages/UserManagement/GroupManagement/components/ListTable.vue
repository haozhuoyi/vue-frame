<template>
    <div id="listTable"
         class="listTable stretchContent flexColumn">
        <ul class="ul th">
            <li style="margin-right: 4px;border-bottom: 1px solid #999999;">
                <span>{{ $t('groupUser.DISPLAY_GROUP_DG_MEMBER_ROW_TITLE_BELONGING_NAME') }}</span>
            </li>
            <li style="margin-left: 4px;border-bottom: 1px solid #999999;">
                <span>{{ $t('groupUser.DISPLAY_GROUP_DG_MEMBER_ROW_TITLE_USER_NAME') }}</span>
            </li>
        </ul>
        <div class="stretchContent listTableBody">
            <ul v-for="(item, index) in groupsUserData"
                :key="index"
                :class="`ul ul${className}${index}`"
                @click.ctrl="ctrlClickEvent(index, item, $event)"
                @click.meta="ctrlClickEvent(index, item, $event)"
                @click.shift="shiftClickEvent(index)"
                @click.exact="clickEvent(index, item)"
                onselectstart="return false;">
                <li class="liName">
                    <img v-if="className === 'checked'"
                         :src="require('@a/images/usermanagement/usermanagement-user-icon-green.svg')">
                    <img v-if="className === 'nochecked'"
                         :src="require('@a/images/usermanagement/usermanagement-user-icon-yellow.svg')">
                    <span :title="item.BELONGING_NAME === '(所属なし)' ? $t('UserManagementU.BELONGING_NAME2') : item.BELONGING_NAME"
                          style="width: calc(100% - 27px);margin-left: 20px;">
                        {{ item.BELONGING_NAME === '(所属なし)' ? $t('UserManagementU.BELONGING_NAME2') : item.BELONGING_NAME }}
                    </span>
                </li>
                <li class="liClass">
                    <span :title="item.USER_NAME">{{ item.USER_NAME }}</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import $ from 'jquery'

export default {
    name: 'ListTable',
    props: {
        groupsUserData: {
            type: Array,
            default: () => {
                return []
            }
        },
        department: {
            type: Object,
            default: () => {
                return {}
            }
        },
        className: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            row: {index: 0},
            checkedUserData: []
        }
    },
    mounted () {
        setTimeout(() => {
            console.log(this.groupsUserData)
        }, 1000)
    },
    methods: {
        ctrlClickEvent (index, item, event) {
            if (
                event.currentTarget.classList.length > 2 &&
                event.currentTarget.className.indexOf(this.className) !== -1
            ) {
                $(`.ul${this.className}${index}`).removeClass(this.className)
                const data = this.checkedUserData.filter(d => {
                    return item !== d
                })
                this.checkedUserData = data
            } else {
                this.checkedUserData.push(item)
                $(`.ul${this.className}${index}`).addClass(this.className)
            }
            console.log(this.checkedUserData)
            this.$emit('ClickEvent', this.checkedUserData)
        },
        shiftClickEvent (index) {
            console.log(this.row)
            this.clearSelect()
            if (index < this.row.index) {
                for (let i = index; i <= this.row.index; i++) {
                    $(`.ul${this.className}${i}`).addClass(this.className)
                    this.checkedUserData.push(this.groupsUserData[i])
                }
            } else if (index > this.row.index) {
                for (let i = index; i >= this.row.index; i--) {
                    $(`.ul${this.className}${i}`).addClass(this.className)
                    this.checkedUserData.push(this.groupsUserData[i])
                }
            } else {
                $(`.ul${this.className}${index}`).addClass(this.className)
                this.checkedUserData.push(this.groupsUserData[index])
                return
            }
            console.log(this.checkedUserData)
            this.$emit('ClickEvent', this.checkedUserData)
        },
        clickEvent (index, item) {
            this.clearSelect()
            this.row = JSON.parse(JSON.stringify(item))
            this.row.index = index
            this.checkedUserData.push(item)
            $(`.ul${this.className}${index}`).addClass(this.className)
            this.$emit('ClickEvent', this.checkedUserData)
        },
        clearSelect () {
            this.checkedUserData = []
            $(`#listTable .ul`).removeClass('checked')
            $(`#listTable .ul`).removeClass('nochecked')
            this.$emit('ClickEvent', this.checkedUserData)
        }
    }
}
</script>

<style lang="less" scoped>
@import url("../../../../less/pages/UserManagement/GroupManagement/components/ListTable.less");
</style>
