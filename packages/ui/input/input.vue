<script>
import ElInput from 'element-ui/packages/input'

export default {
    name: 'ChxInput',
    extends: ElInput,
    props: {

    },
    render (createElement) {
        const superRendered = this.$options.extends.render.apply(this, arguments)
        superRendered.data.class.push('chx-input')

        return superRendered
    }
}
</script>

<style lang="less" scoped>
@import './input.less';
</style>