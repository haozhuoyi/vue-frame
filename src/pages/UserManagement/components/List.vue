<template>
    <div class="list">
        <v-contextmenu ref="vueContextmenu"
                       class="vueContextmenu"
                       auto-placement
                       theme="default">
            <v-contextmenu-item :disabled="delDisabled"
                                @click="contextmenuEvent">{{ $t('common.DELETE') }}</v-contextmenu-item>
            <v-contextmenu-item :disabled="disabled"
                                @click="contextmenuEvent">{{ name }}</v-contextmenu-item>
        </v-contextmenu>
        <ul class="sequenceTable">
            <li class=""
                v-for="(item, index) in templatelist"
                :key="index"
                :class="['sequence', `sequence${index}`]"
                @contextmenu.prevent="contextmenu(index, item, $event)"
                @click.ctrl="ctrlClickEvent(index, item, $event)"
                @click.meta="ctrlClickEvent(index, item, $event)"
                @click.shift="shiftClickEvent(index, item)"
                @click.exact="selection(index, item)"
                onselectstart="return false;">
                <p :title="item.GROUP_NAME"
                   :style="!show?'padding-left: 8px;': 'width: calc(100% - 75px);'">
                    <span v-if="show"
                          :style="{backgroundColor: item.GROUP_COLOR}"
                          class="backgroundColor"></span>
                    {{ item.i18nName ? $t(item.i18nName) : item.GROUP_NAME || item.BELONGING_NAME }}
                </p>
                <ImgButton class="imgButton"
                           :no="item.GROUP_NO || item.NO"
                           :name="item.GROUP_NAME || item.BELONGING_NAME"
                           :color="item.GROUP_COLOR || ''"
                           :src="require('@a/images/table/file-rename-02.svg')"
                           :style="item.BELONGING_NAME==='(所属なし)'||item.BELONGING_NAME==='全て'?'display: none;':''"
                           @edit="$emit('edit',
                                        item.GROUP_NO || item.NO,
                                        item.GROUP_NAME || item.BELONGING_NAME,
                                        item.GROUP_COLOR || '')"></ImgButton>
            </li>
        </ul>
    </div>
</template>

<script>
import $ from 'jquery'

export default {
    components: {ImgButton: resolve => require(['@c/ImgButton'], resolve)},
    props: {
        templatelist: {
            type: Array,
            default: []
        },
        name: {
            type: String,
            default: ''
        },
        show: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            rowIndex: 0,
            delDisabled: false,
            disabled: false,
            selectedData: [],
            contextmenuData: {}
        }
    },
    watch: {
        templatelist: {
            handler (newVale) {
                if (newVale.length === 0) return
                for (let index = 0; index < newVale.length; index++) {
                    if (newVale[index].BELONGING_NAME === '全て') {
                        newVale[index].i18nName = 'UserManagementU.BELONGING_NAME1'
                    } else if (newVale[index].BELONGING_NAME === '(所属なし)') {
                        newVale[index].i18nName = 'UserManagementU.BELONGING_NAME2'
                    }
                }
            },
            deep: true
        },
        selectedData (newVale) {
            this.disabled = newVale.length > 1
            this.$emit('selectedDataEvent', newVale)
        }
    },
    methods: {
        ctrlClickEvent (index, item, event) {
            if (
                event.currentTarget.classList.length >= 2 &&
                event.currentTarget.className.indexOf('selected') !== -1
            ) {
                $(`.sequence${index}`).removeClass('selected')
                const selectedData = this.selectedData.filter(d => { return item !== d })
                this.selectedData = selectedData
            } else {
                this.rowIndex = index
                this.selectedData.push(item)
                $(`.sequence${index}`).addClass('selected')
            }
        },
        shiftClickEvent (index) {
            this.clearSelect()
            if (index < this.rowIndex) {
                for (let i = index; i <= this.rowIndex; i++) {
                    $(`.sequence${i}`).addClass('selected')
                    this.selectedData.push(this.templatelist[i])
                }
            } else if (index > this.rowIndex) {
                for (let i = index; i >= this.rowIndex; i--) {
                    $(`.sequence${i}`).addClass('selected')
                    this.selectedData.push(this.templatelist[i])
                }
            } else {
                $(`.sequence${index}`).addClass('selected')
                this.selectedData.push(this.templatelist[index])
                return
            }
        },
        /* 单选 */
        selection (index, item) {
            this.clearSelect()
            this.rowIndex = index
            this.selectedData.push(item)
            $(`.sequence${index}`).addClass('selected')
            this.$emit('selection', item)
        },
        /* contextmenu */
        contextmenu (index, item, event) {
            this.$emit('hideContextmenu')
            if (
                this.$store.state.userInfo.isAdmin || this.$store.state.userInfo.authorityName === 'プロジェクト管理者'
            ) {
                if (this.selectedData.length <= 1) {
                    this.contextmenuData = item
                    this.disabled = this.contextmenuData.BELONGING_NAME === '全て' ||
                                            this.contextmenuData.BELONGING_NAME === '(所属なし)'
                    this.delDisabled = this.contextmenuData.BELONGING_NAME === '全て' ||
                                            this.contextmenuData.BELONGING_NAME === '(所属なし)'
                } else {
                    this.disabled = true
                    for (let index = 0; index < this.selectedData.length; index++) {
                        if (
                            this.selectedData[index].BELONGING_NAME === '全て' ||
                            this.selectedData[index].BELONGING_NAME === '(所属なし)'
                        ) {
                            this.delDisabled = true
                            break
                        } else {
                            this.delDisabled = false
                        }
                    }
                }
                let x = event.pageX
                let y = event.pageY
                if (document.body.clientHeight - y <= 122) {
                    y = document.body.clientHeight - 122
                }
                if (document.body.clientWidth - x <= 102) {
                    x = document.body.clientWidth - 102
                }
                const postition = {
                    top: y,
                    left: x
                }
                this.$refs.vueContextmenu.show(postition)
            }
        },
        hideContextmenu () {
            this.$refs.vueContextmenu.hide()
        },
        /* メニュー右クリックイベント(右键菜单点击事件) */
        contextmenuEvent (vm) {
            const name = vm.$slots.default[0].text
            if (name === this.$t('common.DELETE')) {
                if (this.selectedData.length > 1) {
                    this.$emit('handleCommand', this.show ? this.$t('groupManagement.DISPLAY_GROUP_DELETE_BUTTON') : this.$t('UserManagementU.BelongDelete'))
                } else {
                    this.$emit('deleteEvent', this.contextmenuData)
                }
            } else {
                this.$emit('edit',
                    this.contextmenuData.GROUP_NO || this.contextmenuData.NO,
                    this.contextmenuData.GROUP_NAME || this.contextmenuData.BELONGING_NAME,
                    this.contextmenuData.GROUP_COLOR || ''
                )
            }
        },
        clearSelect () {
            this.selectedData = []
            $('.selected').removeClass('selected')
        }
    }
}
</script>
<style lang="less">
@import url("../../../less/pages/UserManagement/components/List.less");
</style>
