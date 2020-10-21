<template>
    <div id="DetailedSearch">
        <div class="select">
            <!-- 検索場所 -->
            <div class="selectReading">
                <span style="">{{ $t('detailSearch.DISPLAY_FILE_INFO_SEARCH_RESULT_PARENT_PATH') }}</span>
                <button :class="searchLocation === '00' ? 'select' : ''"
                        class="buttonLeft"
                        @click="searchLocation = '00'"
                        style="width: 108px;">
                    {{ $t('detailSearch.DISPLAY_FILE_INFO_SEARCH_NOW_FOLDER') }}
                </button>
                <button :class="searchLocation === '01' ? 'select' : ''"
                        class="buttonRight"
                        @click="searchLocation = '01'"
                        style="width: 120px;position: relative;">
                    {{ $t('detailSearch.DISPLAY_FILE_INFO_SEARCH_ALL_FOLDER') }}
                </button>
            </div>
            <!-- 検索対象 -->
            <div class="buttonSelect multi">
                <div>
                    <span class="kind">{{ $t('detailSearch.DISPLAY_FILE_INFO_SEARCH_TARGET') }}</span>
                </div>
                <ul>
                    <li>
                        <label for="searchObjectFolder">
                            <input type="checkbox"
                                   id="searchObjectFolder"
                                   name="checkboxSearchObject"
                                   value="02">
                            <div class="checkContainer"></div>
                            <span>{{ $t('detailSearch.DISPLAY_FILE_INFO_SEARCH_FILE') }}</span>
                        </label>
                    </li>
                    <li>
                        <label for="searchObjectFile">
                            <input type="checkbox"
                                   id="searchObjectFile"
                                   name="checkboxSearchObject"
                                   value="03"
                                   checked>
                            <div class="checkContainer"></div>
                            <span>{{ $t('detailSearch.DISPLAY_FILE_INFO_SEARCH_FOLDER') }}</span>
                        </label>
                    </li>
                </ul>
            </div>
            <!-- ファイルの状態 -->
            <div class="buttonSelect multi">
                <div>
                    <span class="kind">{{ $t('detailSearch.DISPLAY_FILE_INFO_SEARCH_TARGET_STATUS') }}</span>
                </div>
                <ul>
                    <li>
                        <label for="searchObjectAvailable">
                            <input type="checkbox"
                                   id="searchObjectAvailable"
                                   name="checkboxFileStatus"
                                   value="04"
                                   checked>
                            <div class="checkContainer"></div>
                            <span>{{ $t('detailSearch.DISPLAY_FILE_INFO_SEARCH_VIEWABLE') }}</span>
                        </label>
                    </li>
                    <li>
                        <label for="searchObjectDoNotRead">
                            <input type="checkbox"
                                   id="searchObjectDoNotRead"
                                   name="checkboxFileStatus"
                                   value="05"
                                   checked>
                            <div class="checkContainer"></div>
                            <span>{{ $t('detailSearch.DISPLAY_FILE_INFO_SEARCH_UNVIEWABLE') }}</span>
                        </label>
                    </li>
                </ul>
            </div>
            <!-- 現在のフォルダ： -->
            <div class="detailedSearchBreadcrumb"
                 :title="$t('detailSearch.DISPLAY_FILE_INFO_SEARCH_NOW_FOLDER')+storeBreadcrumb?storeBreadcrumb :breadcrumb"
                 @click.prevent.stop="defaultExpanded">
                {{ $t('detailSearch.DISPLAY_FILE_INFO_SEARCH_NOW_FOLDER') }}：
                {{ storeBreadcrumb ? storeBreadcrumb :breadcrumb }}
            </div>
            <!-- ファイルの種類 -->
            <div class="buttonSelect">
                <div>
                    <span class="kind">{{ $t('detailSearch.DISPLAY_FILE_INFO_SEARCH_FILE_TYPE') }}</span>
                    <button class="bottonselect"
                            @click="selectAll">
                        <p>{{ $t('detailSearch.DISPLAY_FILE_INFO_SEARCH_ALL_SELECT') }}</p>
                    </button>
                    <button class="bottonselect"
                            @click="massDispel">
                        <p>{{ $t('detailSearch.DISPLAY_FILE_INFO_SEARCH_ALL_CANCEL') }}</p>
                    </button>
                </div>
                <ul class="fileName"
                    :style="$i18n.locale !== 'cn' ? 'width: 650px' : ''">
                    <li v-for="(item, index) in checkboxFileTypeData"
                        :key="index">
                        <label :for="item.id">
                            <input type="checkbox"
                                   :id="item.id"
                                   name="checkboxSelectType"
                                   :value="item.no"
                                   :checked="'11,12,07'.indexOf(item.no) !== -1">
                            <div class="checkContainer"></div>
                            <span>{{ $t(item.name) }}</span>
                        </label>
                    </li>
                </ul>
            </div>
            <!-- QRコード -->
            <div class="buttonSelect">
                <span style="">{{ $t('detailSearch.DISPLAY_FILE_INFO_SEARCH_QR') }}</span>
                <ul class="fileName"
                    :style="$i18n.locale !== 'cn' ? 'width: 650px' : ''">
                    <li v-for="(item, index) in multiCheckOptions"
                        :key="index">
                        <label :for="item.id">
                            <input type="checkbox"
                                   name="selectReading"
                                   :id="item.id"
                                   :value="item.no"
                                   checked>
                            <div class="checkContainer"></div>
                            <span>{{ $t(item.name) }}</span>
                        </label>
                    </li>
                </ul>
                <!-- <multiCheckList v-model="qrCode"
                                :options="multiCheckOptions"
                                :showbox="false"
                                @change="selectQRCodeEvent"></multiCheckList> -->
            </div>
            <button class="retrieval button buttonHighlight"
                    @click="search">{{ $t('detailSearch.DISPLAY_FILE_INFO_SEARCH_DETAIL_BUTTON') }}</button>
            <button class="bottonAdd"
                    @click="searchForDetails">
                <p>{{ $t('detailSearch.DISPLAY_FILE_INFO_SEARCH_DETAIL') }}
                    <img :src="pulldown">
                </p>
            </button>
        </div>
    </div>
</template>

<script>
import Crypto from '@u/crypto'
import store from '@p/Files/store.js'
// import multiCheckList from '@c/MultiCheckList.vue'

export default {
    name: 'DetailedSearch',
    // components: {
    //     multiCheckList
    // },
    props: {
        addVisible: {
            type: Boolean,
            default: false
        },
        selectData: {
            type: Array,
            default: []
        }
    },
    data () {
        return {
            checkboxFileTypeData: [
                {
                    name: 'detailSearch.DISPLAY_FILE_INFO_SEARCH_FILE_TYPE_PDF',
                    id: 'checkbox_PDF',
                    no: '06'
                },
                {
                    name: 'detailSearch.DISPLAY_FILE_INFO_SEARCH_FILE_TYPE_CAD',
                    id: 'checkbox_DWG,DXF',
                    no: '07'
                },
                {
                    name: 'detailSearch.DISPLAY_FILE_INFO_SEARCH_FILE_TYPE_TFAS',
                    id: 'checkbox_Tfas',
                    no: '08'
                },
                {
                    name: 'detailSearch.DISPLAY_FILE_INFO_SEARCH_FILE_TYPE_CAPE',
                    id: 'checkbox_CAPE',
                    no: '09'
                },
                {
                    name: 'detailSearch.DISPLAY_FILE_INFO_SEARCH_FILE_TYPE_JWCAD',
                    id: 'checkbox_JWCAD',
                    no: '10'
                },
                {
                    name: 'detailSearch.DISPLAY_FILE_INFO_SEARCH_FILE_TYPE_REBRO',
                    id: 'checkbox_Rebro',
                    no: '11'
                },
                {
                    name: 'detailSearch.DISPLAY_FILE_INFO_SEARCH_FILE_TYPE_CADEWA',
                    id: 'checkbox_CADEWA',
                    no: '12'
                },
                {
                    name: 'detailSearch.DISPLAY_FILE_INFO_SEARCH_FILE_TYPE_WORD',
                    id: 'checkbox_Word',
                    no: '13'
                },
                {
                    name: 'detailSearch.DISPLAY_FILE_INFO_SEARCH_FILE_TYPE_IFC',
                    id: 'checkbox_IFC',
                    no: '20'
                },
                {
                    name: 'detailSearch.DISPLAY_FILE_INFO_SEARCH_FILE_TYPE_RVT',
                    id: 'checkbox_RVT',
                    no: '21'
                },
                {
                    name: 'detailSearch.DISPLAY_FILE_INFO_SEARCH_FILE_TYPE_NAVISWORKS',
                    id: 'checkbox_Navisworks',
                    no: '22'
                },
                {
                    name: 'detailSearch.DISPLAY_FILE_INFO_SEARCH_FILE_TYPE_EXCEL',
                    id: 'checkbox_Excel',
                    no: '14'
                },
                {
                    name: 'detailSearch.DISPLAY_FILE_INFO_SEARCH_FILE_TYPE_POWERPOINT',
                    id: 'checkbox_PowerPoint',
                    no: '15'
                },
                {
                    name: 'detailSearch.DISPLAY_FILE_INFO_SEARCH_FILE_TYPE_TEXT',
                    id: 'checkbox_テキスト',
                    no: '16'
                },
                {
                    name: 'detailSearch.DISPLAY_FILE_INFO_SEARCH_FILE_TYPE_IMAGE',
                    id: 'checkbox_画像',
                    no: '17'
                },
                {
                    name: 'detailSearch.DISPLAY_FILE_INFO_SEARCH_FILE_TYPE_MOVIE',
                    id: 'checkbox_動画',
                    no: '18'
                },
                {
                    name: 'detailSearch.DISPLAY_FILE_INFO_SEARCH_FILE_TYPE_OTHERS',
                    id: 'checkbox_その他',
                    no: '19'
                }
            ],
            multiCheckOptions: [
                {'no': '20', 'name': 'detailSearch.DISPLAY_FILE_INFO_SEARCH_WITH_QR', 'id': 'qr_exists'},
                {'no': '21', 'name': 'detailSearch.DISPLAY_FILE_INFO_SEARCH_WITH_QR_PDF', 'id': 'qr_exists_condition'},
                {'no': '22', 'name': 'detailSearch.DISPLAY_FILE_INFO_SEARCH_WITHOUT_QR', 'id': 'qr_not_exists'}
            ],
            storeBreadcrumb: '', // 选中文件的路径
            searchLocation: '00', // 検索场所
            searchObject: [], // 検索対象
            fileStatus: [], // ファイルの状態
            qrCode: ['20', '21', '22'], // QRコード
            upwardpull: require('@a/images/file/file-upward-pull.svg'), // 上拉
            pulldown: require('@a/images/file/file-upward-pull.svg'), // 下拉
            breadcrumb: ''
        }
    },
    watch: {
        selectData: {
            handler (val/* , oldval */) {
                if (val.length === 0) {
                    this.storeBreadcrumb = ''
                } else if (val.length === 1) {
                    this.storeBreadcrumb = val[0].DISPLAY_PARENT_PATH
                } else if (val.length > 1) {
                    this.storeBreadcrumb = 'n個のアイテムを選択中'
                }
            },
            immediate: true
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.searchLocation = '00'
            this.qrCode = ['20', '21', '22']
            const breadcrumbs = JSON.parse(Crypto.decrypt(store.state.breadcrumb))
            const breadcrumb = []
            for (let index = 0; index < breadcrumbs.length; index++) {
                breadcrumb.push(breadcrumbs[index].FILE_NAME)
            }
            this.breadcrumb = breadcrumb.toString().replace(/,/g, '>')
        })
    },
    methods: {
        defaultExpanded () {
            if (this.storeBreadcrumb && this.storeBreadcrumb !== 'n個のアイテムを選択中') {
                store.dispatch('setDefaultExpandedKeys', this.selectData[0].defaultExpandedKeys)
                this.searchForDetails()
            }
        },
        // selectQRCodeEvent (data) {
        //     this.qrCode = data
        // },
        // 全テーマ検索
        selectAll () {
            const checked = document.getElementsByClassName('fileName')[0].querySelectorAll('input')
            for (let i = 0; i < checked.length; i++) {
                if (!checked[i].checked) {
                    checked[i].checked = true
                }
            }
        },
        // 一切選ばない
        massDispel () {
            const checked = document.getElementsByClassName('fileName')[0].querySelectorAll('input')
            for (let i = 0; i < checked.length; i++) {
                if (checked[i].checked) {
                    checked[i].checked = false
                }
            }
        },
        search () {
            const searchObject = document.getElementsByName('checkboxSearchObject')
            const fileStatus = document.getElementsByName('checkboxFileStatus')
            const checkboxSelectType = document.getElementsByName('checkboxSelectType')
            const selectReading = document.getElementsByName('selectReading')
            const allSelect = []
            this.searchObject = []
            this.fileStatus = []
            this.qrCode = []
            for (let i = 0; i < searchObject.length; i++) {
                if (searchObject[i].checked) {
                    this.searchObject.push(searchObject[i].value)
                }
            }
            for (let i = 0; i < fileStatus.length; i++) {
                if (fileStatus[i].checked) {
                    this.fileStatus.push(fileStatus[i].value)
                }
            }
            for (let i = 0; i < checkboxSelectType.length; i++) {
                if (checkboxSelectType[i].checked) {
                    allSelect.push(checkboxSelectType[i].value)
                }
            }
            for (let i = 0; i < selectReading.length; i++) {
                if (selectReading[i].checked) {
                    this.qrCode.push(selectReading[i].value)
                }
            }
            console.log({
                QUERY: '',
                SCOPE: this.searchLocation,
                TARGET: this.searchObject.toString(),
                ACCESS: this.fileStatus.toString(),
                EXT: allSelect,
                QR: this.qrCode.toString()
            })
            this.$emit('ConditionQuery', {
                QUERY: '',
                SCOPE: this.searchLocation,
                TARGET: this.searchObject.toString(),
                ACCESS: this.fileStatus.toString(),
                EXT: allSelect.toString(),
                QR: this.qrCode.toString()
            })
        },
        // 詳細探索スイッチ
        searchForDetails () {
            this.$emit('DetailedSearch')
        }
    }
}
</script>

<style lang="less" scoped>
@import url("../less/components/DetailedSearch.less");
</style>
