<template>
    <div id="user">
        <ul>
            <li class="liHead border"
                style="border-bottom: 1px solid #999999;margin-right: 4px;padding-left: 8px;"
                @click="sort('BELONGING_NAME')">{{ $t('groupUser.DISPLAY_GROUP_DG_MEMBER_ROW_TITLE_BELONGING_NAME') }}</li>
            <li class="liHead wo border"
                @click="sort('USER_NAME')">{{ $t('groupUser.DISPLAY_GROUP_DG_MEMBER_ROW_TITLE_USER_NAME') }}</li>
        </ul>
        <ul class="ulBody"
            onselectstart="return false;">
            <li v-for="(itme,index) in userDataOriginal"
                :key="index"
                :class="`user${index}`">
                <ul>
                    <li class="liHead li">
                        <img :src="require('@a/images/usermanagement/usermanagement-user-icon-green.svg')" />
                        <span style="margin-left: 25px;"
                              :title="itme.BELONGING_NAME === '(所属なし)' ? $t('UserManagementU.BELONGING_NAME2') : itme.BELONGING_NAME">
                            {{ itme.BELONGING_NAME === '(所属なし)' ? $t('UserManagementU.BELONGING_NAME2') : itme.BELONGING_NAME }}
                        </span>
                    </li>
                    <li class="liHead wo li">
                        <span :title="itme.USER_NAME">{{ itme.USER_NAME }}</span>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import {natsort} from '@u/natsort-1.2.4.js'

export default {
    name: 'User',
    props: {
        userData: {
            type: Array,
            default: () => {
                return []
            }
        },
        department: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    data () {
        return {
            name: '',
            userDataOriginal: [],
            item1: 'item1',
            item2: 'item2'
        }
    },
    watch: {
        userData: {
            handler (val/* , oldval */) {
                this.userDataOriginal = JSON.parse(JSON.stringify(val))
                this.name = ''
                this.sort('BELONGING_NAME')
            },
            // deep: true,
            immediate: true
        }
    },
    methods: {
        // sort (name) {
        //     if (this.name && this.name === name) {
        //         this.userDataOriginal.reverse()
        //     } else {
        //         this.userDataOriginal.sort(function compareFunction (item1, item2) {
        //             return item1[name].charCodeAt() - item2[name].charCodeAt()
        //         })
        //     }
        //     this.name = name
        // }
        sort (name) {
            let userDataOriginal = []
            if (this.name && this.name === name) {
                this.userDataOriginal.reverse()
            } else {
                userDataOriginal = natsort(this.userDataOriginal, convertFILENAME)
            }
            this.userDataOriginal = Object.assign([], this.userDataOriginal, userDataOriginal)
            this.name = name

            function convertFILENAME (value) { // 配列の要素を受け取る
                return value[name] // 要素値となる配列オブジェクトの "1" プロパティを比較する
            }
        }
    }
}
</script>

<style lang="less" scoped>
@import url("../../../../less/pages/UserManagement/GroupManagement/components/GroupUser.less");
</style>
