<template>
    <div id="pdfCreating">
        <el-dialog :visible.sync="dialogVisible"
                   :close-on-click-modal="false"
                   :before-close="close"
                   title="QR付きPDF作成">
            <div v-loading="loading"
                 :element-loading-text="$t('common.DISPLAY_UNDER_READING')"
                 element-loading-spinner="el-icon-loading"
                 element-loading-background="rgba(255,255,255,.4)">
                <div class="transitionBox">
                    <div class="informationFilesSelected"
                         style="margin:0px 7px;padding:7px;border-bottom: 1px solid #bebebe;">
                        <div class="folderName"
                             style="width:auto;">
                            プリセット：
                        </div>
                        <el-radio-group v-model="settingName"
                                        @change="changeSetting">
                            <el-radio-button v-for="(item, index) in data"
                                             :key="index"
                                             :label="item.settingName">設定{{ item.settingName }}</el-radio-button>
                        </el-radio-group>
                    </div>
                    <div class="qrUrl">
                        <div class="qr">
                            <span class="head">
                                QR
                            </span>
                            <div class="informationFilesSelected"
                                 style="margin:0px 7px;">
                                <div class="qrfolderName">
                                    <div class="folderName">
                                        起点：
                                    </div>
                                    <el-radio-group v-model="qrorigin"
                                                    @change="changeEvent('qrCodePos', qrorigin)">
                                        <el-radio-button label="LEFT,TOP">左上</el-radio-button>
                                        <el-radio-button label="LEFT,BOTTOM">左下</el-radio-button>
                                        <el-radio-button label="RIGHT,TOP">右上</el-radio-button>
                                        <el-radio-button label="RIGHT,BOTTOM">右下</el-radio-button>
                                    </el-radio-group>
                                </div>
                                <div style="display:inline-block;">
                                    <div class="xmmFolderName">
                                        X[mm]：
                                    </div>
                                    <input type="text"
                                           class="input"
                                           maxlength="5"
                                           oninput="value=value.replace(/[^\d.]/g,'').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')"
                                           v-model="qrCodePos.x"
                                           @blur="onRodeChange($event,'qrCodePos.x')">
                                    <div class="ymmFolderName">
                                        Y[mm]：
                                    </div>
                                    <input type="text"
                                           class="input"
                                           maxlength="5"
                                           oninput="value=value.replace(/[^\d.]/g,'').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')"
                                           v-model="qrCodePos.y"
                                           @blur="onRodeChange($event,'qrCodePos.y')">
                                </div>
                            </div>
                            <div class="informationFilesSelected"
                                 style="margin:0px 7px;padding:7px 0px;border-bottom: 1px solid #bebebe;">
                                <div style="display:inline-block;width:256px;padding-left: 4px;">
                                    <div class="folderName">
                                        サイズ：
                                    </div>
                                    <el-radio-group v-model="qrCodePos.size"
                                                    @change="changeSize()">
                                        <el-radio-button label="SMALL">小</el-radio-button>
                                        <el-radio-button label="MIDDLE">中</el-radio-button>
                                        <el-radio-button label="BIG">大</el-radio-button>
                                    </el-radio-group>
                                </div>
                                <div class="whFolderName"
                                     style="display:inline-block;">
                                    <div class="wmmFolderName">
                                        W[mm]：
                                    </div>
                                    <input type="text"
                                           class="input"
                                           disabled="disabled"
                                           v-model="qrCodePos.w"
                                           style="color:#707070;">
                                    <div class="folderName">
                                        H[mm]：
                                    </div>
                                    <input type="text"
                                           class="input"
                                           disabled="disabled"
                                           v-model="qrCodePos.h"
                                           style="color:#707070;">
                                </div>
                            </div>
                        </div>
                        <div class="url">
                            <span class="head">
                                url
                            </span>
                            <div class="informationFilesSelected"
                                 style="padding-left: 23px;">
                                <div>
                                    <div class="folderName">
                                        起点：
                                    </div>
                                    <el-radio-group v-model="urlorigin"
                                                    @change="changeEvent('qrUrlPos', urlorigin)">
                                        <el-radio-button label="LEFT,TOP">左上</el-radio-button>
                                        <el-radio-button label="LEFT,BOTTOM">左下</el-radio-button>
                                        <el-radio-button label="RIGHT,TOP">右上</el-radio-button>
                                        <el-radio-button label="RIGHT,BOTTOM">右下</el-radio-button>
                                    </el-radio-group>
                                    <div class="secontXFolderName">
                                        X[mm]：
                                    </div>
                                    <input type="text"
                                           class="input"
                                           maxlength="5"
                                           oninput="value=value.replace(/[^\d.]/g,'').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')"
                                           v-model="qrUrlPos.x"
                                           @blur="onRodeChange($event,'qrUrlPos.x')">
                                    <div class="secontYFolderName">
                                        Y[mm]：
                                    </div>
                                    <input type="text"
                                           class="input"
                                           maxlength="5"
                                           oninput="value=value.replace(/[^\d.]/g,'').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')"
                                           v-model="qrUrlPos.y"
                                           @blur="onRodeChange($event,'qrUrlPos.y')">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="others">
                    <div class="informationFilesSelected">
                        <div class="folderName"
                             style="width:110px">
                            上書き：
                        </div>
                        <el-radio-group v-model="rewriteFlag">
                            <el-radio-button label="true">する</el-radio-button>
                            <el-radio-button label="false">しない</el-radio-button>
                        </el-radio-group>
                        <span class="head"
                              style="margin-left: 5px;margin-top: 10px;color: #FF0000;">※QR付きPDFを上書きします</span>
                    </div>
                    <div class="informationFilesSelected"
                         style="position: relative;">
                        <div class="folderName"
                             style="width:110px">
                            プリセットに登録：
                        </div>
                        <el-radio-group v-model="saveSetting">
                            <el-radio-button label="true">する</el-radio-button>
                            <el-radio-button label="false">しない</el-radio-button>
                        </el-radio-group>
                        <span class="head"
                              style="margin-left: 5px;margin-top: 10px;color: #FF0000;">※選択中のプリセットに上書きします</span>
                        <el-button type="primary"
                                   @click="qr">作成</el-button>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import bus from '@c/bus.js'

export default {
    name: 'PdfCreating',
    data () {
        return {
            dialogVisible: false,
            loading: false,
            qrCodePos: {vAlign: '', hAlign: '', size: '', x: '', y: '', w: '', h: ''},
            qrUrlPos: {vAlign: '', hAlign: '', x: '', y: ''},
            settingName: '',
            urlorigin: 'LEFT,TOP',
            qrorigin: 'LEFT,TOP',
            rewriteFlag: 'true',
            saveSetting: 'true',
            no: '',
            data: [],
            model: ''
        }
    },

    methods: {
        pdfCreating (data) {
            this.dialogVisible = true
            this.no = data
            this.qrDefault()
        },
        changeEvent (type, d) {
            const data = d.split(',')// 在每个逗号(,)处进行分解。
            if (type === 'qrCodePos') {
                this.qrCodePos.hAlign = data[0]
                this.qrCodePos.vAlign = data[1]
            } else if (type === 'qrUrlPos') {
                this.qrUrlPos.hAlign = data[0]
                this.qrUrlPos.vAlign = data[1]
            }
        },
        changeSetting (settingName) {
            const index = settingName - 1
            this.settingName = this.data[index].settingName
            this.qrCodePos = {vAlign: this.data[index].qrVAlign, hAlign: this.data[index].qrHAlign, size: this.data[index].size, x: this.data[index].qrX, y: this.data[index].qrY, w: '', h: ''}
            this.qrUrlPos = {vAlign: this.data[index].urlVAlign, hAlign: this.data[index].urlHAlign, x: this.data[index].urlX, y: this.data[index].urlY}
            this.qrorigin = this.data[index].qrHAlign + ',' + this.data[index].qrVAlign
            this.urlorigin = this.data[index].urlHAlign + ',' + this.data[index].urlVAlign
            this.changeSize()
        },
        changeData (body) {
            this.data[body.settingName - 1] = body
        },
        changeSize () {
            if (this.qrCodePos.size === 'SMALL') {
                this.qrCodePos.w = 14
                this.qrCodePos.h = 14
            } else if (this.qrCodePos.size === 'MIDDLE') {
                this.qrCodePos.w = 20.5
                this.qrCodePos.h = 20.5
            } else if (this.qrCodePos.size === 'BIG') {
                this.qrCodePos.w = 27.5
                this.qrCodePos.h = 27.5
            }
        },
        qr () {
            this.qrCode()
            if (this.saveSetting === 'true') {
                setTimeout(() => {
                    this.qrDefaultUpdate()
                }, 300)
            }
        },
        // QRコード作成のデフォルト設定クエリ
        qrDefault () {
            this.loading = true
            this.$request.folder.QrDefault('').then(response => {
                console.log('QrDefault - get请求成功:', response.status, response.statusText)
                this.loading = false
                const data = this.$request.CODE(response.data)
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    this.data = data.result
                    console.log(this.data)
                    this.changeSetting(1)
                } else if (data && data === 'getProjects') {
                    // 重新获取项目数据
                    bus.$emit('getProjects')
                }
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.qrDefault() : ''
                    })
                } else {
                    this.$request.requestError('QrDefault-get请求失败:', err)
                }
            })
        },
        // qr做成
        qrCode () {
            this.loading = true
            const body = (`{"rewriteFlag":"${this.rewriteFlag}","urlVAlign":"${this.qrUrlPos.vAlign}","urlHAlign":"${this.qrUrlPos.hAlign}","urlX":"${this.qrUrlPos.x}","urlY":"${this.qrUrlPos.y}","qrVAlign": "${this.qrCodePos.vAlign}","qrHAlign": "${this.qrCodePos.hAlign}","qrX": "${this.qrCodePos.x}","qrY": "${this.qrCodePos.y}","size": "${this.qrCodePos.size}"}`)
            this.$request.folder.QrCode(this.no, body).then(response => {
                console.log('QrCode-post请求成功:', response.status, response.statusText)
                const data = this.$request.CODE(response.data)
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    this.$message.success('做成完了')
                    this.loading = false
                } else if (data && data === 'getProjects') {
                    // 重新获取项目数据
                    bus.$emit('getProjects')
                }
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.qrCode() : ''
                    })
                } else {
                    this.$request.requestError('QrCode-post请求失败', err)
                }
            })
        },
        // QRコード作成のデフォルト設定が更新されます。
        qrDefaultUpdate () {
            this.loading = true
            const body = (`{"settingName": "${this.settingName}","urlHAlign":"${this.qrUrlPos.hAlign}","urlVAlign":"${this.qrUrlPos.vAlign}","urlX":"${this.qrUrlPos.x}","urlY":"${this.qrUrlPos.y}","qrHAlign": "${this.qrCodePos.hAlign}","qrVAlign": "${this.qrCodePos.vAlign}","qrX": "${this.qrCodePos.x}","qrY": "${this.qrCodePos.y}","size": "${this.qrCodePos.size}"}`)
            this.$request.folder.QrDefaultUpdate(body).then(response => {
                console.log('QrDefaultUpdate-post请求成功:', response.status, response.statusText)
                const data = this.$request.CODE(response.data)
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    this.$message.success('更新完了')
                    this.loading = false
                    this.changeData(JSON.parse(body))
                } else if (data && data === 'getProjects') {
                    // 重新获取项目数据
                    bus.$emit('getProjects')
                }
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.qrDefaultUpdate() : ''
                    })
                } else {
                    this.$request.requestError('QrDefaultUpdate-post请求失败', err)
                }
            })
        },
        onRodeChange (event, model) {
            if (event.target.value === 0 || event.target.value === '') {
                if (model === 'qrCodePos.x') {
                    this.qrCodePos.x = 0
                } else if (model === 'qrCodePos.y') {
                    this.qrCodePos.y = 0
                } else if (model === 'qrUrlPos.x') {
                    this.qrUrlPos.x = 0
                } else if (model === 'qrUrlPos.y') {
                    this.qrUrlPos.y = 0
                }
            }
        },
        // 右上角关闭按钮的事件
        close () {
            this.dialogVisible = false
            if (this.loading) {
                this.$confirm('リクエストデータでは,クローズを確認する？')
                    .then(() => {
                        // eslint-disable-next-line no-undef
                        done()
                    })
                    .catch(() => {})
            } else {
                this.dialogVisible = false
            }
        }
    }

}
</script>
<style lang="less" scoped>
@import url("../../less/components/HeadComponents/PDFCreating.less");
</style>
