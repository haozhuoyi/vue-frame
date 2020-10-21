<template>
    <div>
        <el-dialog :visible.sync="ErrorVisible"
                   title="エラー"
                   :close-on-click-modal="false"
                   :before-close="applyToFoldersBelowClose"
                   :destroy-on-close="true"
                   append-to-body
                   class="error">
            <div v-html="texts">{{ texts }}</div>
        </el-dialog>
    </div>
</template>

<script>
import bus from '@c/bus'

export default {
    name: 'ErrorVisible',
    data () {
        return {
            ErrorVisible: false,
            texts: ''
        }
    },
    mounted () {
        bus.$on('errorDialog', data => {
            this.ErrorVisible = true
            this.texts = data
        })
    },
    methods: {
        applyToFoldersBelowClose () {
            this.ErrorVisible = false
        }
    }
}
</script>

<style lang="less" scoped>
@import url("../../less/views/error/500.less");
</style>
