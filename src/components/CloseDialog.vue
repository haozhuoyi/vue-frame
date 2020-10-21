<template>
    <div>
        <el-dialog :visible.sync="closeDialogVisible"
                   :title="$t('closeDialog.MESSAGE_CLOSEDIALOG_TITLE')"
                   :close-on-click-modal="false"
                   :before-close="cancelClose"
                   :destroy-on-close="true"
                   append-to-body>
            <div v-if="content.length>0"
                 v-html="content">{{ content }}</div>
            <div v-else>{{ content }}</div>
            <span slot="footer"
                  class="dialog-footer">
                <button class="button"
                        @click="cancelClose">{{ $t('closeDialog.DISPLAY_NO') }}</button>
                <button class="button buttonDelete margin"
                        @click="close">{{ $t('closeDialog.DISPLAY_YES') }}</button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    props: {
        content: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            closeDialogVisible: false
        }
    },
    methods: {
        show (bool) {
            this.closeDialogVisible = bool
        },
        // close
        cancelClose () {
            this.closeDialogVisible = false
            this.$emit('cancelClose', false)
        },
        close () {
            this.closeDialogVisible = false
            this.$emit('close')
        }
    }
}
</script>
