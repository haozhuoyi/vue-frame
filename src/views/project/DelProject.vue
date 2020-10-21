<template>
    <div>
        <el-dialog :visible.sync="delProjectDialogVisible"
                   :title="$t('delProject.DISPLAY_PROJECT_ADD_DEL_POPUP_TITLE_PROJECT_DEL_CONFIRM')"
                   :close-on-click-modal="false"
                   :before-close="applyToFoldersBelowClose"
                   :destroy-on-close="true"
                   append-to-body
                   class="deleteProject">
            <!-- 以下のプロジェクトを削除します<br />よろしいですか？<br /><br /> -->
            {{ $t('delProject.MESSAGE_ASK_PROJECT_ADD_DEL_PROJECT_DELETE') }}
            <br /><br />
            {{ item.projectName }}
            <span slot="footer"
                  class="dialog-footer">
                <button class="button buttonDelete"
                        @click="del(item)">{{ $t('delProject.DISPLAY_PROJECT_ADD_DEL_TOOLTIP_PROJECT_DELETE_BUTTON') }}</button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'DelProject',
    data () {
        return {
            delProjectDialogVisible: false,
            item: {}
        }
    },
    methods: {
        delProject (item) {
            this.item = item
            this.delProjectDialogVisible = true
        },
        applyToFoldersBelowClose () {
            this.delProjectDialogVisible = false
        },
        del (deleteproject) {
            this.$emit('deleteproject', deleteproject)
            this.applyToFoldersBelowClose()
        }
    }
}
</script>

<style lang="less">
@import url("../../less/views/project/DelProject.less");
</style>
