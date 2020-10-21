
<script>
import ElButton from 'element-ui/packages/button'

export default {
    name: 'ChxButton',
    extends: ElButton,
    props: {
        chxIcon: {
            type: String,
            default: ''
        },
        chxBorder: {
            type: String,
            default: 'true'
        },
        /** normal/delete/highlight */
        chxType: {
            type: String,
            default: 'normal'
        },
        chxText: {
            type: String,
            default: ''
        },
        chxTextPosition: {
            type: String,
            default: 'bottom'
        },
        chxTextMargin: {
            type: String,
            default: '0px'
        }

    },
    render (createElement) {
        const superRendered = this.$options.extends.render.apply(this, arguments)

        // CheX Icon導入
        if (this.chxIcon) {
            // <el-image :src="toolIcon"></el-image>
            const icon = createElement('el-image', {attrs: {src: require('../../assets/icons/svg/' + this.chxIcon + '.svg')}})
            superRendered.children.push(icon)
            superRendered.data.class.push('chx-icon-button')
        } else {
            superRendered.data.class.push('chx-button')
        }

        // 枠あるかどうか
        if (this.chxBorder !== undefined && this.chxBorder === 'false') {
            superRendered.data.class.push('chx-button-noborder')
        }
        // CheXボタンのカスタマイズ
        if (this.chxIcon === '' && this.chxType !== undefined) {
            if (this.chxType === '') {
                this.chxType = 'normal'
            }
            superRendered.data.class.push('chx-button-' + this.chxType)
        }

        // chxText
        if (this.chxText) {
            switch (this.chxTextPosition) {
                case 'bottom' :
                    // eslint-disable-next-line no-case-declarations
                    const bottomText = createElement('p', {attrs: {style: 'margin-top:' + this.chxTextMargin}})
                    bottomText.text = this.chxText
                    superRendered.children.push(bottomText)
                    break
                case 'top' :
                    // eslint-disable-next-line no-case-declarations
                    const topText = createElement('p', {attrs: {style: 'margin-bottom:' + this.chxTextMargin}})
                    topText.text = this.chxText
                    superRendered.children.unshift(topText)
                    break
                case 'left' :
                // eslint-disable-next-line no-case-declarations
                    const leftText = createElement('p', {attrs: {style: 'margin-right:' + this.chxTextMargin}})
                    // eslint-disable-next-line no-case-declarations
                    leftText.text = this.chxText
                    superRendered.children.unshift(leftText)
                    superRendered.data.class.push('chx-position')
                    break
                case 'right' :
                // eslint-disable-next-line no-case-declarations
                    const rightText = createElement('p', {attrs: {style: 'margin-left:' + this.chxTextMargin}})
                    rightText.text = this.chxText
                    superRendered.children.push(rightText)
                    superRendered.data.class.push('chx-position')
                    break
            }
        }

        return superRendered
    }
}
</script>

<style lang="less" scoped>
@import './button.less';
</style>
