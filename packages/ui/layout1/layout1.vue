<template>
    <el-container class="chx-layout1">
        <el-header :style="{'height': 'auto','display': (setting.header || setting.toolbar.show ? 'block': 'none')}">
            <div class="header"
                 :style="{'height': (setting.header.height ? setting.header.height : '34px'),'display': (setting.header.show ? 'block': 'none')}">
                <slot name="header"></slot>
            </div>
            <div class="toolbar"
                 :style="{'height': (setting.toolbar.height ? setting.toolbar.height : '41px'),'display': (setting.toolbar.show ? 'block': 'none')}">
                <slot name="toolbar"></slot>
            </div>
        </el-header>
        <el-container class="body">
            <el-main class="main">
                <slot name="main"></slot>
            </el-main>
            <el-aside class="navbar"
                      :style="{'width': (setting.navbar.width ? setting.navbar.width : '58px'),'display': (setting.navbar.show ? 'block': 'none')}">
                <slot name="navbar"></slot>
            </el-aside>
            <transition name="list">
                <div class="list"
                     :style="{'width': (setting.list.width ? setting.list.width : '311px'),'display': (setting.list.show ? 'block': 'none')}"
                     v-show="chxListShow">
                    <slot name="list"></slot>
                </div>
            </transition>
            <transition name="detail">
                <div class="detail"
                     :style="{'width': (setting.detail.width ? setting.detail.width : '356px'),'display': (setting.detail.show ? 'block': 'none')}"
                     v-show="chxDetailShow">
                    <slot name="detail"></slot>
                </div>
            </transition>

        </el-container>
    </el-container>
</template>

<script>
export default {
    name: 'ChxLayout1',
    props: {
        chxSrc: {
            type: Object,
            default: () => {}
        },
        chxListShow: {
            type: Boolean,
            default: true
        },
        chxDetailShow: {
            type: Boolean,
            default: true
        }
    },
    data () {
        return {
            defaultSetting: {
                header: {
                    show: true,
                    height: '32px',
                    class: 'header'
                },
                toolbar: {
                    show: true,
                    height: '40px',
                    class: 'toolbar'
                },
                navbar: {
                    show: true,
                    width: '56px',
                    class: 'navbar'
                },
                list: {
                    show: true,
                    width: '200px',
                    class: 'list'
                },
                detail: {
                    show: true,
                    width: '200px',
                    class: 'detail'
                }
            }
        }
    },
    computed: {
        setting () {
            if (this.chxSrc !== {}) {
                return Object.assign(this.defaultSetting, this.chxSrc)

            } else {
                return this.defaultSetting
            }
        }
    }
}
</script>

<style lang="less" scoped>
@import './layout1.less';
</style>
