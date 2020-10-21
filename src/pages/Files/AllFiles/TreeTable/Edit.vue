<template>
    <div id="edit">
        <el-dialog :visible.sync="editDialogVisible"
                   :title="$t(title)"
                   :close-on-click-modal="false"
                   :before-close="close"
                   class="editdialog">
            <div>
                <div class="bodyTitle">{{ $t('edit.DISPLAY_FILE_INFO_NAME_TIP') }}</div>
                <div class="bodySubject">
                    <span>{{ $t(inputName) + '：' }}</span>
                    <input ref="input"
                           class="folderName"
                           v-change
                           v-model="fileName"
                           :style="{width: offsetWidth}">
                </div>
            </div>
            <div slot="footer">
                <button class="button buttonHighlight alter"
                        @click="inputValueEvent">
                    {{ fileNameOriginal ? $t('edit.DISPLAY_FILE_INFO_BUTTON_CHANGE') : $t('edit.DISPLAY_FILE_INFO_BUTTON_ADD') }}
                </button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'Edit',
    data () {
        return {
            editDialogVisible: false,
            title: '',
            type: 'DIR',
            inputName: 'edit.DISPLAY_FILE_INFO_INPUT_TITLE',
            offsetWidth: '305px',
            fileNameOriginal: '',
            fileName: '',
            no: ''
        }
    },
    methods: {
        // 浏览器刷新事件
        beforeunloadHandlerEdit (e) {
            const beforeunload =
                this.title === 'フォルダ作成' ? Boolean(this.fileName) : this.fileNameOriginal !== this.fileName
            console.log(`Files-->${this.title === 'フォルダ作成' ? 'フォルダ作成' : 'フォルダ编辑'}`, beforeunload)
            if (beforeunload) {
                e = e || window.event
                if (e) {
                    e.returnValue = '关闭提示'
                }
                return beforeunload
            }
            return
        },
        // show
        editDialog (item) {
            this.editDialogVisible = item.editDialog
            this.title = item.title
            this.type = item.TYPE || 'DIR'
            this.no = item.no
            if (this.title === 'フォルダ作成') {
                this.fileName = ''
                this.title = 'edit.DISPLAY_FILE_INFO_NAME_TITLE'
            } else {
                if (item.TYPE && item.TYPE !== 'DIR') {
                    this.fileName = item.FILE_NAME.slice(0, item.FILE_NAME.lastIndexOf('.'))
                } else if (item.TYPE && item.TYPE === 'DIR') {
                    this.fileName = item.FILE_NAME
                }
            }
            setTimeout(() => {
                this.$refs.input.focus()
                this.$refs.input.value = ''
                this.$refs.input.value = this.fileName
            }, 200)
            this.fileNameOriginal = this.fileName
            // 添加监听浏览器刷新事件
            window.addEventListener('beforeunload', this.beforeunloadHandlerEdit, false)
        },
        inputValueEvent () {
            let fileName = this.fileName
            if (/[{}\\"]/gm.test(fileName)) {
                fileName = this.fileName.replace(/\\/g, '\\\\').replace(/'/g, '\'')
                    .replace(/"/g, '\\"').replace(/{/g, '\{').replace(/}/g, '\}')
                console.log(fileName)
            }
            this.$emit('inputValueEvent', {title: this.title, value: fileName, type: this.type, no: this.no})
            // this.close()
        },
        close () {
            this.editDialogVisible = false
            window.removeEventListener('beforeunload', this.beforeunloadHandlerEdit, false)
        }
    }
}
</script>

<style lang="less" scoped>
@import url("../../../../less/pages/Files/AllFiles/TreeTable/Edit.less");
</style>
