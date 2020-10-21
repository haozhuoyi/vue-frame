<template>
    <div class="radio">
        <ul :class="['ul', id]"
            :style="{height: color.height}">
            <li v-for="(item, index) in data"
                :key="index"
                @mouseover="itemHover"
                @mouseout="removeHover"
                @click="change(item, $event)">
                <p class="radioGroupContent"
                   :style="{lineHeight: color.height}">
                    {{
                        item==='inquiry.DISPLAY_SUPPORT_TEL_LIST_FREE'?$t('inquiry.DISPLAY_SUPPORT_TEL_LIST_FREE'):item
                    }}
                </p>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'Radio',
    props: { // 组件参数
        id: {
            type: String,
            default () {
                return (Math.random() * +new Date() || new Date().getTime()).toString()
            }
        },
        data: {
            type: Array,
            default: []
        },
        color: {
            type: Object,
            default () {
                return {height: '28px', hover: '#CCDDEE', active: '#32465a'}
            }
        }
    },
    mounted () {
        this.$nextTick(() => {
            const dom = document.getElementsByClassName(`ul ${this.id}`)[0].getElementsByTagName('p')
            dom[0].style.color = '#fff'
            dom[0].style.backgroundColor = this.color.active
            this.content = this.data[0]
        })
    },
    methods: {
        // 获取焦点
        itemHover (event) {
            if (event.target.innerText !== (this.$t(this.content) || this.content)) {
                event.target.style.backgroundColor = this.color.hover
            }
        },
        // 失去焦点
        removeHover (event) {
            if (event.target.innerText !== (this.$t(this.content) || this.content)) {
                event.target.style.backgroundColor = '#fff'
            }
        },
        change (content, event) {
            const that = this
            that.content = content === 'inquiry.DISPLAY_SUPPORT_TEL_LIST_FREE' ? this.$t('inquiry.DISPLAY_SUPPORT_TEL_LIST_FREE') : content
            console.log(that.content, content, event)
            const dom = document.getElementsByClassName(`ul ${that.id}`)[0].getElementsByTagName('p')
            if (dom.length > 0) {
                for (let index = 0; index < dom.length; index++) {
                    dom[index].style.color = that.color.active
                    dom[index].style.backgroundColor = '#fff'
                }
            }
            event.target.style.color = '#fff'
            event.target.style.backgroundColor = that.color.active
            that.$emit('radioGroup', that.content)
        }
    }
}
</script>

<style scoped lang="less">
@import url("../less/components/RadioGroup.less");
</style>
