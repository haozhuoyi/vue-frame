<template>
    <div id="upload"
         v-show="uploadShow"
         v-loading="loading"
         :element-loading-text="$t('common.DISPLAY_UNDER_READING')"
         element-loading-spinner="el-icon-loading"
         element-loading-background="rgba(255,255,255,.4)">
        <div class="fileTitle">{{ $t('upload.DISPLAY_UPLOAD_FILE_LIST') }}</div>
        <input type="file"
               :webkitdirectory="webkitdirectory"
               multiple
               id="file"
               @change="change" />
        <div class="body">
            <BodyTable v-if="filesTreeList.length>0"
                       :files-tree-list="filesTreeList"
                       @deleteUploadedFiles="deleteUploadedFiles"></BodyTable>
            <p v-else>{{ $t('upload.DISPLAY_UPLOAD_FILE_LIST_SHOW') }}</p>
        </div>

        <!-- 上書き確認 -->
        <CoverToConfirm ref="CoverToConfirm"
                        @upload="uploadFoler"
                        @uploadMisc="uploadMisc"></CoverToConfirm>
    </div>
</template>

<script>
import bus from '@c/bus'
import md5 from 'js-md5'
import axios from 'axios'
import $ from 'jquery'
import Crypto from '@/utils/crypto'

export default {
    name: 'Upload',
    components: {
        CoverToConfirm: () => import('@c/Uploader/CoverToConfirm.vue'),
        BodyTable: () => import('@c/Uploader/BodyTable.vue')
    },
    data () {
        return {
            loading: false,
            uploadShow: false, // 显示上传组件
            webkitdirectory: false, // 是否上传文件夹
            onLine: false,
            no: '', // 上传的文件夹NO
            target: '', // 上传URL
            uploadId: '', // 分片上传的特使标志
            id: '', // 上传文件的随机id
            chunkSize: 0.99 * 1024 * 1024,
            params: {}, // 请求参数
            filesList: [], // 文件列表
            filesTreeList: [],
            chunkList: [], // 分片,
            filesListIndex: 0, // 当前文件
            chunkListIndex: 0, // 当前分片
            cancel: null, // ajax请求
            fileType: [] // 空文件夹
        }
    },
    watch: {
        $route (to) {
            if (to.path === '/login') {
                this.uploadShow = false
            }
        }
    },
    mounted () {
        this.$nextTick(() => {
            const that = this
            // 正常アップロード
            bus.$on('openUpload', query => {
                that.no = parseInt(query.NO) === -1 ? 1 : query.NO
                const time = new Date().getTime()
                const signature = md5(`Body=&Timestamp=${time}3d4f2bf07dc1be38b20cd6e46949a1071f9d0e3d`)
                const commonParametersPost =
                    'ApplicationID=10000&Format=JSON&Signature=' + signature +
                    '&SignatureVersion=1.0&Timestamp=' + time +
                    '&access_token=' + this.$store.getters.getToken.access_token + ''
                that.target = `/api/S3MetaDatas/${that.no}/File?${commonParametersPost}`
                that.webkitdirectory = query.webkitdirectory
                that.uploadShow = true
                $(`.body`).scrollTop(0)

                if (that.onLine) {
                    that.$message.warning(this.$t('upload.MESSAGE_UPLOADING_FILE_DO_OTHER_RELATED_OTHER_OPERATION'))
                    return
                } else {
                    document.getElementById('file').value = ''
                    setTimeout(() => {
                        document.getElementById('file').click()
                    }, 300)
                }
            })
            // ドラッグアップロード
            bus.$on('uploadFile', files => {
                if (that.onLine) {
                    that.$message.warning(this.$t('upload.MESSAGE_UPLOADING_FILE_DO_OTHER_RELATED_OTHER_OPERATION'))
                    return
                }
                if (files.isDirectory && files.isFile) {
                    that.$message.warning(this.$t('upload.MESSAGE_CANNOT_UPLOAD_FILE_TYPE'))
                    return
                }
                that.no = parseInt(files.NO) === -1 ? 1 : files.NO
                const time = new Date().getTime()
                const signature = md5(`Body=&Timestamp=${time}3d4f2bf07dc1be38b20cd6e46949a1071f9d0e3d`)
                const commonParametersPost =
                    'ApplicationID=10000&Format=JSON&Signature=' + signature +
                    '&SignatureVersion=1.0&Timestamp=' + time +
                    '&access_token=' + this.$store.getters.getToken.access_token + ''
                that.target = `/api/S3MetaDatas/${that.no}/File?${commonParametersPost}`
                that.fileType = files.misc
                if (!files.isDirectory && files.isFile) {
                    that.webkitdirectory = false
                    that.change(files.scanFiles)
                }
                if (files.isDirectory && !files.isFile) {
                    that.webkitdirectory = true
                    that.change(files.scanFolders)
                }
                console.log(files)
                that.uploadShow = true
                $(`.body`).scrollTop(0)
            })
            bus.$on('showUplaod', () => {
                that.uploadShow = !that.uploadShow
                if (!that.uploadShow) {
                    const docu = document.getElementById('bodyTable')
                    const display = docu ? docu.querySelectorAll('tr') : []
                    for (let index = 0; index < display.length; index++) {
                        if (display[index].children.length === 4 && display[index].children[3].innerHTML === '完了') {
                            display[index].remove()
                        }
                    }
                    if (that.webkitdirectory && $('.bodyTable tr').length === 0) {
                        $('.bodyTable').remove()
                        that.filesList = []
                        that.filesTreeList = []
                    }
                }
            })
        })
    },
    methods: {
        change (event) {
            const that = this
            const fullPaths = []
            const files = event.target ? event.target.files : event
            console.log(files)
            that.filesList = []
            that.chunkListIndex = 0
            that.filesListIndex = 0
            if (files.length <= 0) {
                that.uploadShow = false
                if (that.fileType.length > 0) {
                    for (let index = 0; index < that.fileType.length; index++) {
                        that.miscDetect(that.fileType[index], index + 1, that.fileType.length)
                    }
                } else {
                    return
                }
            }
            if (event.target) {
                for (let index = 0; index < files.length; index++) {
                    if (files[index].size / 1024 / 1024 / 1024 > 2) {
                        that.$message.warning(this.$t('upload.MESSAGE_UPLOAD_FILE_SIZE_LIMIT'))
                    } else {
                        const time = new Date().getTime()
                        that.filesList.push({
                            id: Math.random() * time,
                            fullPath: files[index].webkitRelativePath || files[index].name,
                            name: files[index].name,
                            size: files[index].size,
                            file: files[index]
                        })
                    }
                    fullPaths.push(files[index].webkitRelativePath || files[index].name)
                }
            } else {
                for (let index = 0; index < files.length; index++) {
                    if (files[index].size / 1024 / 1024 / 1024 > 2) {
                        that.$message.warning(this.$t('upload.MESSAGE_UPLOAD_FILE_SIZE_LIMIT'))
                    } else {
                        that.filesList.push(files[index])
                    }
                    fullPaths.push(files[index].fullPath)
                }
            }
            that.filesTreeList =
                    that.setTreeData([], that.filesList, that.treeify(that.getCatalogPath(fullPaths)).children)
            console.log(that.filesTreeList)
            if (that.filesList.length === 0 && that.onLine) return
            if (!that.onLine) {
                if (that.webkitdirectory) {
                    that.folderDetect(that.filesList[0])
                } else {
                    that.fileDetect(that.filesList[0])
                }
            }
        },
        // アップロード前 --- folder
        folderDetect (file) {
            this.onLine = true
            this.loading = true
            const body = (`{"fileName":"${encodeURIComponent(this.filesTreeList[0].title)}","fileType":"false","fileSize":"0"}`)
            this.$request.folder.Detect(this.no, body, 'FileDetect').then(response => {
                const data = this.$request.CODE(response.data)
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    this.fileDetect(file)
                }
            }).catch(err => {
                this.onLine = false
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.folderDetect(file) : ''
                    })
                } else {
                    $('.buttonTd').html('<p style="color: red;">験証失敗</p>')
                    this.$request.requestError('FolderDetect-get请求失败', err)
                }
            })
        },
        // アップロード前 --- folder
        fileDetect (file) {
            this.onLine = true
            this.loading = true
            const body = (`{"fileName":"${encodeURIComponent(file.fullPath)}","fileType":"false","fileSize":"${this.filesTreeList[0].size}"}`)
            this.$request.folder.Detect(this.no, body, 'FileDetect').then(res => {
                if (res.data.code === 0) {
                    if (res.data.result.fileSize < file.size) {
                        this.onLine = false
                        this.loading = false
                        this.$message.warning(this.$t('upload.MESSAGE_LACK_OF_CAPACITY'))
                        this.nextFile()
                        return
                    }
                    if (res.data.result.file) {
                        if (this.webkitdirectory) {
                            const peixia = JSON.parse(sessionStorage.getItem(this.filesTreeList[0].title))
                            if (peixia) { // 是否陪下
                                if (peixia.all === 2) { // 1: 是(之后不跳) 2: 否(一直跳)
                                    this.$refs.CoverToConfirm.coverToConfirmDialog(file, this.webkitdirectory)
                                } else {
                                    this.uploadFile(file, true)
                                }
                            } else {
                                this.$refs.CoverToConfirm.coverToConfirmDialog(file, this.webkitdirectory)
                            }
                        } else {
                            this.$refs.CoverToConfirm.coverToConfirmDialog(file, this.webkitdirectory)
                        }
                    } else {
                        this.uploadFile(file, false)
                    }
                } else {
                    this.nextFile()
                    this.$message({message: res.data.message, type: 'warning'})
                }
                this.onLine = false
                this.loading = false
            }).catch(err => {
                this.onLine = false
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.fileDetect(file) : ''
                    })
                } else {
                    if (this.webkitdirectory) {
                        if (this.filesList.length === this.filesListIndex + 1) {
                            sessionStorage.removeItem(this.filesTreeList[0].title)
                        }
                    } else {
                        sessionStorage.removeItem(file.id)
                    }
                    this.nextFile()
                    document.getElementsByClassName(`bodyTableTd${file.id}`)[0].innerHTML = '験証失敗'
                    document.getElementsByClassName(`bodyTableTd${file.id}`)[0].style.color = 'red'
                    this.$request.requestError('FileDetect-get请求失败', err)
                }
            })
        },
        // アップロード前 --- misc（空文件夹）
        miscDetect (fullPath, index, length) {
            console.log(fullPath, index, length)
            this.onLine = true
            this.loading = true
            const body = (`{"fileName":"${encodeURIComponent(fullPath)}","fileType":"true","fileSize":"0"}`)
            this.$request.folder.Detect(this.no, body, 'FileDetect').then(res => {
                if (res.data.code === 0) {
                    if (res.data.result.file) {
                        const peixia = JSON.parse(sessionStorage.getItem(this.filesTreeList[0].title))
                        if (peixia) { // 是否陪下
                            if (peixia.all === 2) { // 1: 是(之后不跳) 2: 否(一直跳)
                                this.$refs.CoverToConfirm.coverToConfirmDialog({
                                    fullPath, name: fullPath,
                                    index, length
                                }, this.webkitdirectory)
                            } else {
                                this.uploadMisc({ fullPath, name: fullPath, index, length }, true)
                            }
                        } else {
                            this.$refs.CoverToConfirm.coverToConfirmDialog({
                                fullPath, name: fullPath
                            }, this.webkitdirectory)
                        }
                    } else {
                        this.uploadMisc({ fullPath, name: fullPath, index, length }, false)
                    }
                } else {
                    this.$message({message: res.data.message, type: 'warning'})
                }
                this.onLine = false
                this.loading = false
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.miscDetect(fullPath, index, length) : ''
                    })
                } else {
                    this.onLine = false
                    if (index === length) {
                        sessionStorage.removeItem(fullPath/* this.filesTreeList[0].title */)
                    }
                    this.$request.requestError('miscDetect-get请求失败', err)
                }
            })
        },
        // uploadFile
        uploadFile (file, bool = false) {
            this.id = file.id
            if (file.file.size > this.chunkSize) {
                this.chunkList = this.splitBlob(file.file, this.chunkSize)
            } else {
                this.chunkList = [file.file]
            }
            this.chunkUplaod(
                this.chunkList[this.chunkListIndex], file, this.chunkListIndex, this.chunkList.length, bool)
        },
        // uploadFoler
        uploadFoler (file, formLabelAlign, all) {
            this.id = file.id
            if (file.file.size > this.chunkSize) {
                this.chunkList = this.splitBlob(file.file, this.chunkSize)
            } else {
                this.chunkList = [file.file]
            }
            sessionStorage.setItem(this.webkitdirectory ? this.filesTreeList[0].title : file.id, JSON.stringify({
                all,
                params: {
                    'MemoFLG': formLabelAlign.note === 1 ? 'TRUE' : 'FALSE', // 手书memo，印章，文本信息 是否保存，默认为true
                    'ContentsFLG': formLabelAlign.photo === 1 ? 'TRUE' : 'FALSE', // 文件上写真，pin情报，pin内的写真 是否保存 默认为true
                    'MeasureFLG': formLabelAlign.measureddata === 1 ? 'TRUE' : 'FALSE' // 测定数据是否保存  默认为true
                }
            }))
            this.chunkUplaod(
                this.chunkList[this.chunkListIndex], file, this.chunkListIndex, this.chunkList.length, true)
        },
        // uploadMisc
        uploadMisc (file, formLabelAlign, all, bool = false) {
            this.onLine = true
            this.loading = true
            sessionStorage.setItem(file.fullPath, JSON.stringify({
                all,
                params: {
                    'MemoFLG': formLabelAlign.note === 1 ? 'TRUE' : 'FALSE', // 手书memo，印章，文本信息 是否保存，默认为true
                    'ContentsFLG': formLabelAlign.photo === 1 ? 'TRUE' : 'FALSE', // 文件上写真，pin情报，pin内的写真 是否保存 默认为true
                    'MeasureFLG': formLabelAlign.measureddata === 1 ? 'TRUE' : 'FALSE' // 测定数据是否保存  默认为true
                }
            }))
            const formData = new FormData()
            formData.append('fileName', file.fullPath) // 文件名字
            formData.append('fileType', true)
            formData.append('MemoFLG', formLabelAlign.note === 1 ? 'TRUE' : 'FALSE')
            formData.append('ContentsFLG', formLabelAlign.photo === 1 ? 'TRUE' : 'FALSE')
            formData.append('MeasureFLG', formLabelAlign.measureddata === 1 ? 'TRUE' : 'FALSE')
            formData.append('coverFlag', bool)

            axios(this.target, {
                method: 'post',
                data: formData,
                header: {'Content-Type': 'multipart/form-data'}
            }).then(response => {
                const data = this.$request.CODE(response.data)
                if (Object.prototype.toString.call(data) === '[object Object]'(data) === '[object Object]') {
                    this.loading = false
                    if (file.index === file.length) {
                        sessionStorage.removeItem(file.fullPath)
                        bus.$emit('fileSuccess', {
                            NO: this.no,
                            S3NO: [data.result.S3NO],
                            webkitdirectory: this.webkitdirectory
                        })
                        this.onLine = false
                        this.loading = false
                    }
                }
            }).catch(err => {
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.uploadMisc(file, formLabelAlign, all, bool) : ''
                    })
                } else {
                    if (file.index === file.length) {
                        this.onLine = false
                        this.loading = false
                        sessionStorage.removeItem(file.fullPath)
                    }
                    this.$request.requestError('新建misc请求失败', err, true)
                }
            })
        },
        // 分割してアップロードする
        async chunkUplaod (chunk, blob, chunkListIndex, totalChunks, bool) {
            $(`.body`).scrollTop(document.getElementsByClassName('body')[0].scrollTop + 32)
            const that = this
            const formData = new FormData()
            formData.append('file', chunk) // 文件数据
            formData.append('fileName', blob.fullPath || blob.webkitRelativePath || blob.name.split('/')) // 文件名字
            formData.append('chunkNumber', chunkListIndex + 1) // 当前分片数
            // formData.append('chunkSize', 0.5 * 1024 * 1024) // 分片大小
            // formData.append('currentChunkSize', chunk.size) // 当前分片大小
            formData.append('totalChunks', totalChunks) // 总分片数
            formData.append('totalSize', blob.size) // 文件总大小
            formData.append('uploadId', this.uploadId || '')
            formData.append('fileType', false)

            if (bool) {
                const params = !this.webkitdirectory ? JSON.parse(sessionStorage.getItem(blob.id)).params
                    : JSON.parse(sessionStorage.getItem(blob.fullPath.split('/')[0])).params
                formData.append('MemoFLG', params.MemoFLG)
                formData.append('ContentsFLG', params.ContentsFLG)
                formData.append('MeasureFLG', params.MeasureFLG)
                formData.append('coverFlag', bool)
            }
            that.err = ''
            that.onLine = true
            const CancelToken = axios.CancelToken
            await axios(this.target, {
                method: 'post',
                data: formData,
                header: {'Content-Type': 'multipart/form-data'},
                cancelToken: new CancelToken(function executor (c) {
                    that.cancel = c
                })
            }).then(response => {
                that.onLine = false
                if (response.data.code === 0) {
                    that.uploadId = response.data.result.uploadId
                    that.setPercent(blob.id, Math.floor((chunkListIndex + 1) / totalChunks * 100) / 100 * 100)
                    if (chunkListIndex + 1 === totalChunks) {
                        this.domOperations(blob.id, '完了', false/* , 'none' */)
                        that.uploadId = ''
                        if (!this.webkitdirectory) {
                            sessionStorage.removeItem(blob.id)
                            this.nextFile()
                            bus.$emit('fileSuccess', {
                                NO: this.no,
                                S3NO: [response.data.result.S3NO],
                                webkitdirectory: this.webkitdirectory
                            })
                        } else {
                            if (this.filesList.length === this.filesListIndex + 1) {
                                bus.$emit('fileSuccess', {
                                    NO: this.no,
                                    S3NO: [response.data.result.S3NO],
                                    webkitdirectory: this.webkitdirectory
                                })
                                if (this.fileType.length > 0) {
                                    for (let index = 0; index < this.fileType.length; index++) {
                                        this.miscDetect(this.fileType[index], index + 1, this.fileType.length)
                                    }
                                } else {
                                    sessionStorage.removeItem(this.filesTreeList[0].title)
                                }
                            } else {
                                this.nextFile()
                                bus.$emit('fileSuccess', {
                                    NO: this.no,
                                    S3NO: [response.data.result.S3NO],
                                    webkitdirectory: this.webkitdirectory
                                })
                            }
                        }
                    } else {
                        this.chunkListIndex += 1
                        this.uploadFile(blob, bool)
                    }
                    return
                } else if (response.data.code === -20008 || response.data.code === -20009) {
                    this.$message.error(response.data.message)
                    this.domOperations(blob.id, '失敗', 'red')
                    sessionStorage.removeItem(blob.id)
                } else if (response.data.code <= -20000 || response.data.code > 200) {
                    this.$message.error(response.data.message)
                    this.domOperations(blob.id, '失敗', 'red')
                    sessionStorage.removeItem(blob.id)
                } else {
                    this.$message.error('Server Exception')
                    this.domOperations(blob.id, '失敗', 'red')
                    sessionStorage.removeItem(blob.id)
                }
                this.nextFile()
            }).catch(err => {
                console.log(err)
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.qrDefaultUpdate() : ''
                    })
                } else {
                    that.onLine = false
                    if (err.status === 401) {
                        this.$request.login.refreshToken().then(response => {
                            response ? this.chunkUplaod(chunk, blob, chunkListIndex, totalChunks, bool) : ''
                        })
                    }
                    if (this.err === 'アップロードを取り消す') {
                        if (this.filesList.length > 0) {
                            this.blobSplitHandle(this.filesList[this.filesListIndex])
                        }
                    } else {
                        this.err === 'アップロードエラー'
                        this.domOperations(blob.id, '失敗', 'red')
                        this.nextFile()
                    }
                }
            })
        },
        // 書類を分割する
        splitBlob (file, chunkSize) {
            if (!chunkSize || file.size <= chunkSize) return [file]
            const chunkList = []
            const filesize = file.size
            let start = 0
            let end = 0
            while (start < filesize) {
                end = start + chunkSize
                if (end > filesize) end = filesize
                const chunk = file.slice(start, end)
                chunkList.push(chunk)
                start = end
            }
            return chunkList
        },
        // アップロードされたファイルを削除する
        deleteUploadedFiles (id) {
            if (id === this.id) {
                this.err = 'アップロードを取り消す'
                this.cancel('アップロードを取り消す')
                this.chunkListIndex = 0
                this.onLine = false
            }
            const filesList = this.filesList.filter(data => {
                return data.id !== id
            })
            this.filesList = filesList
            this.deletefilesTreeList(id, this.filesTreeList)
            if (this.webkitdirectory) {
                setTimeout(() => {
                    if ($('.bodyTable tr').length === 0) {
                        this.filesList = []
                        this.filesTreeList = this.filesList
                    }
                }, 100)
            }
        },
        deletefilesTreeList (id, filesTreeList) {
            for (let index = filesTreeList.length - 1; index >= 0; index--) {
                if (filesTreeList[index].isDir) {
                    this.deletefilesTreeList(id, filesTreeList[index].children)
                } else {
                    if (filesTreeList[index].id === id) {
                        filesTreeList.splice(index, 1)
                        return
                    }
                }
            }
        },
        // プログレスバー(进度条)
        setPercent (id, percent) {
            const color = ['#2D64A0', 'white']
            const data = [percent, 100 - percent]

            const canvas = document.getElementById(`canvasDemo${id}`)
            const ctx = canvas.getContext('2d')
            let startPoint = 0
            for (let i = 0; i < data.length; i++) {
                ctx.fillStyle = color[i]
                ctx.beginPath()
                ctx.moveTo(10, 10)
                ctx.arc(10, 10, 10, startPoint, startPoint + Math.PI * 2 * (data[i] / 100), false)
                ctx.fill()
                startPoint += Math.PI * 2 * (data[i] / 100)
            }
        },
        // html DOM 操作
        domOperations (id, innerHTML, color, display = '') {
            if (innerHTML) {
                if (innerHTML === '完了') this.$message.success(this.$t('upload.MESSAGE_UPLOAD_SUCCESS'))
                document.getElementsByClassName(`bodyTableTd${id}`)[0].innerHTML = innerHTML
                document.getElementsByClassName(`bodyTableTd${id}`)[0].style.cursor = 'pointer'
            }
            if (color) document.getElementsByClassName(`bodyTableTd${id}`)[0].style.color = color
            if (display) document.getElementsByClassName(`bodyTableTr${id}`)[0].remove()/* .style.display = display */
        },
        // 次の書類
        nextFile () {
            this.chunkListIndex = 0
            this.uploadId = ''
            if (this.filesList.length > this.filesListIndex + 1) {
                this.filesListIndex += 1
                if (this.webkitdirectory) {
                    // if (JSON.parse(sessionStorage.getItem('FolderCheck'))) {
                    this.fileDetect(this.filesList[this.filesListIndex])
                    // } else {
                    //     this.uploadFile(this.filesList[this.filesListIndex])
                    // }
                } else {
                    this.loading = true
                    this.fileDetect(this.filesList[this.filesListIndex])
                }
            } else if (this.fileType.length > 0) {
                for (let index = 0; index < this.fileType.length; index++) {
                    this.miscDetect(this.fileType[index], index + 1, this.fileType.length)
                }
            }
        },
        // 解析出目录路径
        getCatalogPath (nodeList) {
            const newNodeList = []
            for (let i = 0; i < nodeList.length; i++) {
                const pathNameArr = nodeList[i].split('/')
                let pathNameCatalog = ''
                if (pathNameArr.length > 1) {
                    for (let y = 0; y < pathNameArr.length; y++) {
                        if (pathNameArr[pathNameArr.length - 1]) {
                            if (y === pathNameArr.length - 1) {
                                pathNameCatalog = pathNameCatalog + pathNameArr[y]
                            } else {
                                pathNameCatalog = pathNameCatalog + pathNameArr[y] + '/'
                            }
                            let flag = false
                            if (newNodeList.length > 0) {
                                for (let d = 0; d < newNodeList.length; d++) {
                                    if (newNodeList[d] === pathNameCatalog) {
                                        flag = true
                                        break
                                    }
                                }
                                if (!flag) {
                                    newNodeList.push(pathNameCatalog)
                                }
                            } else {
                                newNodeList.push(pathNameCatalog)
                            }
                        }
                    }
                } else {
                    newNodeList.push(nodeList[i])
                }
            }
            return newNodeList
        },
        // 根据目录路径生成目录结构
        treeify (nodeList) {
            // const treeify = (nodeList) => {
            const root = {
                key: 1,
                children: []
            }
            // 生成节点信息按层级
            const nodeInLevel = []
            nodeList.forEach(t => {
                const pathInfoList = t.split('/')
                let isDir = true
                if (pathInfoList[pathInfoList.length - 1]) {
                    isDir = false
                }
                const key = (Math.random() + '').split('.')[1] * 1
                const title = isDir ? pathInfoList[pathInfoList.length - 2] : pathInfoList[pathInfoList.length - 1]
                const level = isDir ? pathInfoList.length - 2 : pathInfoList.length - 1
                // collet it
                nodeInLevel[level] = nodeInLevel[level] || []
                nodeInLevel[level].push({
                    _originPath: t,
                    _pathInfo: pathInfoList,
                    _patName: level === 0 ? '/' : isDir ? pathInfoList[pathInfoList.length - 3] : pathInfoList[pathInfoList.length - 2],
                    isDir,
                    children: isDir ? [] : null,
                    key,
                    title
                })
            })
            // 广度排,按每层级
            const getNodeCot = (node, level, root) => {
                const {_patName} = node
                let curCot = null
                if (level === 0) {
                    curCot = root.children
                } else {
                    const pat = nodeInLevel[level - 1].find(t => t.isDir && t.title === _patName)
                    if (!pat) {
                        throw new Error(
                            `Node ${node._originPath} cant find parent ${_patName}`
                        )
                    }
                    return pat.children
                }
                return curCot
            }
            const maxLevel = nodeInLevel.length
            for (let level = 0; level < maxLevel; level++) {
                nodeInLevel[level].forEach(node => {
                    const curCot = getNodeCot(node, level, root)
                    curCot.push(node)
                })
            }
            return root
        },
        // 根据生成的目录结构构建文件树结构
        setTreeData (list, filesTreeList, nodeList) {
            for (let i = 0; i < nodeList.length; i++) { // 循环文件夹结构
                if (nodeList[i].isDir) {
                    list[i] = {
                        children: [],
                        id: Crypto.encrypt(nodeList[i]._originPath),
                        title: nodeList[i].title,
                        isDir: nodeList[i].isDir,
                        _originPath: nodeList[i]._originPath,
                        _patName: nodeList[i]._patName,
                        _pathInfo: nodeList[i]._pathInfo
                    }
                    this.setTreeData(list[i].children, filesTreeList, nodeList[i].children)
                } else {
                    const data = filesTreeList.filter(d => {
                        return d.fullPath === nodeList[i]._originPath
                    })
                    list[i] = {
                        id: data[0].id,
                        fullPath: data[0].fullPath,
                        name: data[0].name,
                        size: data[0].size,
                        file: data[0].file,
                        title: nodeList[i].title,
                        isDir: nodeList[i].isDir,
                        parentPathCrypto: Crypto.encrypt(nodeList[i]._pathInfo.splice(0, nodeList[i]._pathInfo.length - 1).toString().replace(/\,/g, '/') + '/'),
                        _originPath: nodeList[i]._originPath,
                        _patName: nodeList[i]._patName,
                        _pathInfo: nodeList[i]._pathInfo
                    }
                }
            }
            // console.log(list)
            return list
        }
    }
}
</script>

<style lang="less" scoped>
@import url("../../less/components/Uploader/Upload.less");
</style>
