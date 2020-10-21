<template>
    <div id="allFilesHeader">
        <headButtonO :dat="dat"
                     :length="length"
                     @handleCommand="handleCommand"></headButtonO>
        <div class="fileSearchArea">
            <headButtonT :class="['closeSearchResults', activeTabpanelName !== 'sousuo'? 'opacity' : '']"
                         :dat="datT"
                         @handleCommand="handleCommand"></headButtonT>
            <el-input size="small"
                      @input="e => input = validForbid(e)"
                      v-model="input"
                      :placeholder="$t('allFilesHeader.DISPLAY_FILE_INFO_SEARCH')"
                      :style="$i18n.locale === 'en' ? 'width: 150px' : ''"
                      @keyup.enter.native="getFile">
                <img slot="prefix"
                     :src="inputicon">
            </el-input>
            <button :style="{visibility: addVisible ? 'hidden':'visible'}"
                    class="button buttonSearchOption"
                    @click="detailedSearch">
                {{ $t('allFilesHeader.DISPLAY_FILE_INFO_DETAILED_SEARCH') }}
                <img :src="upwardpull">
            </button>
        </div>
    </div>
</template>

<script>
// import bus from '@c/bus.js'
import store from '@p/Files/store'
import Crypto from '@u/crypto'
import headButtonO from '@c/HeadButton.vue'
import headButtonT from '@c/HeadButton.vue'

export default {
    name: 'AllFielsHead',
    components: {
        headButtonO,
        headButtonT
    },
    props: {
        addVisible: {
            type: Boolean,
            default: false
        },
        activeTabpanelName: {
            type: String,
            default: 'treetable'
        },
        length: {
            type: Number,
            default: 0
        }
    },
    data () {
        return {
            dat: [
                {
                    name: 'allFilesHeader.DISPLAY_FILE_INFO_TREE_RIGHT_CLICK_MENU_UPLOAD', // 'アップ\nロード',
                    image: require('@a/images/file/file-upload.svg'),
                    children: [
                        {
                            name: 'allFilesHeader.DISPLAY_FILE_INFO_TREE_RIGHT_CLICK_MENU_UPLOAD_FILE' // 'ファイルをアップロード' // 上传文件
                        },
                        {
                            name: 'allFilesHeader.DISPLAY_FILE_INFO_TREE_RIGHT_CLICK_MENU_UPLOAD_FOLDER' // 'フォルダをアップロード' // 上传文件夹
                        }
                    ]
                },
                {
                    name: 'allFilesHeader.DISPLAY_FILE_INFO_TREE_RIGHT_CLICK_MENU_NEW_FOLDER', // 'フォルダ\n作成',
                    image: require('@a/images/file/file-addfolder.svg')
                },
                {
                    name: 'allFilesHeader.DISPLAY_FILE_INFO_DG_FILE_RIGHT_CLICK_MENU_DOWNLOAD', // 'ダウン\nロード',
                    image: require('@a/images/file/file-updown.svg')
                },
                {
                    name: 'allFilesHeader.DISPLAY_FILE_INFO_TREE_RIGHT_CLICK_MENU_SEND_MAIL', // '通知',
                    image: require('@a/images/file/file-notice.svg')
                },
                {
                    name: 'allFilesHeader.DISPLAY_FILE_INFO_FILE_VIEWER_PICTURE_EDIT_BLACKBOARD_EDIT_REGIST_FAVORITE', // 'お気に入り',
                    image: require('@a/images/file/file-collect.svg')
                },
                {
                    name: 'allFilesHeader.DISPLAY_FILE_INFO_TREE_RIGHT_CLICK_MENU_MOVE_COPY', // '移動/コピー',
                    image: require('@a/images/file/file-move-copy.svg')
                },
                {
                    name: 'allFilesHeader.DISPLAY_FILE_INFO_TREE_RIGHT_CLICK_MENU_DELETE', // 'ゴミ箱へ',
                    image: require('@a/images/file/file-dustbin.svg')
                },
                {
                    name: 'allFilesHeader.DISPLAY_FILE_INFO_DG_FILE_RIGHT_CLICK_MENU_MAKE_SNAP_SHOT', // 'スナップ\nショット',
                    image: require('@a/images/file/file-snapshoot.svg')
                },
                {
                    name: 'allFilesHeader.DISPLAY_FILE_INFO_DG_FILE_RIGHT_CLICK_CONTEXT_MENU_QR_GROUP', // 'QR',
                    image: require('@a/images/file/file-qr-04-01.svg'),
                    children: [
                        {
                            name: 'allFilesHeader.DISPLAY_FILE_INFO_DG_FILE_RIGHT_CLICK_MENU_MAKE_QR_PDF' // 'QR付きPDFの作成'
                        },
                        {
                            name: 'allFilesHeader.DISPLAY_FILE_INFO_DG_FILE_RIGHT_CLICK_MENU_DOWNLOAD_QR_PDF' // 'QR付きPDFのダウンロード'
                        },
                        {
                            name: 'allFilesHeader.DISPLAY_FILE_INFO_DG_FILE_RIGHT_CLICK_MENU_DISABLEQR' // 'QR付きPDFの無効化'
                        }
                    ]
                }
            ],
            datT: [
                {
                    name: 'allFilesHeader.DISPLAY_FILE_INFO_DG_FILE_RIGHT_CLICK_MENU_SEARCH_RESULT_CLOSE', // '検索結果\nを閉じる',
                    image: require('@a/images/file/file-close-search-results.svg')
                }
            ],
            input: '', // 检索字段
            inputicon: require('@a/images/file/file-input-select1.svg'), // 搜索框
            upwardpull: require('@a/images/file/file-pull-down.svg') // 上拉
        }
    },
    methods: {
        // 切换视图
        viewtypeEvent (bool = false) {
            this.$emit('viewtypeEvent', Crypto.decrypt(store.state.viewtype), bool)
        },
        // 按钮点击
        handleCommand (command) {
            if (command === this.$t('allFilesHeader.DISPLAY_FILE_INFO_DG_FILE_RIGHT_CLICK_MENU_SEARCH_RESULT_CLOSE')) {
                this.viewtypeEvent(this.addVisible)
            } else {
                this.$emit('handleCommand', command)
            }
        },
        // 详情搜索
        detailedSearch () {
            this.$emit('DetailedSearch')
        },
        // 条件检索
        getFile () {
            let input = this.input
            if (/[{}\\"]/gm.test(input)) {
                input = this.$request.replaceMethod(this.input)
                console.log(input)
            }
            this.$emit('getFile', input)
        }
    }
}
</script>

<style lang="less" scoped>
@import url("../../../less/pages/Files/AllFiles/AllFilesHeader.less");
</style>
