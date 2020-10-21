<template>
    <div id="dustbinHeader">
        <section style="height: 72px;">
            <headButtons :dat="dat"
                         @handleCommand="handleCommand"></headButtons>
        </section>
    </div>
</template>

<script>
import headButtons from '@c/HeadButton.vue'

export default {
    name: 'DustbinHeader',
    components: {
        headButtons
    },
    props: {
    },
    data () {
        return {
            dat: [
                {
                    name: 'dustbinHeader.DISPLAY_FILE_INFO_TRASH_ALL_DATA_DELETE',
                    image: require('@a/images/file/file-dustbin-01.svg')
                },
                {
                    name: 'dustbinHeader.DISPLAY_FILE_INFO_TRASH_ALL_DATA_RESTORE',
                    image: require('@a/images/file/file-recover.svg')
                }
            ]
        }
    },
    methods: {
        // 按钮点击
        handleCommand (command) {
            this.$emit('handleCommand', command)
        }
    }
}
</script>

<style lang="less" scoped>
@import url("../../../less/pages/Files/Dustbin/DustbinHeader.less");
</style>
