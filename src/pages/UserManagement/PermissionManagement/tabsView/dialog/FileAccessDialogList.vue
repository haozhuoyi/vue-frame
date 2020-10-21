<template>
    <div id="listtabledialog">
        <ul class="ulBody"
            onselectstart="return false;">
            <ul>
                <li class="liHead mc border">
                    {{ $t('fileAccessDialogList.DISPLAY_ACCESS_AUTH_DG_AUTH_ROW_TITLE_NAME') }}
                </li>
                <li class="liHead wo border">
                    {{ $t('fileAccessDialogList.DISPLAY_ACCESS_AUTH_DG_AUTH_ROW_TITLE_FILE') }}
                </li>
                <li class="liHead wt border">
                    {{ $t('fileAccessDialogList.DISPLAY_ACCESS_AUTH_DG_AUTH_ROW_TITLE_FOLDER') }}
                </li>
                <li class="liHead wtr border">
                    {{ $t('fileAccessDialogList.DISPLAY_ACCESS_AUTH_DG_AUTH_ROW_TITLE_NOTE') }}
                </li>
                <li class="liHead wf border">
                    {{ $t('fileAccessDialogList.DISPLAY_ACCESS_AUTH_DG_AUTH_ROW_TITLE_REMARKS') }}
                </li>
            </ul>
            <li v-for="(itme,index) in fileTreeTableData.AUTH_LIST"
                :key="index"
                :class="`list${index}`"
                @click.exact="clickEvent(index, itme)"
                @click.ctrl="ctrlClickEvent(index, itme, $event)"
                @click.meta="ctrlClickEvent(index, itme, $event)"
                @click.shift="shiftClickEvent(index)"
                :style="itme.STATUS==='delete'?'display:none;':(itme.STATUS==='update'?'background-color: #ffdbbf':'')">
                <ul>
                    <li class="liHead li">
                        <img v-if="itme.DERIVATION === 'USER'"
                             style="right: auto;left: 8px; cursor: default"
                             :src="require('@a/images/usermanagement/usermanagement-user-icon.svg')" />
                        <span v-else
                              class="backgroundColor"
                              :style="{backgroundColor: itme.COLOR}"></span>
                        <span style="margin-left: 28px"
                              :title="itme.GROUP_USER_NAME">{{ itme.GROUP_USER_NAME }}</span>
                        <ImgButton v-if="itme.DERIVATION === 'GROUP'"
                                   class="imgButton"
                                   :src="require('@a/images/usermanagement/usermanagement-group-information.svg')"
                                   :no="itme.GROUP_USER_NO || itme.GROUP_NO"
                                   :name="itme.GROUP_USER_NAME || itme.GROUP_NAME"
                                   :color="itme.GROUP_COLOR || itme.COLOR"
                                   @edit="userConfirmationWithinTheGroup"></ImgButton>
                    </li>
                    <li class="liHead wo li"
                        @click.prevent.stop="accessChangeEvent(itme.FILE_AUTH_FLG, 'FILE_AUTH_FLG', itme)">
                        <div v-if="itme.READ_AUTH_FLG === 'FALSE'">
                            <img :src="require('@a/images/usermanagement/usermanagement-default.svg')" />
                        </div>
                        <div v-else>
                            <img v-if="itme.FILE_AUTH_FLG === 'TRUE'"
                                 :src="require('@a/images/usermanagement/usermanagement-yes.svg')" />
                            <img v-else-if="itme.FILE_AUTH_FLG === 'FALSE'"
                                 :src="require('@a/images/usermanagement/usermanagement-no.svg')" />
                            <img v-else
                                 :src="require('@a/images/usermanagement/usermanagement-default.svg')" />
                        </div>
                    </li>
                    <li class="liHead wt li"
                        @click.prevent.stop="accessChangeEvent(itme.DIR_AUTH_FLG, 'DIR_AUTH_FLG', itme)">
                        <div v-if="itme.READ_AUTH_FLG === 'FALSE'">
                            <img :src="require('@a/images/usermanagement/usermanagement-default.svg')" />
                        </div>
                        <div v-else>
                            <img v-if="itme.DIR_AUTH_FLG === 'TRUE'"
                                 :src="require('@a/images/usermanagement/usermanagement-yes.svg')" />
                            <img v-else-if="itme.DIR_AUTH_FLG === 'FALSE'"
                                 :src="require('@a/images/usermanagement/usermanagement-no.svg')" />
                            <img v-else
                                 :src="require('@a/images/usermanagement/usermanagement-default.svg')" />
                        </div>
                    </li>
                    <li class="liHead wtr li"
                        @click.prevent.stop="accessChangeEvent(itme.MEMO_AUTH_FLG, 'MEMO_AUTH_FLG', itme)">
                        <div v-if="itme.READ_AUTH_FLG === 'FALSE'">
                            <img :src="require('@a/images/usermanagement/usermanagement-default.svg')" />
                        </div>
                        <div v-else>
                            <img v-if="itme.MEMO_AUTH_FLG === 'TRUE'"
                                 :src="require('@a/images/usermanagement/usermanagement-yes.svg')" />
                            <img v-else-if="itme.MEMO_AUTH_FLG === 'FALSE'"
                                 :src="require('@a/images/usermanagement/usermanagement-no.svg')" />
                            <img v-else
                                 :src="require('@a/images/usermanagement/usermanagement-default.svg')" />
                        </div>
                    </li>
                    <li class="liHead wf li">
                        <div v-if="itme.DERIVATION !== 'USER'"
                             style="padding: 0 30px 0 0;">
                            <div v-if="itme.EX_FLG === 'TRUE' && itme.PROHIBIT_PRIORITY_FLG === 'FALSE'"
                                 style="padding: 10.5px 0;">
                                <p style="color: #4146CD;">{{ $t('fileAccessDialogList.DISPLAY_ACCESS_AUTH_GROUP_MEMBER_AUTH_INDIVIDUAL_SETTING') }}</p>
                            </div>
                            <div v-if="itme.EX_FLG === 'FALSE' && itme.PROHIBIT_PRIORITY_FLG === 'TRUE'"
                                 style="padding: 10.5px 0;">
                                <p style="color: #D61918;">{{ $t('fileAccessDialogList.DISPLAY_ACCESS_AUTH_GROUP_MEMBER_AUTH_PROHIBITION_PRIORITY') }}</p>
                            </div>
                            <div v-if="itme.EX_FLG === 'TRUE' && itme.PROHIBIT_PRIORITY_FLG === 'TRUE'"
                                 style="padding-top: 4px;">
                                <p style="color: #4146CD;">{{ $t('fileAccessDialogList.DISPLAY_ACCESS_AUTH_GROUP_MEMBER_AUTH_INDIVIDUAL_SETTING') }}</p>
                                <p style="color: #D61918;line-height: 0.4;">{{ $t('fileAccessDialogList.DISPLAY_ACCESS_AUTH_GROUP_MEMBER_AUTH_PROHIBITION_PRIORITY') }}</p>
                            </div>
                        </div>
                        <div v-if="itme.DERIVATION !== 'USER'"
                             @click="individualSettings(itme)">
                            <img :src="require('@a/images/usermanagement/usermanagement-setting.svg')"
                                 style="left: auto;right: 5px;" />
                        </div>
                    </li>
                </ul>
            </li>
        </ul>
        <FileAccessGroupListDialog ref="FileAccessGroupListDialog"
                                   @thePermission="thePermission"
                                   @ModifyC="modify"></FileAccessGroupListDialog>
    </div>
</template>

<script>
import bus from '@c/bus.js'
import $ from 'jquery'
import {Debounce} from '@u/debounce.js'

export default {
    name: 'Listtabledialog',
    components: {
        FileAccessGroupListDialog: resolve =>
            require(['@p/UserManagement/PermissionManagement/tabsView/dialog/FileAccessGroupListDialog.vue'], resolve),
        ImgButton: resolve => require(['@c/ImgButton'], resolve)
    },
    props: {
        fileTableData: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    data () {
        return {
            data: [],
            row: {index: 0},
            fileTreeTableDataOriginal: [], // 原始数据
            fileTreeTableData: {},
            tfCategory: [
                {FILE_AUTH_FLG: 'FALSE', DIR_AUTH_FLG: 'TRUE', MEMO_AUTH_FLG: 'FALSE'},
                {FILE_AUTH_FLG: 'FALSE', DIR_AUTH_FLG: 'FALSE', MEMO_AUTH_FLG: 'TRUE'},
                {FILE_AUTH_FLG: 'FALSE', DIR_AUTH_FLG: 'TRUE', MEMO_AUTH_FLG: 'TRUE'},
                {FILE_AUTH_FLG: 'TRUE', DIR_AUTH_FLG: 'FALSE', MEMO_AUTH_FLG: 'TRUE'},
                {FILE_AUTH_FLG: 'TRUE', DIR_AUTH_FLG: 'TRUE', MEMO_AUTH_FLG: 'FALSE'},
                {FILE_AUTH_FLG: 'TRUE', DIR_AUTH_FLG: 'FALSE', MEMO_AUTH_FLG: 'FALSE'},
                {FILE_AUTH_FLG: 'FALSE', DIR_AUTH_FLG: 'FALSE', MEMO_AUTH_FLG: 'FALSE'},
                {FILE_AUTH_FLG: 'TRUE', DIR_AUTH_FLG: 'TRUE', MEMO_AUTH_FLG: 'TRUE'}
            ]
        }
    },
    watch: {
        'fileTableData.AUTH_LIST': {
            handler (newValue/* , oldValue */) {
                for (let index = 0; index < newValue.length; index++) {
                    this.fileTreeTableDataOriginal[newValue[index].ID] = JSON.parse(JSON.stringify(newValue[index]))
                }
                // this.fileTreeTableData.AUTH_LIST = newValue
                // console.log(this.fileTreeTableData.AUTH_LIST)
                this.fileTreeTableData = Object.assign({}, this.fileTreeTableData, this.fileTableData)
            },
            immediate: true
        }
    },
    methods: {
        // click
        clickEvent (index, item) {
            this.clearSelect()
            this.row = JSON.parse(JSON.stringify(item))
            this.row.index = index
            this.data.push(item)
            $(`.list${index}`).addClass('listl')
            this.$emit('LClickEvent', this.objunique(this.data))
        },
        // ctrl + click
        ctrlClickEvent (index, item, event) {
            if (
                event.currentTarget.classList.length >= 2 &&
                event.currentTarget.className.indexOf('listl') !== -1
            ) {
                $(`.list${index}`).removeClass('listl')
                const data = this.data.filter(d => { return item !== d })
                this.data = data
            } else {
                this.row = JSON.parse(JSON.stringify(item))
                this.row.index = index
                this.data.push(item)
                $(`.list${index}`).addClass('listl')
            }
            this.$emit('LClickEvent', this.objunique(this.data))
        },
        // shift + click
        shiftClickEvent (index) {
            console.log(this.row)
            this.clearSelect()
            const data = this.fileTreeTableData.AUTH_LIST
            if (index < this.row.index) {
                for (let i = index; i <= this.row.index; i++) {
                    $(`.list${i}`).addClass('listl')
                    this.data.push(data[i])
                }
            } else if (index > this.row.index) {
                for (let i = index; i >= this.row.index; i--) {
                    $(`.list${i}`).addClass('listl')
                    this.data.push(data[i])
                }
            } else {
                $(`.list${index}`).addClass('listl')
                this.data.push(data[index])
                return
            }
            console.log(this.data)
            this.$emit('LClickEvent', this.objunique(this.data))
        },
        clearSelect () {
            this.data = []
            $('.listl').removeClass('listl')
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
        // 修改组内人员权限
        individualSettings (itme) {
            this.$emit('removeEvent')
            this.$refs.FileAccessGroupListDialog.groupAccessDialogShowEvent(itme)
        },
        // 获取所有的组内人员
        getMemberArray (groupMember) {
            if (groupMember.children) {
                return groupMember.children
            } else {
                return []
            }
        },
        // 权限修改逻辑
        getMatchAuthArray (memberAuthInfoNo) {
            const authArray = []

            const readAuthArray = []
            const fileAuthArray = []
            const dirAuthArray = []
            const memoAuthArray = []
            const groupArray = this.fileTreeTableData.AUTH_LIST
            if (groupArray) {
                // 各グループ情報を取得
                groupArray.forEach(element => {
                    if (element.DERIVATION === 'GROUP') {
                        const memberArray = this.getMemberArray(element)
                        if (memberArray) {
                            // グループメンバ情報を取得
                            memberArray.forEach(member => {
                                // グループに存在していた場合
                                if (memberAuthInfoNo === member.USER_NO) {
                                    // 権限を保持
                                    readAuthArray.push(member['READ_AUTH_FLG'])
                                    fileAuthArray.push(member['FILE_AUTH_FLG'])
                                    dirAuthArray.push(member['DIR_AUTH_FLG'])
                                    memoAuthArray.push(member['MEMO_AUTH_FLG'])
                                }
                            })
                        }
                    }
                })
            }
            // 重複していない場合
            if (readAuthArray.length === 1) {
                return null
            }

            authArray['READ_AUTH_FLG'] = 'TRUE'
            authArray['FILE_AUTH_FLG'] = 'TRUE'
            authArray['DIR_AUTH_FLG'] = 'TRUE'
            authArray['MEMO_AUTH_FLG'] = 'TRUE'
            readAuthArray.forEach(element => {
                if (element === 'FALSE') {
                    authArray['READ_AUTH_FLG'] = 'FALSE'
                }
            })
            fileAuthArray.forEach(element => {
                if (element === 'FALSE') {
                    authArray['FILE_AUTH_FLG'] = 'FALSE'
                }
            })
            dirAuthArray.forEach(element => {
                if (element === 'FALSE') {
                    authArray['DIR_AUTH_FLG'] = 'FALSE'
                }
            })
            memoAuthArray.forEach(element => {
                if (element === 'FALSE') {
                    authArray['MEMO_AUTH_FLG'] = 'FALSE'
                }
            })

            return authArray

        },

        // 新增(标记)
        getArrSame (arr1, arr2) {
            return arr1.concat(arr2).filter(function (v, i, arr) {
                return arr.indexOf(v) !== arr.lastIndexOf(v)
            })
        },
        // 新增(标记)

        accessChangeEvent: Debounce(function (flg, flgname, itme) {
            if (flg === 'TRUE') {
                itme[flgname] = 'FALSE'
            } else if (flg === 'FALSE') {
                itme[flgname] = 'TRUE'
            }
            if (itme.children) {
                itme.children.forEach(element => {
                    if (element.EX_FLG === 'FALSE') {
                        element.READ_AUTH_FLG = itme.READ_AUTH_FLG
                        element.FILE_AUTH_FLG = itme.FILE_AUTH_FLG
                        element.DIR_AUTH_FLG = itme.DIR_AUTH_FLG
                        element.MEMO_AUTH_FLG = itme.MEMO_AUTH_FLG
                        element.ChildrenUpDataFLG = true
                    }
                })
                itme.ChildrenUpDataFLG = true

                const countAuthMap = {}
                const itmeUL = (itme.USERLIST.replace(/\[/g, '').replace(/\]/g, '')).split(',').map(Number)
                let userList = ''
                let multipledArray = {}

                // 新增(标记)
                const record = []
                this.fileTreeTableData.AUTH_LIST.forEach((item) => {
                    if (item.DERIVATION === 'GROUP') {
                        const groupId = {}
                        const userList = []
                        item.children.forEach((item1) => {
                            userList.push(item1.USER_NO)
                        })
                        groupId[item.ID] = userList
                        record.push(groupId)
                    }
                })
                const userListChange = []
                itme.children.forEach((item) => {
                    userListChange.push(item.USER_NO)
                })
                for (let i = 0; i <= record.length - 1; i++) {
                    if (itme.ID !== Object.keys(record[i])[0]) {
                        const repeatUserNo = this.getArrSame(userListChange, record[i][Object.keys(record[i])[0]])
                        if (repeatUserNo.length > 0) {
                            const compare = this.fileTreeTableData.AUTH_LIST.filter((item) => item.ID === Object.keys(record[i])[0])

                            // 有不同权限就显示禁止优先
                            if (itme.FILE_AUTH_FLG === compare[0].FILE_AUTH_FLG && itme.DIR_AUTH_FLG === compare[0].DIR_AUTH_FLG && itme.MEMO_AUTH_FLG === compare[0].MEMO_AUTH_FLG) {
                                itme.PROHIBIT_PRIORITY_FLG = 'FALSE'
                                itme.children.forEach((item) => {
                                    if (repeatUserNo.indexOf(item.USER_NO) !== -1) {
                                        item.PROHIBIT_PRIORITY_FLG = 'FALSE'
                                    }
                                })
                                compare[0].PROHIBIT_PRIORITY_FLG = 'FALSE'
                                compare[0].children.forEach((item) => {
                                    if (repeatUserNo.indexOf(item.USER_NO) !== -1) {
                                        item.PROHIBIT_PRIORITY_FLG = 'FALSE'
                                    }
                                })
                            }
                            // 记录不同的权限
                            let oneDifference = 0
                            let defferentAuth = ''

                            if (itme.FILE_AUTH_FLG !== compare[0].FILE_AUTH_FLG) {
                                oneDifference += 1
                                defferentAuth += 'FILE_AUTH_FLG'
                                if (itme.FILE_AUTH_FLG === 'TRUE') {
                                    itme.PROHIBIT_PRIORITY_FLG = 'TRUE'
                                    itme.children.forEach((item) => {
                                        if (repeatUserNo.indexOf(item.USER_NO) !== -1) {
                                            item.PROHIBIT_PRIORITY_FLG = 'TRUE'
                                        }
                                    })
                                } else {
                                    compare[0].PROHIBIT_PRIORITY_FLG = 'TRUE'
                                    compare[0].children.forEach((item) => {
                                        if (repeatUserNo.indexOf(item.USER_NO) !== -1) {
                                            item.PROHIBIT_PRIORITY_FLG = 'TRUE'
                                        }
                                    })
                                }
                            }
                            if (itme.DIR_AUTH_FLG !== compare[0].DIR_AUTH_FLG) {
                                oneDifference += 1
                                defferentAuth += 'DIR_AUTH_FLG'
                                if (itme.DIR_AUTH_FLG === 'TRUE') {
                                    itme.PROHIBIT_PRIORITY_FLG = 'TRUE'
                                    itme.children.forEach((item) => {
                                        if (repeatUserNo.indexOf(item.USER_NO) !== -1) {
                                            item.PROHIBIT_PRIORITY_FLG = 'TRUE'
                                        }
                                    })
                                } else {
                                    compare[0].PROHIBIT_PRIORITY_FLG = 'TRUE'
                                    compare[0].children.forEach((item) => {
                                        if (repeatUserNo.indexOf(item.USER_NO) !== -1) {
                                            item.PROHIBIT_PRIORITY_FLG = 'TRUE'
                                        }
                                    })
                                }
                            }
                            if (itme.MEMO_AUTH_FLG !== compare[0].MEMO_AUTH_FLG) {
                                oneDifference += 1
                                defferentAuth += 'MEMO_AUTH_FLG'
                                if (itme.MEMO_AUTH_FLG === 'TRUE') {
                                    itme.PROHIBIT_PRIORITY_FLG = 'TRUE'
                                    itme.children.forEach((item) => {
                                        if (repeatUserNo.indexOf(item.USER_NO) !== -1) {
                                            item.PROHIBIT_PRIORITY_FLG = 'TRUE'
                                        }
                                    })
                                } else {
                                    compare[0].PROHIBIT_PRIORITY_FLG = 'TRUE'
                                    compare[0].children.forEach((item) => {
                                        if (repeatUserNo.indexOf(item.USER_NO) !== -1) {
                                            item.PROHIBIT_PRIORITY_FLG = 'TRUE'
                                        }
                                    })
                                }
                            }

                            if (itme.FILE_AUTH_FLG === 'TRUE' && itme.DIR_AUTH_FLG === 'TRUE' && itme.MEMO_AUTH_FLG === 'TRUE') {
                                compare[0].PROHIBIT_PRIORITY_FLG = 'FALSE'
                                compare[0].children.forEach((item) => {
                                    if (repeatUserNo.indexOf(item.USER_NO) !== -1) {
                                        item.PROHIBIT_PRIORITY_FLG = 'FALSE'
                                    }
                                })
                            } else if (compare[0].FILE_AUTH_FLG === 'TRUE' && compare[0].DIR_AUTH_FLG === 'TRUE' && compare[0].MEMO_AUTH_FLG === 'TRUE') {
                                itme.PROHIBIT_PRIORITY_FLG = 'FALSE'
                                itme.children.forEach((item) => {
                                    if (repeatUserNo.indexOf(item.USER_NO) !== -1) {
                                        item.PROHIBIT_PRIORITY_FLG = 'FALSE'
                                    }
                                })
                            }

                            if (oneDifference === 1) {
                                if (itme[defferentAuth] === 'TRUE') {
                                    itme.PROHIBIT_PRIORITY_FLG = 'TRUE'
                                    itme.children.forEach((item) => {
                                        if (repeatUserNo.indexOf(item.USER_NO) !== -1) {
                                            item[defferentAuth] = 'TRUE'
                                        }
                                    })
                                    compare[0].PROHIBIT_PRIORITY_FLG = 'FALSE'
                                    compare[0].children.forEach((item) => {
                                        if (repeatUserNo.indexOf(item.USER_NO) !== -1) {
                                            item.PROHIBIT_PRIORITY_FLG = 'FALSE'
                                        }
                                    })
                                } else {
                                    itme.PROHIBIT_PRIORITY_FLG = 'FALSE'
                                    itme.children.forEach((item) => {
                                        if (repeatUserNo.indexOf(item.USER_NO) !== -1) {
                                            item[defferentAuth] = 'FALSE'
                                        }
                                    })
                                    compare[0].PROHIBIT_PRIORITY_FLG = 'TRUE'
                                    compare[0].children.forEach((item) => {
                                        if (repeatUserNo.indexOf(item.USER_NO) !== -1) {
                                            item.PROHIBIT_PRIORITY_FLG = 'TRUE'
                                        }
                                    })
                                }
                            }


                        }
                    }
                }
                // 新增(标记)

                for (let i1 = this.fileTreeTableData.AUTH_LIST.length - 1; i1 >= 0; i1--) {
                    if (this.fileTreeTableData.AUTH_LIST[i1].DERIVATION !== 'GROUP') {
                        break
                    }
                    for (let i = this.fileTreeTableData.USER_LIST.length - 1; i >= 0; i--) {
                        multipledArray = this.getMatchAuthArray(this.fileTreeTableData.USER_LIST[i])
                        if (multipledArray) {
                        // 重複していても同じ権限の場合は重複でないとみなす
                            let multiflg = false
                            if (
                                multipledArray.READ_AUTH_FLG !== this.fileTreeTableData.AUTH_LIST[i1].READ_AUTH_FLG
                            ) {
                                multiflg = true
                            } else if (
                                multipledArray.FILE_AUTH_FLG !== this.fileTreeTableData.AUTH_LIST[i1].FILE_AUTH_FLG
                            ) {
                                multiflg = true
                            } else if (
                                multipledArray.DIR_AUTH_FLG !== this.fileTreeTableData.AUTH_LIST[i1].DIR_AUTH_FLG
                            ) {
                                multiflg = true
                            } else if (
                                multipledArray.MEMO_AUTH_FLG !== this.fileTreeTableData.AUTH_LIST[i1].MEMO_AUTH_FLG
                            ) {
                                multiflg = true
                            }
                            if (multiflg) {
                                countAuthMap[this.fileTreeTableData.AUTH_LIST[i1].GROUP_USER_NO] = true
                                this.fileTreeTableData.AUTH_LIST[i1].PROHIBIT_PRIORITY_FLG = 'TRUE'
                                const ul = this.fileTreeTableData.AUTH_LIST[i1].USERLIST
                                userList = (userList + ',' + ul)
                            }
                        }
                    }
                }
                if (userList.substr(0, 1) === ',') {
                    userList = userList.substr(1)
                }
                userList = unique((userList.replace(/\[/g, '').replace(/\]/g, '').replace(/,$/gi, '')).split(',').map(Number))
                // console.log(userList, itmeUL)
                // console.log(countAuthMap)

                // 交集
                const intersection = []
                for (let i = 0, len = itmeUL.length; i < len; i++) {
                    for (let j = 0, length = userList.length; j < length; j++) {
                        if (itmeUL[i] === userList[j]) {
                            intersection.push(itmeUL[i])
                        }
                    }
                }
                console.log('交集', intersection)
                for (let i2 = this.fileTreeTableData.AUTH_LIST.length - 1; i2 >= 0; i2--) {
                    if (this.fileTreeTableData.AUTH_LIST[i2].ID !== itme.ID) {
                    // 组内人员
                        const memberArray = this.getMemberArray(this.fileTreeTableData.AUTH_LIST[i2])
                        memberArray.forEach(data => {
                            if (intersection.indexOf(data.USER_NO) !== -1) {
                                data.READ_AUTH_FLG = multipledArray.READ_AUTH_FLG
                                data.FILE_AUTH_FLG = multipledArray.FILE_AUTH_FLG
                                data.DIR_AUTH_FLG = multipledArray.DIR_AUTH_FLG
                                data.MEMO_AUTH_FLG = multipledArray.MEMO_AUTH_FLG
                                data.PROHIBIT_PRIORITY_FLG = 'TRUE'
                            }
                        })
                    }
                }
            }
            this.fileTreeTableData = Object.assign({}, this.fileTreeTableData, this.fileTreeTableData)
            if (
                this.fileTreeTableDataOriginal[itme.ID].READ_AUTH_FLG === itme.READ_AUTH_FLG &&
                this.fileTreeTableDataOriginal[itme.ID].FILE_AUTH_FLG === itme.FILE_AUTH_FLG &&
                this.fileTreeTableDataOriginal[itme.ID].DIR_AUTH_FLG === itme.DIR_AUTH_FLG &&
                this.fileTreeTableDataOriginal[itme.ID].MEMO_AUTH_FLG === itme.MEMO_AUTH_FLG
            ) {
                itme.STATUS = 'initial'
                itme.READ_AUTH_FLG = this.fileTreeTableDataOriginal[itme.ID].READ_AUTH_FLG
            } else {
                itme.STATUS = 'update'
                itme.READ_AUTH_FLG = 'TRUE'
            }
            this.fileTreeTableData = Object.assign({}, this.fileTreeTableData, this.fileTreeTableData)

            function unique (arr) {
                return arr.filter(function (item, index, arr) {
                    // 当前元素，在原始数组中的第一个索引==当前索引值，否则返回当前元素
                    return arr.indexOf(item, 0) === index
                })
            }
        }, 250),
        categorComparison (FILE_AUTH_FLG, DIR_AUTH_FLG, MEMO_AUTH_FLG) {
            let index = null
            for (let i = this.tfCategory.length - 1; i >= 0; i--) {
                if (
                    this.tfCategory[i].FILE_AUTH_FLG === FILE_AUTH_FLG &&
                    this.tfCategory[i].DIR_AUTH_FLG === DIR_AUTH_FLG &&
                    this.tfCategory[i].MEMO_AUTH_FLG === MEMO_AUTH_FLG
                ) {
                    index = i
                    break
                }
            }
            return index
        },
        thePermission (data) {
            this.$emit('addEvent')
            for (let i = 0; i < this.fileTreeTableData.AUTH_LIST.length; i++) {
                if (data.ID === this.fileTreeTableData.AUTH_LIST[i].ID) {
                    this.fileTreeTableData.AUTH_LIST.splice(i, 1, data)
                }
            }
            for (let i = data.children.length - 1; i >= 0; i--) {
                this.modify(data.children[i], data.ID)
            }
        },
        modify (row, ID) {
            for (let i = this.fileTreeTableData.AUTH_LIST.length - 1; i >= 0; i--) {
                if (!this.fileTreeTableData.AUTH_LIST[i].children) {
                    continue
                }
                for (let j = this.fileTreeTableData.AUTH_LIST[i].children.length - 1; j >= 0; j--) {
                    if (
                        row.USER_NO === this.fileTreeTableData.AUTH_LIST[i].children[j].USER_NO &&
                        ID !== this.fileTreeTableData.AUTH_LIST[i].ID
                        // && row.EX_FLG === 'TRUE'
                    ) {
                        this.fileTreeTableData.AUTH_LIST[i].EX_FLG = row.EX_FLG
                        this.fileTreeTableData.AUTH_LIST[i].PROHIBIT_PRIORITY_FLG = 'TRUE'
                        this.fileTreeTableData.AUTH_LIST[i].children.splice(j, 1, {
                            ChildrenUpDataFLG: false,
                            DIR_AUTH_FLG: row.DIR_AUTH_FLG,
                            EX_FLG: 'FALSE',
                            FILE_AUTH_FLG: row.FILE_AUTH_FLG,
                            MEMO_AUTH_FLG: row.MEMO_AUTH_FLG,
                            PROHIBIT_PRIORITY_FLG: 'TRUE',
                            READ_AUTH_FLG: row.READ_AUTH_FLG,
                            STATUS: row.STATUS,
                            UPD_TIME: row.UPD_TIME,
                            USER_NAME: row.USER_NAME,
                            USER_NO: row.USER_NO
                        })

                        // 新增(标记)
                        // 有不同权限就显示禁止优先
                        const changeAuthData = this.fileTreeTableData.AUTH_LIST.filter((item) => item.ID === ID)
                        if (changeAuthData[0].FILE_AUTH_FLG === this.fileTreeTableData.AUTH_LIST[i].FILE_AUTH_FLG && changeAuthData[0].DIR_AUTH_FLG === this.fileTreeTableData.AUTH_LIST[i].DIR_AUTH_FLG && changeAuthData[0].DIR_AUTH_FLG === this.fileTreeTableData.AUTH_LIST[i].DIR_AUTH_FLG) {
                            changeAuthData[0].PROHIBIT_PRIORITY_FLG = 'FALSE'
                            row.PROHIBIT_PRIORITY_FLG = 'FALSE'
                            this.fileTreeTableData.AUTH_LIST[i].PROHIBIT_PRIORITY_FLG = 'FALSE'
                            this.fileTreeTableData.AUTH_LIST[i].children[j].PROHIBIT_PRIORITY_FLG = 'FALSE'
                        }
                        if (changeAuthData[0].FILE_AUTH_FLG !== this.fileTreeTableData.AUTH_LIST[i].FILE_AUTH_FLG) {
                            if (changeAuthData[0].FILE_AUTH_FLG === 'TRUE') {
                                changeAuthData[0].PROHIBIT_PRIORITY_FLG = 'TRUE'
                                row.PROHIBIT_PRIORITY_FLG = 'TRUE'
                            } else {
                                this.fileTreeTableData.AUTH_LIST[i].PROHIBIT_PRIORITY_FLG = 'TRUE'
                                this.fileTreeTableData.AUTH_LIST[i].children[j].PROHIBIT_PRIORITY_FLG = 'TRUE'
                            }
                        }
                        if (changeAuthData[0].DIR_AUTH_FLG !== this.fileTreeTableData.AUTH_LIST[i].DIR_AUTH_FLG) {
                            if (changeAuthData[0].DIR_AUTH_FLG === 'TRUE') {
                                changeAuthData[0].PROHIBIT_PRIORITY_FLG = 'TRUE'
                                row.PROHIBIT_PRIORITY_FLG = 'TRUE'
                            } else {
                                this.fileTreeTableData.AUTH_LIST[i].PROHIBIT_PRIORITY_FLG = 'TRUE'
                                this.fileTreeTableData.AUTH_LIST[i].children[j].PROHIBIT_PRIORITY_FLG = 'TRUE'
                            }
                        }
                        if (changeAuthData[0].MEMO_AUTH_FLG !== this.fileTreeTableData.AUTH_LIST[i].MEMO_AUTH_FLG) {
                            if (changeAuthData[0].MEMO_AUTH_FLG === 'TRUE') {
                                changeAuthData[0].PROHIBIT_PRIORITY_FLG = 'TRUE'
                                row.PROHIBIT_PRIORITY_FLG = 'TRUE'
                            } else {
                                this.fileTreeTableData.AUTH_LIST[i].PROHIBIT_PRIORITY_FLG = 'TRUE'
                                this.fileTreeTableData.AUTH_LIST[i].children[j].PROHIBIT_PRIORITY_FLG = 'TRUE'
                            }
                        }

                    }
                }
            }
        },
        // 清空选择
        fileAccessDialogList () {
            this.indexshift = []
            this.indexctrl = []
            this.data = []
            $('.listl').removeClass('listl')
        },
        // 组详情
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
@import url("../../../../../less/pages/UserManagement/PermissionManagement/tabsView/dialog/FileAccessDialogList.less");
</style>
