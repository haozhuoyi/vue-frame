<template>
    <div id="BookmarksHoader">
        <section style="height: 72px;">
            <headButtons :dat="dat"
                         @handleCommand="handleCommand"></headButtons>
            <div class="input">
                <el-input placeholder="検索"
                          size="small"
                          v-model="input2"
                          @input="e => input2 = validForbid(e)"
                          @keyup.enter.native="getFile">
                    <img slot="prefix"
                         :src="inputicon">
                </el-input>
                <button v-if="!addVisible"
                        class="bottonAdd"
                        @click="DetailedSearch">
                    <p>詳細検索
                        <img :src="upwardpull">
                    </p>
                </button>
            </div>
        </section>
        <!-- QR作成 -->
        <PDFCreating ref="PDFCreating"></PDFCreating>
    </div>
</template>

<script>
// import bus from '@c/bus.js'
import headButtons from '@c/HeadButton.vue'
import PDFCreating from '@c/HeadComponents/PDFCreating.vue'

export default {
    name: 'BookmarksHoader',
    components: {
        headButtons,
        PDFCreating
    },
    props: {
        addVisible: {
            type: Boolean,
            default: false
        },
        addVisibleTwo: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            dat: [
                {
                    name: 'アップ\nロード',
                    image: require('@a/images/file/file-upload.svg')
                },
                {
                    name: 'フォルダ\n作成',
                    image: require('@a/images/file/file-addfolder.svg')
                },
                {
                    name: 'ダウン\nロード',
                    image: require('@a/images/file/file-updown.svg')
                },
                {
                    name: '通知',
                    image: require('@a/images/file/file-notice.svg')
                },
                {
                    name: 'お気に入り',
                    image: require('@a/images/file/file-collect.svg')
                },
                {
                    name: '移動/コピー',
                    image: require('@a/images/file/file-move-copy.svg')
                },
                {
                    name: 'ゴミ箱へ',
                    image: require('@a/images/file/file-dustbin.svg')
                },
                {
                    name: 'スナップ\nショット',
                    image: require('@a/images/file/file-snapshoot.svg')
                },
                {
                    name: 'QR',
                    image: require('@a/images/file/file-qr-04-01.svg'),
                    children: [
                        {
                            name: 'QR付きPDFの作成'
                        },
                        {
                            name: 'QR付きPDFのダウンロード'
                        },
                        {
                            name: 'QR付きPDFの無効化'
                        }
                    ]
                },
                {
                    name: 'その他の\n操作',
                    image: require('@a/images/file/file-other.svg')
                }
            ],
            inputicon: require('@a/images/file/file-input-select.svg'), // 搜索框
            upwardpull: require('@a/images/file/file-upward-pull.svg'), // 上拉
            input2: '', // 检索字段
            menuDatas: []
        }
    },
    methods: {
        // 按钮点击
        handleCommand (command) {
            if (command === 'QR') {
                // this.menuDatas = [1]
                if (this.menuDatas.length === 0) {
                    this.$message.warning('ファイルを選択してください')
                } else {
                    this.$refs.PDFCreating.pdfCreating(this.menuDatas)
                }
            }
            this.$emit('handleCommand', command)
        },
        // 详情搜索
        DetailedSearch () {
            this.$emit('DetailedSearch')
        },
        // 条件检索
        getFile () {
            this.$emit('getFile', this.input2)
        }
    }
}
</script>

<style lang="less" scoped>
@import url("../../../less/pages/Files/Bookmarks/BookmarksHeader.less");
</style>
