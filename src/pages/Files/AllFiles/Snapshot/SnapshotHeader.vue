<template>
    <div id="snapshotHeader">
        <section style="height: 60px;">
            <div class="viewtype">
                <button class="vtbutton"
                        :class="viewtype === 'thumbnail' ? 'Selected' : ''"
                        @click="viewtypeEvent('thumbnail')">
                    <i class="el-icon-menu"
                       :class="viewtype === 'thumbnail' ? 'eliconmenu' : ''"></i>
                </button>
                <button class="vtbutton"
                        :class="viewtype === 'treetable' ? 'Selected' : ''"
                        @click="viewtypeEvent('treetable')">
                    <svg v-if="viewtype === 'thumbnail'"
                         class="icon chextreTeable"
                         aria-hidden="true">
                        <use xlink:href="#chextree-table"></use>
                    </svg>
                    <svg v-if="viewtype === 'treetable'"
                         class="icon chextreTeable"
                         aria-hidden="true">
                        <use xlink:href="#chextree-table-active"></use>
                    </svg>
                </button>
            </div>
            <div v-for="(item,index) in dat"
                 :key="index"
                 :style="item.children ? 'margin: 0 5px;' : ''">
                <el-dropdown v-if="item.children"
                             trigger="click"
                             @command="handleCommand">
                    <button class="button"
                            style="display: block;margin-bottom: -2px;"></button>
                    <p>
                        {{ item.name }}<i class="el-icon-arrow-down el-icon--right"></i>
                    </p>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-for="(itme, inde) in item.children"
                                          :key="inde"
                                          :command="item.name">{{ itme.name }}</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <div v-else
                     @click="handleCommand(item.name)">
                    <button class="button"></button>
                    <p>{{ item.name }}</p>
                </div>
            </div>
            <div class="input">
                <el-input size="small"
                          prefix-icon="el-icon-search"
                          v-model="input"
                          :placeholder="$t('SnapshotHeader.DISPLAY_SNAP_SHOT_INFO_SEARCH')"
                          @input="e => input = validForbid(e)"
                          @change="getFile">
                </el-input>
                <button class="bottonAdd"
                        @click="Header">{{ $t('SnapshotHeader.DISPLAY_SNAP_SHOT_INFO_DETAILED_SEARCH') }}</button>
            </div>
        </section>
    </div>
</template>

<script>
import bus from '@c/bus'
import store from '@p/Files/store'
import Crypto from '@u/crypto'

export default {
    name: 'SnapshotHead',
    data () {
        return {
            bottons: {
                One: [
                    {
                        name: '通知'
                    },
                    {
                        name: 'QR',
                        children: [
                            {
                                name: 'QR付きPDFの作成'
                            },
                            {
                                name: 'QR付きPDFのダウンロード'
                            },
                            {
                                name: 'QR付きPDFの無効化'
                            }
                        ]
                    },
                    {
                        name: 'お気に入り'
                    },
                    {
                        name: 'アップロード'
                    },
                    {
                        name: 'ダウンロード'
                    },
                    {
                        name: 'フォルダ作成'
                    },
                    {
                        name: 'ゴミ箱へ'
                    },
                    {
                        name: 'スナップショット'
                    }
                ],
                Two: [
                    {
                        name: 'アップロード'
                    },
                    {
                        name: 'フォルダ作成'
                    },
                    {
                        name: 'ダウンロード'
                    },
                    {
                        name: '通知'
                    },
                    {
                        name: 'お気に入り'
                    },
                    {
                        name: '移動/コピー'
                    },
                    {
                        name: 'ゴミ箱へ'
                    },
                    {
                        name: 'スナップショット'
                    },
                    {
                        name: 'QR',
                        children: [
                            {
                                name: 'QR付きPDFの作成'
                            },
                            {
                                name: 'QR付きPDFのダウンロード'
                            },
                            {
                                name: 'QR付きPDFの無効化'
                            }
                        ]
                    },
                    {
                        name: 'その他の操作'
                    }
                ]
            },
            input: '' // 检索字段
        }
    },
    computed: {
        viewtype () {
            return Crypto.decrypt(store.state.viewtype)
        },
        dat () {
            if (this.viewtype === 'thumbnail') {
                return this.bottons.One
            } else {
                return this.bottons.Two
            }
        }
    },
    methods: {
        // 切换视图
        viewtypeEvent (item) {
            store.dispatch('setViewType', item)
            bus.$emit('viewtype', item)
        },
        handleCommand (command) {
            this.$message('click on item ' + command)
        },
        Header () {
            this.$emit('Header')
        },
        getFile () {
            this.$emit('getFile', this.input)
        }
    }
}
</script>

<style lang="less" scoped>
@import url("../../../../less/pages/Files/AllFiles/Snapshot/Header.less");
</style>
