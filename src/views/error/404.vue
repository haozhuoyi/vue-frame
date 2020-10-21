<template>
    <div>
        <div class="error">
            <div class="error-log">
                <img :src="require('@a/images/login-left-logo.svg')">
            </div>
            <p class="error-title">404 ページが見つかりません</p>
            <p class="error-body">
                アクセス頂いたページは削除されたかURLが変更されています。
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
@import url("../../less/views/error/404.less");
</style>
