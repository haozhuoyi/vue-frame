<template>
    <div id="transformation">
        <el-dialog :title="$t('transformation.DISPLAY_SETTING_TRANSFORMATION_TITLE')"
                   :visible.sync="transformationView"
                   :show-close="true"
                   :close-on-click-modal="false"
                   :before-close="close"
                   :destroy-on-close="true"
                   append-to-body
                   class="transformation"
                   v-loading="loading"
                   :element-loading-text="$t('common.DISPLAY_UNDER_READING')"
                   element-loading-spinner="el-icon-loading"
                   element-loading-background="rgba(255,255,255,.4)">
            <div class="dtransformation">
                <el-collapse v-model="activeNames">
                    <!-- @change="handleChange"> -->
                    <div v-for="(item, index) in transformationData"
                         :key="index">
                        <p class="firstTitle">{{ item.headline }}</p>
                        <el-collapse-item v-for="(collapseItem, collapseIndex) in item.content"
                                          :key="collapseIndex"
                                          @click.native="handchange(index+''+collapseIndex)"
                                          :name="index+''+collapseIndex">
                            <template slot="title">
                                <div :class="[index+''+collapseIndex ,'testIconNoExpened']">
                                </div><div :class="[index+''+collapseIndex ,'testIconExpened']"></div>
                                {{ collapseItem.subhead }}
                            </template>
                            <div class="textBody">
                                <p v-html="collapseItem.info">{{ collapseItem.info }}</p>
                            </div>
                        </el-collapse-item>
                    </div>
                </el-collapse>
            </div>
        </el-dialog>
    </div>
</template>

<script>
// import bus from '@c/bus.js'
import $ from 'jquery'

export default {
    name: 'Transformation',
    data () {
        return {
            loading: false,
            transformationView: false,
            transformationData: [],
            activeNames: []
        }
    },
    methods: {
        transformation (show) {

            this.transformationView = show
            this.SettingTransformation()
        },
        close () {
            this.activeNames = []
            this.transformationData = []
            this.transformationView = false
        },
        handchange (val) {
            const testIconNoExpened = $(`.${val}.testIconNoExpened`)[0]
            const testIconExpened = $(`.${val}.testIconExpened`)[0]
            if (this.activeNames.indexOf(val) !== -1) {
                testIconNoExpened.style.display = 'none'
                testIconExpened.style.display = 'block'
            } else {
                testIconExpened.style.display = 'none'
                testIconNoExpened.style.display = 'block'
            }
        },
        SettingTransformation () {
            this.loading = true
            this.$request.settings.SettingTransformation('').then(response => {
                const data = this.$request.CODE(response.data)
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    this.transformationData = data.result
                    console.log(this.transformationData)
                }
                this.loading = false
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.SettingTransformation() : ''
                    })
                } else {
                    if (err.status >= 400 && err.status < 500 && err.status !== 401) {
                        this.close()
                    }
                    this.$request.requestError(`SettingTransformation-get请求失败:`, err, 'Transformation')
                }
            })
        }
    }
}
</script>

<style lang="less" scoped>
@import url("../../less/pages/Settings/Transformation.less");
</style>
