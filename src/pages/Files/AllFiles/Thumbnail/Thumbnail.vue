<template>
    <div id="Thumbnail"
         v-loading="loading"
         :element-loading-text="$t('common.DISPLAY_UNDER_READING')"
         element-loading-spinner="el-icon-loading"
         element-loading-background="rgba(255,255,255,0.8)">
        <div class="test-range__select"
             ref="select"></div>
        <div class="thumbnailview"
             v-for="(item,index) in tableData"
             :key="item.NO"
             :ref="`${item.NO}` + '_ref'"
             :data-no="item.NO"
             @dblclick="getFolder(item)"
             @click.shift="Check(item, index)"
             :style="{width: slider+'px', height: slider+'px'}">
            <img v-if="item.TYPE.toLocaleUpperCase() === 'DIR'"
                 :src="svg.folder"
                 style=" width: 45%;height: 39%;margin-top: 21%;margin-bottom: 5px;">
            <img v-else-if="item.TYPE.toLocaleUpperCase() === 'PDF'"
                 :src="svg.pdf"
                 style=" width: 45%;height: 39%;margin-top: 21%;margin-bottom: 5px;">
            <img v-else-if="item.TYPE.toLocaleUpperCase() === 'XLSX' || item.TYPE.toLocaleUpperCase() === 'XLSX'"
                 :src="svg.xlsx"
                 style=" width: 45%;height: 39%;margin-top: 21%;margin-bottom: 5px;">
            <img v-else-if="item.TYPE.toLocaleUpperCase() === 'SVG' || item.TYPE.toLocaleUpperCase() === 'JPG' || item.TYPE.toLocaleUpperCase() === 'PNG' || item.TYPE.toLocaleUpperCase() === 'GIF' || item.TYPE.toLocaleUpperCase() === 'JPEG'"
                 :src="svg.img"
                 style=" width: 45%;height: 39%;margin-top: 21%;margin-bottom: 5px;">
            <img v-else
                 :src="svg.other"
                 style=" width: 45%;height: 39%;margin-top: 21%;margin-bottom: 5px;">

            <img :class="!item.check ? 'svg-icon uncheck' : 'svg-icon checked'"
                 :src="!item.check ? svg.uncheck : svg.checked"
                 @click="CheckNeo(item)">
            <img v-if="item.favoriteNo === true"
                 class="svg-icon collection"
                 :src="svg.collection">
            <img v-if="true"
                 class="svg-icon conversion"
                 :src="svg.conversion">
            <img class="svg-icon notice"
                 :src="svg.notice">
            <img class="svg-icon rename"
                 :src="svg.rename"
                 @click="EditClickEvent(item)">
            <img v-if="item.QR_INFO === true"
                 class="svg-icon QR"
                 :src="svg.QR">
            <p ref="filename"
               class="filename">{{ item.FILE_NAME }}</p>
            <p class="svg-icon size">{{ Math.floor(item.FILE_SIZE/1024/1024*100)/100 +'MB' }}</p>
        </div>
        <!-- <el-row :gutter="20">
      <el-col :span="3">
        <div class="grid-content bg-purple"
             style="height: 50px;border: 1px solid #RED"></div>
      </el-col>
      <el-col :span="3">
        <div class="grid-content bg-purple"
             style="height: 50px;border: 1px solid #RED"></div>
      </el-col>
      <el-col :span="3">
        <div class="grid-content bg-purple"
             style="height: 50px;border: 1px solid #RED"></div>
      </el-col>
      <el-col :span="3">
        <div class="grid-content bg-purple"
             style="height: 50px;border: 1px solid #RED"></div>
      </el-col>
      <el-col :span="3">
        <div class="grid-content bg-purple"
             style="height: 50px;border: 1px solid #RED"></div>
      </el-col>
      <el-col :span="3">
        <div class="grid-content bg-purple"
             style="height: 50px;border: 1px solid #RED"></div>
      </el-col>
      <el-col :span="3">
        <div class="grid-content bg-purple"
             style="height: 50px;border: 1px solid #RED"></div>
      </el-col>
      <el-col :span="3">
        <div class="grid-content bg-purple"
             style="height: 50px;border: 1px solid #RED"></div>
      </el-col>
    </el-row> -->
        <!-- 弹窗 -->
        <edit ref="edit"
              @inputValueEvent="inputValueEvent"></edit>
    </div>
</template>

<script>
import store from '@p/Files/store.js'
import edit from '@p/Files/AllFiles/TreeTable/Edit.vue'

const elementResizeDetectorMaker = require('element-resize-detector')// 导入
// 创建实例
const erd = elementResizeDetectorMaker()

export default {
    name: 'Thumbnail',
    components: {edit},
    data () {
        return {
            loading: false,
            slider: 110,
            tableData: [],
            svg: {
                folder: require('@a/images/file/file-folder-05.svg'), // 文件icon
                pdf: require('@a/images/file/file-pdf-09.svg'), // 文件icon
                xlsx: require('@a/images/file/file-xls.svg'), // 文件icon
                img: require('@a/images/file/file-img.svg'), // 文件icon
                other: require('@a/images/file/file-txt.svg'), // 文件icon
                collection: require('@a/images/file/file-collection-03.svg'), // 收藏
                QR: require('@a/images/file/file-qr-04.svg'), // QR
                uncheck: require('@a/images/file/file-unchecked-07.svg'), // 不选
                checked: require('@a/images/file/file-Selection-06.svg'), // 选中
                rename: require('@a/images/file/file-rename-02.svg'), // QR
                notice: require('@a/images/file/file-notice-08.svg'), // 通知
                conversion: require('@a/images/file/file-conversion-01.svg') // 刷新
            },
            mouseStopId: undefined,
            mouseOn: false,
            CheckNO: [], // 选中下标
            CheckedData: [], // 选中数据
            isShift: false
        }
    },
    computed: {
        breadcrumb () {
            return JSON.parse(Crypto.decrypt(store.state.breadcrumb))
        }
    },
    mounted () {
        this.$nextTick(() => {
            // this.getFolder({NO: '-1'})
            function key (ev) {
                let currKey = 0
                const e = ev || event
                currKey = e.keyCode || e.which || e.charCode// 支持IE、FF
                if (currKey === 16) {
                    this.isShift = !this.isShift
                }
            }
            document.onkeydown = key// onkeydown事件调用方式
            document.onkeyup = key
        })
    },
    methods: {
        CheckNeo (item) {
            item.check = !item.check
            this.CheckNO = []
            this.CheckedData.push(item)
            this.CheckedData = unique(this.CheckedData)
            this.CheckedData = this.CheckedData.filter((item) => {
                return item.check
            })
            console.log(this.CheckedData)
            function unique (arr) {
                return arr.reduce((prev, cur) => prev.includes(cur) ? prev : [...prev, cur], [])
            }
        },
        // 多选
        Check (item, index) {
            if (this.CheckNO.length === 0) {
                this.check()
                item.check = true
                this.CheckNO.push(index)
                this.CheckedData = []
            } else {
                this.check()
                this.CheckNO.push(index)
                if (this.CheckNO[0] < this.CheckNO[this.CheckNO.length - 1]) {
                    for (let i = this.CheckNO[0]; i <= this.CheckNO[this.CheckNO.length - 1]; i++) {
                        this.tableData[i].check = true
                        this.CheckedData.push(this.tableData[i])
                    }
                } else if (this.CheckNO[0] > this.CheckNO[this.CheckNO.length - 1]) {
                    for (let i = this.CheckNO[this.CheckNO.length - 1]; i <= this.CheckNO[0]; i++) {
                        this.tableData[i].check = true
                        this.CheckedData.push(this.tableData[i])
                    }
                } else {
                    item.check = true
                }
            }
        },
        // 清空选择状态
        check () {
            this.CheckedData = []
            for (let i = 0; i < this.tableData.length; i++) {
                this.tableData[i].check = false
            }
        },
        // 动态设置缩略图的大小
        thumbnailSliderInput (slider) {
            this.slider = slider
        },
        // 重命名
        EditClickEvent (item) {
            this.check()
            item.check = true
            this.CheckedData = []
            this.CheckedData.push(item)
            this.$refs.edit.editDialog({
                editDialog: true,
                title: '名前を変更',
                width: '394.95px',
                inputName: '名前',
                FILE_NAME: item.FILE_NAME,
                TYPE: item.TYPE
            })
        },
        // 重命名回调
        inputValueEvent (d) {
            if (d.title === '名前を変更') {
                this.loading = true
                const body = `{"NewName": "${encodeURIComponent(d.value)}"}`
                const COMMON_PARAMETERS_POST = this.$request.COMMON_PARAMETERS_POST(body)
                this.$request.folder.FileRname(this.CheckedData[0].NO, COMMON_PARAMETERS_POST, body).then(response => {
                    console.log('FileRname-patch请求成功:', response.status, response.statusText)
                    const data = this.$request.CODE(response.data)
                    if (Object.prototype.toString.call(data) === '[object Object]') {
                        this.$message.success(this.$t('thumbnail.MESSAGE_THUMBNAIL_SUCCESS'))
                        this.getFolder(this.breadcrumb[this.breadcrumb.length - 1])
                    }
                    this.loading = false
                }).catch(err => {
                    this.loading = false
                    if (err.status === 401) {
                        this.$request.login.refreshToken().then(response => {
                            response ? this.inputValueEvent(d) : ''
                        })
                    } else {
                        this.$request.requestError('FileRname-patch请求成功', err, 'Thumbnail')
                    }
                })
            }
        },
        // 获取文件&&文件夹
        getFolder (item) {
            console.log(item)
            this.loading = true
            this.CheckNO = []
            this.CheckedData = []
            if (item.NO !== '-1') {
                const breadcrumb = this.breadcrumb
                for (let i = 0; i < breadcrumb.length; i++) {
                    if (breadcrumb[i].DISPLAY_PARENT_PATH === item.DISPLAY_PARENT_PATH) {
                        breadcrumb.splice(i)
                    }
                }
                breadcrumb.push({
                    FILE_NAME: item.FILE_NAME,
                    NO: item.NO,
                    DISPLAY_PARENT_PATH: item.DISPLAY_PARENT_PATH
                })
                store.commit('setBreadcrumb', breadcrumb)
            } else {
                store.commit('setBreadcrumb', [])
                store.dispatch('setADDBreadcrumb', [{
                    FILE_NAME: this.$store.state.userInfo.projectName,
                    NO: '-1',
                    DISPLAY_PARENT_PATH: ''
                }])
            }
            const body = (
                '{"NeedPointCNT": "false", "NeedDirectContentCNT": "false", "NeedQRInfo": "false"}')
            const COMMON_PARAMETERS = this.$request.COMMON_PARAMETERS(body)
            this.$request.folder.getFolders(item.NO, COMMON_PARAMETERS, body).then(response => {
                console.log('getFolders-get请求成功:', response.status, response.statusText)
                const data = this.$request.CODE(response.data)
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    data.result.forEach(da => {
                        da.check = false
                        da.FILE_NAME = decodeURIComponent(da.FILE_NAME)
                    })
                    this.tableData = data.result
                    setTimeout(() => {
                        const e = document.getElementsByClassName('filename')
                        for (let i = 0; i < e.length; i++) {
                            this.loading = true
                            erd.listenTo(e[i], function (ele) {
                                if (ele.offsetHeight > 12) {
                                    ele.style.cssText += 'text-align: left'
                                } else if (ele.offsetHeight > 24) {
                                    ele.classList.add('after')
                                }
                            })
                        }
                        setTimeout(() => {
                            this.loading = false
                        }, 600)
                    }, 100)
                }
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.getFolder(item) : ''
                    })
                } else {
                    this.$request.requestError('getFolders-get请求失败', err, 'Thumbnail')
                }
            })
        }
    }
}
</script>

<style lang="less" scoped>
@import url("../../../../less/pages/Files/AllFiles/Thumbnail/Thumbnail.less");
</style>
