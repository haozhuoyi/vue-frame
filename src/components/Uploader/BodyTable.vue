<template>
    <div v-if="display">
        <table v-for="itme in filesTreeList"
               :key="itme.id"
               :class="['bodyTable', `bodyTable${itme.id}`]">
            <thead v-if="itme.isDir && itme.children.length>0">
                <p class="headerTitle">{{ itme._originPath }}</p>
            </thead>
            <tr v-if="!itme.isDir"
                :class="`bodyTableTr${itme.id}`">
                <td width="154.5px">
                    <p :title="itme.name">{{ itme.name }}</p>
                </td>
                <td width="71px"><p>{{ itme.size | bytesToSize(itme.size) }}</p></td>
                <td width="30px"
                    :id="`${itme.id}`">
                    <div id="perDiv">
                        <canvas :id="`canvasDemo${itme.id}`"
                                width="20"
                                height="20"></canvas>
                    </div>
                </td>
                <td width="94.25px"
                    :class="['buttonTd', `bodyTableTd${itme.id}`, `${itme.parentPathCrypto}`]"
                    @click="deleteUploadedFiles(itme.id)">{{ $t('bodyTable.DISPLAY_CANCEL') }}</td>
            </tr>
            <bodyTable v-if="itme.isDir && itme.children.length>0"
                       :files-tree-list="itme.children"
                       @deleteUploadedFiles="deleteUploadedFiles"></bodyTable>
        </table>
    </div>
</template>

<script>
import {bytesToSize} from '@u/filters'

export default {
    name: 'BodyTable',
    filters: {bytesToSize},
    props: {
        filesTreeList: {
            type: Array,
            default: []
        }
    },
    data () {
        return {
            display: true
        }
    },
    methods: {
        deleteUploadedFiles (id) {
            this.$emit('deleteUploadedFiles', id)
        }
    }
}
</script>

<style lang="less" scoped>
@import url("../../less/components/Uploader/BodyTable.less");
</style>
