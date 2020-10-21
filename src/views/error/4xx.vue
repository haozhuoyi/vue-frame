<template>
    <div>
        <div class="error">
            <div class="error-log">
                <img :src="require('@a/images/login-left-logo.svg')">
            </div>
            <p class="error-title">{{ $route.query.status }} リクエストエラー</p>
            <p class="error-body">
                リクエストが受け付けられませんでした
            </p>
            <button class="button buttonHighlight"
                    @click="LOOKTG">戻る</button>

            <div class="Illustrations-space">
                挿絵スペース
            </div>
        </div>
    </div>
</template>

<script>
export default {
    methods: {
        LOOKTG () {
            const redirect = this.$route.query.redirect ? this.$route.query.redirect : '/'
            this.$router.push(`${redirect}`)
        }
    }
}
</script>

<style lang="less" scoped>
@import url("../../less/views/error/4xx.less");
</style>
