<template>
    <div id="CoverToConfirm">
        <el-dialog :visible.sync="coverToConfirmDialogVisible"
                   :title="$t('coverToConfirm.DISPLAY_OVERWRITE_POPUP_TITLE')"
                   :close-on-click-modal="false"
                   :before-close="coverToConfirmClose"
                   :destroy-on-close="true"
                   append-to-body
                   class="coverToConfirmdialog">
            <p>「{{ file.name }}」</p>
            <p>{{ $t('coverToConfirm.MASSAGE_ASK_OVERWIRTE') }}</p>
            <div class="body">
                <el-form label-position="right"
                         label-width="75px"
                         :model="formLabelAlign">
                    <el-form-item :label="$t('coverToConfirm.DISPLAY_FILE_INFO_FILE_VIEWER_FILES_COVER_MEMO')">
                        <div class="multipleChoice">
                            <div class="redio"
                                 :class="formLabelAlign.note === 1 ? 'active' : ''"
                                 @click="check(1, 'formLabelAlign.note')">
                                <p>{{ $t('coverToConfirm.DISPLAY_FILE_INFO_FILE_VIEWER_FILES_COVER_YES') }}</p>
                            </div>
                            <div class="redio"
                                 :class="formLabelAlign.note === 2 ? 'active' : ''"
                                 @click="check(2, 'formLabelAlign.note')">
                                <p>{{ $t('coverToConfirm.DISPLAY_FILE_INFO_FILE_VIEWER_FILES_COVER_NO') }}</p>
                            </div>
                        </div>
                        <span>{{ $t('coverToConfirm.DISPLAY_FILE_INFO_REPLACE_KEEP_MEMO') }}</span>
                    </el-form-item>
                    <el-form-item :label="$t('coverToConfirm.DISPLAY_FILE_INFO_PRINT_VIEWER_PIN_PIC_LAYOUT')">
                        <div class="multipleChoice">
                            <div class="redio"
                                 :class="formLabelAlign.photo === 1 ? 'active' : ''"
                                 @click="check(1, 'formLabelAlign.photo')">
                                <p>{{ $t('coverToConfirm.DISPLAY_FILE_INFO_FILE_VIEWER_FILES_COVER_YES') }}</p>
                            </div>
                            <div class="redio"
                                 :class="formLabelAlign.photo === 2 ? 'active' : ''"
                                 @click="check(2, 'formLabelAlign.photo')">
                                <p>{{ $t('coverToConfirm.DISPLAY_FILE_INFO_FILE_VIEWER_FILES_COVER_NO') }}</p>
                            </div>
                        </div>
                        <span>{{ $t('coverToConfirm.DISPLAY_FILE_INFO_REPLACE_KEEP_PICTURE') }}</span>
                    </el-form-item>
                    <el-form-item :label="$t('coverToConfirm.DISPLAY_FILE_INFO_REPLACE_KEEP_MEASURE_DATA')">
                        <div class="multipleChoice">
                            <div class="redio"
                                 :class="formLabelAlign.measureddata === 1 ? 'active' : ''"
                                 @click="check(1, 'formLabelAlign.measureddata')">
                                <p>{{ $t('coverToConfirm.DISPLAY_FILE_INFO_FILE_VIEWER_FILES_COVER_YES') }}</p>
                            </div>
                            <div class="redio"
                                 :class="formLabelAlign.measureddata === 2 ? 'active' : ''"
                                 @click="check(2, 'formLabelAlign.measureddata')">
                                <p>{{ $t('coverToConfirm.DISPLAY_FILE_INFO_FILE_VIEWER_FILES_COVER_NO') }}</p>
                            </div>
                        </div>
                    </el-form-item>
                </el-form>
                <span class="tip">{{ $t('coverToConfirm.MESSAGE_ASK_FILE_INFO_UPLOAD_OVERWRITE_ONE') }}</span>
                <span class="tip">{{ $t('coverToConfirm.MESSAGE_ASK_FILE_INFO_UPLOAD_OVERWRITE_TWO') }}</span>
                <span class="tip"> {{ $t('coverToConfirm.MESSAGE_ASK_FILE_INFO_UPLOAD_OVERWRITE_THREE') }}</span>
                <span class="tip">{{ $t('coverToConfirm.MESSAGE_ASK_FILE_INFO_UPLOAD_OVERWRITE_FOUR') }}</span>
            </div>
            <div class="bodyBrother">
                {{ $t('coverToConfirm.DISPLAY_FILE_INFO_REPLACE_KEEP_SETTING') }}
                <div class="multipleChoice"
                     :style="!webkitdirectory ? 'opacity: 30%;pointer-events: none;cursor: no-drop;' : ''">
                    <div class="redio"
                         :class="all === 1 ? 'active' : ''"
                         @click="check(1, 'all')">
                        <p>{{ $t('coverToConfirm.DISPLAY_FILE_INFO_FILE_VIEWER_FILES_COVER_YES') }}</p>
                    </div>
                    <div class="redio"
                         :class="all === 2 ? 'active' : ''"
                         @click="check(2, 'all')">
                        <p>{{ $t('coverToConfirm.DISPLAY_FILE_INFO_FILE_VIEWER_FILES_COVER_NO') }}</p>
                    </div>
                </div>
            </div>
            <span slot="footer"
                  class="dialog-footer">
                <button class="button buttonHighlight"
                        @click="save">{{ $t('coverToConfirm.DISPLAY_OVERWRITE_SAVE') }}</button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

export default {
    name: 'CoverToConfirm',
    data () {
        return {
            loading: false,
            coverToConfirmDialogVisible: false,
            webkitdirectory: false,
            file: {},
            formLabelAlign: {
                note: 1,
                photo: 1,
                measureddata: 1
            },
            all: 0, // 以降のファイルにも同じ条件を適用：
            misc: false
        }
    },
    methods: {
        coverToConfirmDialog (file, webkitdirectory, misc = false) {
            this.file = file
            this.misc = misc
            this.webkitdirectory = webkitdirectory
            this.coverToConfirmDialogVisible = true
        },
        check (num, dataName) {
            if (dataName.indexOf('.') !== -1) {
                const name = dataName.split('.')
                this[name[0]][name[1]] = num
                console.log(dataName, this.formLabelAlign)
            } else {
                this[dataName] = num
                console.log(dataName, this.all)
            }
        },
        coverToConfirmClose () {
            this.misc = false
            this.coverToConfirmDialogVisible = false
        },
        save () {
            if (this.misc) {
                this.$emit('uploadMisc', this.file, this.formLabelAlign, this.all)
            } else {
                this.$emit('upload', this.file, this.formLabelAlign, this.all)
            }
            this.coverToConfirmClose()
        }
    }
}
</script>

<style lang="less" scoped>
@import url("../../less/components/Uploader/CoverToConfirm.less");
</style>
