<template>
    <div class="multiChecklist">
        <!-- <label class="multiChecklist-title">{{ label }}</!-->
        <div :class="showbox? 'multiChecklistContentc':'multiChecklistContent'">
            <div v-for="(item,index) in options"
                 :key="index"
                 class="options">
                <input type="checkbox"
                       :id="'mchecklist'+index+curTime"
                       :value="item.value"
                       v-model="checkedVal"
                       class="checkbox"
                       :disabled="item.disabled || disabled">
                <label :for="'mchecklist'+index+curTime"
                       class="checkLabel"
                       :style="index === 0 ? 'border-radius: 2px 0 0 2px;' : (index === 1 ? '' : (index === 3 ? '' : 'border-radius: 0 2px 2px 0;'))">{{ $t(item.name) }}</label>
            </div>
        </div>
    </div>
</template>

<script>
/**
 * @author liuxin
 * @description 多选操作 结果是数组，读取value值
 * @param  label：组件的标签名称
 * @param  options：选项 [{value:'1',name:'选项1',disabled:false}] value:选中的值  name:checkbox显示的名称  disabled:禁用控件，默认不禁用
 * @param  checked：选中的数据 ['1']，通常与disabled:true合并使用
 * @param  disabled：是否全部禁用， 默认false可用
 * @param  showbox：是否显示勾选框， 默认显示 ( false:不显示，则样式会改变)
 */
export default {
    name: 'MultiCheckList',
    model: { // v-model  对应的变量和事件，默认是value和change
        prop: 'checked',
        event: 'change'
    },
    props: { // 组件参数
        label: {
            type: String,
            default: ''
        },
        options: {
            type: Array,
            default: []
        },
        checked: {
            type: Array,
            default: []
        },
        disabled: {
            type: Boolean,
            default: false
        },
        showbox: {
            type: Boolean,
            default: true
        }
    },
    data () {
        return {
            checkedVal: this.checked, // データを格納します(用来存储选中的数据)
            // 現在時刻を取得し,一意idを生成し,1つのページに複数のコンポーネントが利用可能であることを保証する
            // (获取当前时间，生成唯一id，保证一个页面可使用多个组件)
            curTime: new Date().getTime()
        }
    },
    watch: { // データの変化を検知し、データを親コンポーネントに返信する(监听数据变化，回传数据到父组件)
        checkedVal (newValue, oldValue) {
            if (newValue !== oldValue) {
                this.$emit('change', newValue)
            }
        },
        'checked': {
            // eslint-disable-next-line no-unused-vars
            handler (newVal, oldVal) {
            },
            deep: true
        }
    }
}
</script>

<style scoped lang="less">
@import url("../less/components/MultiCheckList.less");
</style>
