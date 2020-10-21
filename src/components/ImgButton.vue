<template>
    <img class="imgButton"
         :src="src"
         @click.prevent.stop="edit(no,name, color)">
</template>

<script>
export default {
    props: {
        src: {
            type: String,
            default: ''
        },
        no: {
            type: [String, Number],
            default: ''
        },
        name: {
            type: String,
            default: ''
        },
        color: {
            type: String,
            default: ''
        }
    },
    methods: {
        edit (no, name, color) {
            this.$emit('edit', no, name, color)
        }
    }
}
</script>

<style lang="less" scoped>
@import url("../less/components/ImgButton.less");
</style>
