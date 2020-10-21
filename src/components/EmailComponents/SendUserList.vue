<template>
    <div id="sendUserList">
        <ul>
            <li class="liHead name border"></li>
            <li class="liHead name border"
                style="border-bottom: 1px solid #999999;">{{ $t('sendUserList.DISPLAY_FILE_INFO_SEND_MAIL_DG_USER_ROW_TITLE_BELONGING_NAME') }}</li>
            <li class="liHead name border">{{ $t('sendUserList.DISPLAY_FILE_INFO_SEND_MAIL_DG_USER_ROW_TITLE_USER_NAME') }}</li>
        </ul>
        <ul class="ulBody"
            onselectstart="return false;">
            <li v-for="(item,index) in sendUserListData"
                :key="index"
                :class="`sendUser${index}`"
                @click.ctrl="ctrlClickEvent(index, item, $event)"
                @click.meta="ctrlClickEvent(index, item, $event)"
                @click.shift="shiftClickEvent(index, item)"
                @click.exact="clickEvent(index, item)">
                <ul style="display: flex;">
                    <li class="liHead li">
                        <div class="select">
                            <el-select v-model="item.TYPE">
                                <el-option v-for="select in typeOptions"
                                           :key="select.value"
                                           :label="select.label"
                                           :value="select.value">
                                </el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="liHead li">
                        <img style="right: auto;left: 8px;"
                             :src="require('@a/images/usermanagement/usermanagement-user-icon.svg')" />
                        <span style="margin-left: 29px;"
                              :title="item.BELONGING_NAME === '(所属なし)' ? $t('UserManagementU.BELONGING_NAME2') : item.BELONGING_NAME">
                            {{ item.BELONGING_NAME === '(所属なし)' ? $t('UserManagementU.BELONGING_NAME2') : item.BELONGING_NAME }}
                        </span>
                    </li>
                    <li class="liHead name li">
                        <span style="position: absolute;left: 8px;top: 1px;"
                              :title="item.NAME">{{ item.NAME }}</span>
                        <span style="position: absolute;left: 8px;top: 17px;"
                              :title="item.MAILADDRESS">{{ item.MAILADDRESS }}</span>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>

<script>
import $ from 'jquery'

export default {
    name: 'SendUserList',
    props: {
        sendUserListData: {
            type: Array,
            default: () => {
                return []
            }
        },
        checked: {
            type: Boolean,
            default: true
        },
        type: {
            type: String,
            default: 'To'
        }
    },
    data () {
        return {
            indexshift: [],
            indexctrl: [],
            data: [],
            isCtrl: false,
            isShift: false,
            row: {index: 0},
            typeOptions: [
                {
                    value: 'To',
                    label: 'To'
                },
                {
                    value: 'Cc',
                    label: 'Cc'
                },
                {
                    value: 'Bcc',
                    label: 'Bcc'
                }
            ]
        }
    },
    methods: {
        // 選択リストデータ
        ctrlClickEvent (index, item, event) {
            if (this.checked) {
                if (
                    event.currentTarget.classList.length >= 2 &&
                    event.currentTarget.className.indexOf('sendUserL') !== -1
                ) {
                    $(`.sendUser${index}`).removeClass('sendUserL')
                    const data = this.data.filter(d => { return item !== d })
                    this.data = data
                } else {
                    this.row = JSON.parse(JSON.stringify(item))
                    this.row.index = index
                    this.data.push(item)
                    $(`.sendUser${index}`).addClass('sendUserL')
                }
                console.log(this.data)
                this.$emit('SendLiClickEvent', this.data)
            }
        },
        shiftClickEvent (index) {
            if (this.checked) {
                console.log(this.row)
                this.sendUser()
                const sendUserListData = this.sendUserListData
                if (index < this.row.index) {
                    for (let i = index; i <= this.row.index; i++) {
                        $(`.sendUser${i}`).addClass('sendUserL')
                        this.data.push(sendUserListData[i])
                    }
                } else if (index > this.row.index) {
                    for (let i = index; i >= this.row.index; i--) {
                        $(`.sendUser${i}`).addClass('sendUserL')
                        this.data.push(sendUserListData[i])
                    }
                } else {
                    $(`.sendUser${index}`).addClass('sendUserL')
                    this.data.push(sendUserListData[index])
                    return
                }
                console.log(this.data)
                this.$emit('SendLiClickEvent', this.data)
            }
        },
        clickEvent (index, item) {
            this.sendUser()
            this.row = JSON.parse(JSON.stringify(item))
            this.row.index = index
            this.data.push(item)
            $(`.sendUser${index}`).addClass('sendUserL')
            this.$emit('SendLiClickEvent', this.data)
        },
        sendUser () {
            this.indexshift = []
            this.indexctrl = []
            this.data = []
            $('.sendUserL').removeClass('sendUserL')
        }
    }
}
</script>

<style lang="less" scoped>
@import url("../../less/components/EmailComponents/SendUserList.less");
</style>
