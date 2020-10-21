<template>
    <div id="headButtons">
        <button v-for="(item,index) in dat"
                :key="index"
                :style="
                    isEmpty.indexOf($t(item.name)) !== -1 && length === 0 && $t(item.name) !== 'Add' && $t(item.name) !== '添加' ?
                        'opacity: 0.3;pointer-events:none;cursor: no-drop;' : ''
                "
                :class="['headButton', item.children ? 'dropdown' : '']"
                @click.prevent.stop="handleCommand($t(item.name))">
            <el-dropdown v-if="item.children"
                         trigger="click"
                         placement="bottom-start"
                         @command="handleCommand">
                <img class="buttonImage"
                     :src="item.image"
                     :style="item.name !== 'QR' ? '' : 'width: 30px;height: 30px;margin-top: 3px;'">
                <p @click.prevent.stop="dropdownEvent($event)"
                   :style="item.name !== 'QR' ? '' : 'margin-top: -6px;'">{{ $t(item.name) }}</p>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="(itme, inde) in item.children"
                                      :key="inde"
                                      :command="$t(itme.name)">{{ $t(itme.name) }}</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <div v-else>
                <img class="buttonImage"
                     :src="item.image">
                <p>{{ $t(item.name) }}</p>
            </div>
        </button>
    </div>
</template>

<script>
export default {
    name: 'HeadButton',
    props: {
        dat: {
            type: Array,
            default: []
        },
        length: {
            type: Number,
            default: 0
        }
    },
    data () {
        return {
            isEmpty: 'ダウン\nロード通知お気に入り移動/コピーゴミ箱へスナップ\nショットQR下载放入回收站到添加到\n收藏夹移动/复制创建快照二维码DownloadSending\ne-mailAdd to \nmy favoriteMove/CopyMove to\nTrashSnapshot\nmaking'
        }
    },
    // watch: {
    //     length (d) {
    //         console.log(d, this.length)
    //     }
    // },
    methods: {
        // ボタンクリック
        handleCommand (command) {
            this.$emit('handleCommand', command)
        },
        dropdownEvent (event) {
            const previous = event.target.previousSibling || event.target.previousElementSibling
            previous.click()
        }
    }
}
</script>

<style lang="less" scoped>
@import url("../less/components/HeadButton.less");
</style>
