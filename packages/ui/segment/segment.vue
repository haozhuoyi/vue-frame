<template>
    <el-radio-group v-model="index"
                    :size="chxSize">
        <el-radio-button v-for="item in chxData"
                         :key="item.value"
                         :label="item.value">
            {{ item.title }}
        </el-radio-button>
    </el-radio-group>
</template>


<script>

export default {
    name: 'ChxSegment',
    props: {
        chxSelectedValue: {
            type: Number,
            default: -1
        },
        chxSelectedItem: {
            type: Object,
            default: () => {}
        },
        chxData: {
            type: Array,
            default: () => []
        },
        chxSize: {
            type: String,
            default: 'medium'
        }
    },
    data () {
        return {
            index: ''
        }
    },
    watch: {
        index () {
            if (this.chxData) {
                const item = this.chxData.find(item => item.value === this.index)
                this.$emit('onSelectedChange', item)
                this.$emit('update:chxSelectedValue', this.index)
                this.$emit('update:chxSelectedItem', item)
            }
        }
    },
    mounted () {
        this.index = this.chxSelectedValue
    }
}
</script>

<style lang="less" scoped>
@import './segment.less';
</style>
