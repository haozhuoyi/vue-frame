<template>
    <div id="listtable">
        <ul>
            <li class="liHead border">{{ $t('listTableU.DISPLAY_ACCESS_AUTH_DG_AUTH_ROW_TITLE_NAME') }}</li>
            <li class="liHead wo border">{{ $t('listTableU.DISPLAY_ACCESS_AUTH_DG_AUTH_ROW_TITLE_FILE') }}</li>
            <li class="liHead wt border">{{ $t('listTableU.DISPLAY_ACCESS_AUTH_DG_AUTH_ROW_TITLE_FOLDER') }}</li>
            <li class="liHead wtr border">{{ $t('listTableU.DISPLAY_ACCESS_AUTH_DG_AUTH_ROW_TITLE_NOTE') }}</li>
            <li class="liHead wf border">{{ $t('listTableU.DISPLAY_ACCESS_AUTH_DG_AUTH_ROW_TITLE_REMARKS') }}</li>
        </ul>
        <ul class="ulBody">
            <li v-for="(itme,index) in fileTreeTableData.AUTH_LIST"
                :key="index"
                :style="{width: offsetWidth}"
                :class="index == 0 ? 'topSpacing' : ''"
                tabindex="1">
                <ul>
                    <li class="liHead li">
                        <img v-if="itme.DERIVATION === 'USER'"
                             style="right: auto;left: 8px;"
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
                    <li class="liHead wo li">
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
                    <li class="liHead wt li">
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
                    <li class="liHead wtr li">
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
                        <div v-if="itme.DERIVATION !== 'USER'">
                            <div v-if="itme.EX_FLG === 'TRUE' && itme.PROHIBIT_PRIORITY_FLG === 'FALSE'"
                                 style="padding: 10.5px 0;">
                                <p style="color: #4146CD;">
                                    {{ $t('listTableU.DISPLAY_ACCESS_AUTH_GROUP_MEMBER_AUTH_INDIVIDUAL_SETTING') }}
                                </p>
                            </div>
                            <div v-if="itme.EX_FLG === 'FALSE' && itme.PROHIBIT_PRIORITY_FLG === 'TRUE'"
                                 style="padding: 10.5px 0;">
                                <p style="color: #D61918;">
                                    {{ $t('listTableU.DISPLAY_ACCESS_AUTH_GROUP_MEMBER_AUTH_PROHIBITION_PRIORITY') }}
                                </p>
                            </div>
                            <div v-if="itme.EX_FLG === 'TRUE' && itme.PROHIBIT_PRIORITY_FLG === 'TRUE'">
                                <p style="color: #4146CD;">
                                    {{ $t('listTableU.DISPLAY_ACCESS_AUTH_GROUP_MEMBER_AUTH_INDIVIDUAL_SETTING') }}
                                </p>
                                <p style="color: #D61918;line-height: 0.4;">
                                    {{ $t('listTableU.DISPLAY_ACCESS_AUTH_GROUP_MEMBER_AUTH_PROHIBITION_PRIORITY') }}
                                </p>
                            </div>
                        </div>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>

<script>
import bus from '@c/bus.js'

export default {
    name: 'Listtable',
    components: {ImgButton: resolve => require(['@c/ImgButton'], resolve)},
    props: {
        fileTreeTableData: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    data () {
        return {
            offsetWidth: ''
        }
    },
    mounted () {
        const that = this
        const elementResizeDetectorMaker = require('element-resize-detector')// 导入
        // 创建实例
        const erd = elementResizeDetectorMaker()
        that.$nextTick(() => {
            erd.listenTo(document.getElementById('listtable'), function (element) {
                that.offsetWidth = element.offsetWidth + 'px'
            })
        })
    },
    methods: {
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
@import url("../../../../../less/pages/UserManagement/PermissionManagement/tabsView/file/ListTable.less");
</style>
