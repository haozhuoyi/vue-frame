<template>
    <div>
        <div class="error">
            <div class="error-log">
                <img :src="require('@a/images/login-left-logo.svg')">
            </div>
            <p class="error-title">401 再認証が必要です</p>
            <p class="error-body">
                長時間操作が行われなかったため、前回の認証が無効になっている<br />
                ことが考えられます。<br />
                ログイン画面よりログインを行ってください。
            </p>
            <button class="button buttonHighlight"
                    @click="LOOKTG">ログイン画面へ</button>

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
            this.$router.push({path: '/login'})
        }
    }
}
</script>

<style lang="less" scoped>
@import url("../../less/views/error/401.less");
</style>
