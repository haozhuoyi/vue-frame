<template>
    <div id="inquiry">
        <el-dialog :title="$t('inquiry.DISPLAY_SUPPORT_MENU_2')"
                   :visible.sync="inquiryDialogVisible"
                   :close-on-click-modal="false"
                   :before-close="close"
                   ref="inquiry"
                   class="inquiry"
                   hegiht="492px"
                   box-sizing="border-box"
                   v-loading="loading"
                   :element-loading-text="$t('common.DISPLAY_UNDER_READING')"
                   element-loading-spinner="el-icon-loading"
                   element-loading-background="rgba(255,255,255,.4)">
            <!-- <div class="body"> -->
            <!-- 咨询者(お問い合わせ者) -->
            <div class="consultant">
                <p class="title">{{ $t('inquiry.DISPLAY_SUPPORT_SENDER') }}</p>
                <p class="content">{{ userData.userName }}({{ userData.mailAdress }})</p>
            </div>
            <!-- 咨询内容() -->
            <div class="consultationContent">
                <p>{{ $t('inquiry.DISPLAY_SUPPORT_MESSAGE') }}</p>
                <div class="content classification">
                    <div class="left">
                        <img :src="require('@a/images/settings/settings-Inquiry-required.svg')">
                    </div>
                    <div class="right">
                        <div class="box inquiry">
                            <span>{{ $t('inquiry.DISPLAY_SUPPORT_TARGET_MACHINE') }}</span>
                            <label for="PC"
                                   @click="checkedBox('PC')">
                                <input type="checkbox"
                                       :checked="ruleForm.subject.includes('PC')"
                                       name="PC"
                                       id="PC">
                                <span @click="checkedBox('PC')">PC</span>
                            </label>
                            <label for="iPad"

                                   @click="checkedBox('iPad')">
                                <input type="checkbox"
                                       :checked="ruleForm.subject.includes('iPad')"
                                       name="iPad"
                                       id="iPad">
                                <span @click="checkedBox('iPad')">iPad</span>
                            </label>
                            <label for="iPhone"
                                   @click="checkedBox('iPhone')">
                                <input type="checkbox"
                                       :checked="ruleForm.subject.includes('iPhone')"
                                       name="iPhone"
                                       id="iPhone">
                                <span @click="checkedBox('iPhone')">iPhone</span>
                            </label>
                            <label for="other"
                                   @click="checkedBox('その他')">
                                <input type="checkbox"
                                       :checked="ruleForm.subject.includes('その他')"
                                       name="other"
                                       id="other">
                                <span @click="checkedBox('その他')">{{ $t('inquiry.DISPLAY_SUPPORT_OTHER') }}</span>
                            </label>
                        </div>
                        <div class="version">
                            <span>
                                {{ $t('inquiry.DISPLAY_SUPPORT_CHEX_VER') }}
                                <input class="input"
                                       type="text"
                                       v-change
                                       v-model="ruleForm.chexVersion">
                            </span>
                            <span>
                                {{ $t('inquiry.DISPLAY_SUPPORT_OS_VER') }}
                                <input class="input"
                                       type="text"
                                       v-change
                                       v-model="ruleForm.osVersion">
                            </span>
                        </div>
                    </div>
                </div>
                <div class="content body">
                    <div class="left">
                        <img :src="require('@a/images/settings/settings-Inquiry-required.svg')">
                    </div>
                    <div class="right">
                        <span class="title">{{ $t('inquiry.DISPLAY_SUPPORT_MESSAGE_DETAILS') }}</span>
                        <el-input type="textarea"
                                  ref="textarea"
                                  v-model="ruleForm.desc"></el-input>
                    </div>
                </div>
                <div class="content other">
                    <div class="left">
                        <img :src="require('@a/images/settings/settings-Inquiry-required.svg')">
                    </div>
                    <div class="right">
                        <p>{{ $t('inquiry.DISPLAY_SUPPORT_RESERCH_CONFIRM1') }}</p>
                        <p>{{ $t('inquiry.DISPLAY_SUPPORT_RESERCH_CONFIRM2') }}</p>
                        <div class="radioGroup"
                             v-if="inquiryDialogVisible">
                            <RadioGroup class="radioGroupAllowLogin"
                                        :data="[$t('inquiry.DISPLAY_SUPPORT_RESERCH_CHECK1'), $t('inquiry.DISPLAY_SUPPORT_RESERCH_CHECK2')]"
                                        @radioGroup="radioGroupAllowLogin"></RadioGroup>
                        </div>
                    </div>
                </div>
            </div>
            <hr />
            <!-- 其他 -->
            <div class="other">
                <div class="content title">
                    <div class="left"></div>
                    <div class="right">
                        <p>{{ $t('inquiry.DISPLAY_SUPPORT_TEL_CONFIRM1') }}</p>
                        <p>{{ $t('inquiry.DISPLAY_SUPPORT_TEL_CONFIRM2') }}</p>
                    </div>
                </div>
                <div class="content phone">
                    <div class="left">
                        <p>{{ $t('inquiry.DISPLAY_SUPPORT_TEL') }}</p>
                    </div>
                    <div class="right">
                        <input v-model="ruleForm.phoneNumber"
                               class="inputPhoneNumber" />
                    </div>
                </div>
                <div class="content timePeriod">
                    <div class="left">
                        <p>{{ $t('inquiry.DISPLAY_SUPPORT_TEL_TIME') }}</p>
                    </div>
                    <div class="right">
                        <RadioGroup class="formRadioGroupTime"
                                    v-if="inquiryDialogVisible"
                                    :data="radioGroupData"
                                    @radioGroup="radioGroupTime"></RadioGroup>
                    </div>
                </div>
                <div class="content remark">
                    <div class="left">
                        <p>{{ $t('inquiry.DISPLAY_SUPPORT_PROMPT') }}</p>
                    </div>
                    <div class="right">
                        <el-input type="textarea"
                                  v-model="ruleForm.remarks"></el-input>
                    </div>
                </div>
            </div>
            <!-- </div> -->
            <div slot="footer"
                 class="footer">
                <div class="content">
                    <div class="left">
                        <p>{{ $t('inquiry.DISPLAY_SUPPORT_SENDER_NOTE1') }}</p>
                        <p>{{ $t('inquiry.DISPLAY_SUPPORT_SENDER_NOTE2') }}</p>
                    </div>
                    <div class="right">
                        <button class="button buttonHighlight float"
                                @click="submitForm">
                            {{ $t('inquiry.DISPLAY_SUPPORT_BUTTON_SEND') }}
                        </button>
                    </div>
                </div>
            </div>

            <el-dialog :visible.sync="applyToFoldersBelow"
                       :title="$t('common.DialogConfirmCancelTitle')"
                       :close-on-click-modal="false"
                       :before-close="applyToFoldersBelowClose"
                       :destroy-on-close="true"
                       append-to-body
                       class="userdialog">
                <p v-html="$t('common.DialogConfirmCancelContent')">{{ $t('common.DialogConfirmCancelContent') }}</p>
                <span slot="footer"
                      class="dialog-footer">
                    <button class="button"
                            @click="applyToFoldersBelowClose">{{ $t('common.DialogConfirmCancelButton1') }}</button>
                    <button class="button buttonDelete margin"
                            @click="confirm">{{ $t('common.DialogConfirmCancelButton2') }}</button>
                </span>
            </el-dialog>
        </el-dialog>
    </div>
</template>

<script>
import bus from '@c/bus'

export default {
    name: 'Inquiry',
    components: {
        RadioGroup: resolve => require(['@c/RadioGroup'], resolve)
    },
    data () {
        return {
            inquiryDialogVisible: false,
            applyToFoldersBelow: false,
            beforeunload: true,
            loading: false,
            radioGroupData: ['inquiry.DISPLAY_SUPPORT_TEL_LIST_FREE', '13:00～14:00', '14:00～15:00', '15:00～16:00', '16:00～17:00'],
            userData: {},
            ruleForm: {
                subject: [],
                chexVersion: '',
                osVersion: '',
                desc: '',
                radio: 'OK',
                phoneNumber: '',
                radioTime: '',
                remarks: ''
            }
        }
    },
    watch: {
        ruleForm: {
            handler (newValue) {
                if (
                    newValue.subject.length > 0 ||
                    newValue.chexVersion ||
                    newValue.osVersion ||
                    newValue.desc ||
                    newValue.radio !== 'OK' ||
                    newValue.phoneNumber ||
                    newValue.radioTime !== this.$t('inquiry.DISPLAY_SUPPORT_TEL_LIST_FREE') ||
                    newValue.remarks
                ) {
                    this.beforeunload = false
                } else {
                    this.beforeunload = true
                }
            },
            deep: true
        }
    },
    mounted () {
        this.$nextTick(() => {
            bus.$on('Inquiry', msg => {
                this.inquiryDialogVisible = msg
                this.userData = this.$store.state.userInfo
                this.ruleForm.radioTime = this.$t('inquiry.DISPLAY_SUPPORT_TEL_LIST_FREE')
                setTimeout(() => {
                    this.$refs.textarea.focus()
                }, 150)
                // 添加监听浏览器刷新事件
                window.addEventListener('beforeunload', this.beforeunloadHandlerInquiry, false)
            })
        })
    },
    methods: {
        // 浏览器刷新事件
        beforeunloadHandlerInquiry (e) {
            if (!this.beforeunload) {
                e = e || window.event
                if (e) {
                    e.returnValue = '关闭提示'
                }
                return !this.beforeunload
            }
            return
        },
        checkedBox (i) {
            if (this.ruleForm.subject.includes(i)) {
                // includes()方法判断是否包含某一元素,返回true或false表示是否包含元素，对NaN一样有效
                // filter()方法用于把Array的某些元素过滤掉，filter()把传入的函数依次作用于每个元素，然后根据返回值是true还是false决定保留还是丢弃该元素：生成新的数组
                this.ruleForm.subject = this.ruleForm.subject.filter(function (ele) { return ele !== i })
                // this.arr=this.arr.filter((ele)=>ele!=i);
                // filter()为假时删除
            } else {
                this.ruleForm.subject.push(i)
            }
        },
        close () {
            if (!this.beforeunload) {
                this.applyToFoldersBelow = true
            } else {
                this.confirm()
            }
        },
        // close
        applyToFoldersBelowClose () {
            this.applyToFoldersBelow = false
        },
        confirm () {
            this.inquiryDialogVisible = false
            Object.assign(this.$data, this.$options.data())
            window.removeEventListener('beforeunload', this.beforeunloadHandlerInquiry, false)
        },
        radioGroupAllowLogin (data) {
            // this.ruleForm.radio = data === this.$t('inquiry.DISPLAY_SUPPORT_RESERCH_CHECK1') ? 'はい' : 'いいえ'
            this.ruleForm.radio = data === this.$t('inquiry.DISPLAY_SUPPORT_RESERCH_CHECK1') ? 'OK' : 'NG'
        },
        // select time
        radioGroupTime (data) {
            this.ruleForm.radioTime = data
        },
        submitForm () {
            this.$message.closeAll()
            // 入力検証
            if (this.ruleForm.subject.length <= 0) {
                this.$message.error(this.$t('inquiry.MESSAGE_SUPPORT_SELECT_SUBJECT'))
                return
            }
            if (this.ruleForm.desc.toString().length <= 0) {
                this.$message.error(this.$t('inquiry.MESSAGE_SUPPORT_ENTER_THE_CONTENT'))
                return
            }
            if (this.ruleForm.radio.toString().length <= 0) {
                this.$message.error(this.$t('inquiry.MESSAGE_SUPPORT_CHOOSE_AGREE'))
                return
            }
            if (this.userData.mailAdress.toString().length <= 0) {
                this.$message.error(this.$t('inquiry.MESSAGE_SUPPORT_REGISTER_AGAIN'))
                return
            }
            const chexVersion = this.$request.replaceMethod(this.ruleForm.chexVersion)
            const osVersion = this.$request.replaceMethod(this.ruleForm.osVersion)
            const desc = this.$request.replaceMethod(this.ruleForm.desc)
            const remarks = this.$request.replaceMethod(this.ruleForm.remarks)
            this.SettingAskSupport(chexVersion, osVersion, desc, remarks)
        },
        SettingAskSupport (chexVersion, osVersion, desc, remarks) {
            this.loading = true
            const body =
                '{' +
                    '"object":"' +
                        this.ruleForm.subject.toString() +
                    '",' + // オブジェクト(*必須)
                    '"chexVersion":"' +
                        chexVersion +
                    '",' + // CheXバージョン
                    '"osVersion":"' +
                        osVersion +
                    '",' + // OSバージョン
                    '"content":"' +
                        desc +
                    '",' + // 詳細(*必選)
                    '"agree":"' +
                     this.ruleForm.radio +
                    '",' + // 調査に同意する(*必須)
                    '"phoneNumber":"' +
                        this.ruleForm.phoneNumber +
                    '",' + // 電話番号
                    '"freeTime":"' +
                        this.ruleForm.radioTime +
                    '",' + // 空き時間
                    '"remark":"' +
                        remarks +
                    '",' + // 备注
                    '"email":"' +
                        this.userData.mailAdress +
                    '"' + // メールボックス(*必須)
                '}'
            this.$request.settings.SettingAskSupport(body).then(response => {
                const data = this.$request.CODE(response.data)
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    this.$message.success(this.$t('inquiry.MESSAGE_SUPPORT_SEND_MAIL_COMPLEAT'))
                    this.confirm()
                }
                this.loading = false
            }).catch(err => {
                this.loading = false
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.SettingAskSupport(chexVersion, osVersion, desc, remarks) : ''
                    })
                } else {
                    if (err.status >= 400 && err.status < 500 && err.status !== 401) {
                        this.confirm()
                    }
                    this.$request.requestError(`SettingAskSupport-post请求失败:`, err, 'Inquiry')
                }
            })
        }
    }
}
</script>

<style lang="less" scoped>
@import url("../../less/pages/Settings/Inquiry.less");
</style>
