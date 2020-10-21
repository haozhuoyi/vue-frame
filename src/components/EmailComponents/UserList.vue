<template>
    <div id="userList">
        <ul>
            <li class="liHead border"
                style="border-bottom: 1px solid #999999;">{{ $t('userList.DISPLAY_FILE_INFO_SEND_MAIL_DG_USER_ROW_TITLE_BELONGING_NAME') }}</li>
            <li class="liHead name border">{{ $t('userList.DISPLAY_FILE_INFO_SEND_MAIL_DG_USER_ROW_TITLE_USER_NAME') }}</li>
        </ul>
        <ul class="ulBody"
            onselectstart="return false;">
            <li v-for="(itme,index) in userListData"
                :key="index"
                :class="`user${index}`"
                @click.ctrl="ctrlClickEvent(index, itme, $event)"
                @click.meta="ctrlClickEvent(index, itme, $event)"
                @click.shift="shiftClickEvent(index, itme)"
                @click.exact="clickEvent(index, itme)">
                <ul style="display: flex;">
                    <li class="liHead li">
                        <img style="right: auto;left: 22px;"
                             :src="require('@a/images/usermanagement/usermanagement-user-icon.svg')" />
                        <span style="margin-left: 29px;"
                              :title="itme.BELONGING_NAME === '(所属なし)' ? $t('UserManagementU.BELONGING_NAME2') : itme.BELONGING_NAME">
                            {{ itme.BELONGING_NAME === '(所属なし)' ? $t('UserManagementU.BELONGING_NAME2') : itme.BELONGING_NAME }}
                        </span>
                    </li>
                    <li class="liHead name li">
                        <span style="position: absolute;left: 10px;top: 1px;"
                              :title="itme.NAME">{{ itme.NAME }}</span>
                        <span style="position: absolute;left: 10px;top: 17px;"
                              :title="itme.MAILADDRESS">{{ itme.MAILADDRESS }}</span>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>

<script>
import $ from 'jquery'

export default {
    name: 'UserList',
    props: {
        userListData: {
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
            indexshift: [],
            data: [],
            row: {index: 0}
        }
    },
    methods: {
        // 選択リストデータ
        ctrlClickEvent (index, itme, event) {
            if (this.checked) {
                if (
                    event.currentTarget.classList.length >= 2 &&
                    event.currentTarget.className.indexOf('userL') !== -1
                ) {
                    $(`.user${index}`).removeClass('userL')
                    const data = this.data.filter(d => { return itme !== d })
                    this.data = data
                } else {
                    this.row = JSON.parse(JSON.stringify(itme))
                    this.row.index = index
                    this.data.push(itme)
                    $(`.user${index}`).addClass('userL')
                }
                console.log(this.data)
                this.$emit('LiClickEvent', this.data)
            }
        },
        shiftClickEvent (index) {
            console.log(this.row)
            this.user()
            const userListData = this.userListData
            if (index < this.row.index) {
                for (let i = index; i <= this.row.index; i++) {
                    $(`.user${i}`).addClass('userL')
                    this.data.push(userListData[i])
                }
            } else if (index > this.row.index) {
                for (let i = index; i >= this.row.index; i--) {
                    $(`.user${i}`).addClass('userL')
                    this.data.push(userListData[i])
                }
            } else {
                $(`.user${index}`).addClass('userL')
                this.data.push(userListData[index])
                return
            }
            this.$emit('LiClickEvent', this.data)
        },
        clickEvent (index, itme) {
            this.user()
            this.row = JSON.parse(JSON.stringify(itme))
            this.row.index = index
            this.data.push(itme)
            $(`.user${index}`).addClass('userL')
            this.$emit('LiClickEvent', this.data)
        },
        user () {
            this.indexshift = []
            this.data = []
            $('.userL').removeClass('userL')
        }
    }
}
</script>

<style lang="less" scoped>
@import url("../../less/components/EmailComponents/UserList.less");
</style>
