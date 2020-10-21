<template>
    <div class="Chx-test" :style="{backgroundColor: bgColor}"></div>
</template>
 
<script>
    export default {
        name: 'ChxTest',
        props: {
            bgColor: {
                type: String,
                default: "#ccc"
            }
        }
    }
</script>

<style lang="less" scoped>
@import './test.less';
</style>