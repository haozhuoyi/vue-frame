<template>
    <div id="header">
        <section class="header">
            <div class="logo"
                 :title="getAuthInfoName.projectName">
                <img :src="miniLogo">
                <el-button type="text"
                           @click="getprojects"
                           style="pointer-events: none;">
                    {{ getAuthInfoName.projectName }}
                    <!-- <i class="el-icon-arrow-down"></i> -->
                </el-button>
            </div>
            <div class="headerRight">
                <el-dropdown class="lang"
                             trigger="click"
                             @command="settingCommand">
                    <span class="el-dropdown-link">
                        {{ $t(`langList.${$i18n.locale}`) }}<i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu class="headerDropdown"
                                      slot="dropdown">
                        <el-dropdown-item class="keepRight"
                                          command="cn">
                            {{ $t('langList.cn') }}
                        </el-dropdown-item>
                        <el-dropdown-item class="keepRight"
                                          command="en">
                            {{ $t('langList.en') }}
                        </el-dropdown-item>
                        <el-dropdown-item class="keepRight"
                                          command="ja">
                            {{ $t('langList.ja') }}
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <button class="headerButton setting"
                        @click="refresh">
                    <img :src="refreshLogo">
                </button>
                <button class="headerButton setting"
                        style="margin: 0 10px;"
                        @click="uploadShow"><img :src="uploadLogo"></button>
                <el-dropdown ref="dropdown"
                             trigger="click"
                             :hide-on-click="false"
                             @command="settingCommand">
                    <button class="headerButton setting">
                        <img :src="settingLogo">
                    </button>
                    <el-dropdown-menu class="headerDropdown"
                                      slot="dropdown">
                        <p class="personalSettings">
                            {{ $t('settings.personalSetting') }}
                        </p>
                        <!-- 二维码设定 -->
                        <el-dropdown-item class="keepRight"
                                          command="qr_file_setting"
                                          disabled>
                            {{ $t('settings.DISPLAY_SETTING_MENU_4') }}
                        </el-dropdown-item>
                        <!-- 印章设定 -->
                        <el-dropdown-item class="keepRight"
                                          command="stamp_file_setting"
                                          disabled>
                            {{ $t('settings.DISPLAY_SETTING_MENU_3') }}
                        </el-dropdown-item>
                        <!-- 黑板设定 -->
                        <el-dropdown-item class="keepRight"
                                          command="blackboard_file_setting"
                                          disabled>
                            {{ $t('settings.DISPLAY_SETTING_MENU_5') }}
                        </el-dropdown-item>
                        <!-- 电子邮件模板设定 -->
                        <el-dropdown-item class="keepRight"
                                          command="mail_setting">
                            {{ $t('settings.DISPLAY_FILE_INFO_SEND_MAIL_EMAIL_TEMPLATES') }}
                        </el-dropdown-item>
                        <!-- 邮件列表设定 -->
                        <el-dropdown-item class="keepRight"
                                          command="mail_list_setting">
                            {{ $t('settings.DISPLAY_MAILLING_LIST_VIEWER_TITLE') }}
                        </el-dropdown-item>
                        <!-- xc-gate认证设定 -->
                        <el-dropdown-item class="keepRight"
                                          command="xc_Gate_setting"
                                          disabled>XC-
                            {{ $t('settings.DISPLAY_USER_INFO_USER_EDIT_BUTTON_XC_GATE_OPEN') }}
                        </el-dropdown-item>
                        <!-- cad文件变换设定 -->
                        <!-- 添加分割线 -->
                        <el-dropdown-item class="divided"
                                          divided></el-dropdown-item>
                        <el-dropdown-item class="keepLeft"
                                          command="cad_file_setting">
                            <div id="makeDwgPdfFlag"
                                 class="card"></div>
                            {{ $t('settings.DISPLAY_SETTING_MAKE_DWG_PDF') }}
                        </el-dropdown-item>
                        <!-- reb文件变换设定 -->
                        <el-dropdown-item class="keepLeft"
                                          command="rebro_file_setting">
                            <div id="reb"
                                 class="card"></div>
                            {{ $t('settings.DISPLAY_SETTING_MENU_REB_COLOR') }}
                        </el-dropdown-item>
                        <!-- 文件追加邮件通知设定 -->
                        <el-dropdown-item class="keepLeft"
                                          command="file_addmail_setting">
                            <div id="sendMailFlag"
                                 class="card"></div>
                            {{ $t('settings.DISPLAY_FILE_INFO_SEND_MAIL') }}
                        </el-dropdown-item>
                        <!-- 添加分割线 -->
                        <el-dropdown-item divided></el-dropdown-item>
                        <p class="personalSettings">
                            {{ $t('settings.projectSetting') }}
                        </p>
                        <!-- box连接设定 -->
                        <el-dropdown-item class="keepRight"
                                          command="box_setting"
                                          disabled>
                            {{ $t('settings.DISPLAY_SETTING_MENU_6') }}
                        </el-dropdown-item>
                        <!-- ctb文件设定 -->
                        <el-dropdown-item class="keepRight"
                                          command="ctb_file_setting"
                                          disabled>
                            {{ $t('settings.DISPLAY_SETTING_MENU_1') }}
                        </el-dropdown-item>
                        <!-- 使用状况设定 -->
                        <el-dropdown-item class="keepRight"
                                          command="usageStatus_setting"
                                          disabled>
                            {{ $t('settings.UsageConfirmation') }}
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <el-badge :is-dot="isdot"
                          class="item">
                    <button class="headerButton inform">
                        <i class="el-icon-message-solid"
                           style="color: #F5E146;"></i>
                    </button>
                </el-badge>
                <button class="headerButton user"
                        id="dropdownmenu"
                        @click="popupSupportMenu('userDropdown')">
                    <img :src="require('@a/images/header/header-user-solid.svg')">
                </button>
                <div class="userDropdown"
                     id="userDropdown"
                     :style="locale === 'en' ? 'margin-left: 66px;' : 'margin-left: 40px;'">
                    <div class="userInfo">
                        <p class="userName">{{ getAuthInfoName.userName }}</p>
                        <p class="userRole">
                            {{
                                getAuthInfoName.isAdmin ? $t('settings.MESSAGE_SETTING_BOX_SYNC_IS_ADMIN3') : (getAuthInfoName.authorityName === 'プロジェクト管理者' ? $t('settings.MESSAGE_SETTING_BOX_SYNC_IS_ADMIN1') : $t('settings.MESSAGE_SETTING_BOX_SYNC_IS_ADMIN2'))
                            }}
                        </p>
                    </div>
                    <ul>
                        <li class="listItem">
                            <a href="https://chex.jp/"
                               :title="$t('settings.DISPLAY_SUPPORT_MENU_1')"
                               target="_blank">{{ $t('settings.DISPLAY_SUPPORT_MENU_1') }}</a>
                        </li>
                        <li class="listItem">
                            <a href="javascript:;"
                               @click="handleCommand('Inquiry')">{{ $t('settings.DISPLAY_SUPPORT_MENU_2') }}</a>
                        </li>
                        <li id="secondaryPullDownMenu"
                            class="listItem hasChildMenu">
                            <p class="menuArrow"><i class="el-icon-arrow-right"></i></p>
                            <a href="javascript:;"
                               @click="secondaryMenu('childMenuManual')">
                                {{ $t('settings.DISPLAY_SETTING_MENU_MANUAL') }}</a>
                            <ul id="childMenuManual">
                                <li class="listItem">
                                    <a href="javascript:;"
                                       @click="settingManual('PC')">
                                        {{ $t('settings.DISPLAY_SETTING_MANUAL_TITLE_PC') }}</a>
                                </li>
                                <li class="listItem">
                                    <a href="javascript:;"
                                       @click="settingManual('iOS')">
                                        {{ $t('settings.DISPLAY_SETTING_MANUAL_TITLE_IOS') }}</a>
                                </li>
                                <li class="listItem">
                                    <a href="javascript:;"
                                       @click="settingManual('Measure')">
                                        {{ $t('settings.DISPLAY_SETTING_MANUAL_TITLE_REPORTS') }}</a>
                                </li>
                                <li class="listItem">
                                    <a href="javascript:;"
                                       @click="transformation">
                                        {{ $t('settings.DISPLAY_SETTING_MANUAL_TITLE_TRANSITION_STATUE') }}</a>
                                </li>
                            </ul>
                        </li>
                        <li class="separator"></li>
                        <li class="listItem">
                            <a href="javascript:;"
                               @click="handleCommand('License')">{{ $t('settings.DISPLAY_SETTING_MENU_LICENSE') }}</a>
                        </li>
                        <li class="listItem">
                            <a href="https://www.ysl.co.jp/privacy/"
                               :title="$t('settings.DISPLAY_SETTING_MENU_POLICY')"
                               target="_blank">{{ $t('settings.DISPLAY_SETTING_MENU_POLICY') }}</a>
                        </li>
                        <li class="separator"></li>
                        <li class="listItem"
                            id="logout">
                            <a href="javascript:;"
                               @click="handleCommand('logout')">{{ $t('settings.DISPLAY_EXIT') }}</a>
                        </li>
                    </ul>
                </div>
            </div>
        </section>
        <EmailList ref="EmailList"></EmailList>
        <EmailTemplateSelection ref="EmailTemplateSelection"></EmailTemplateSelection>
        <Transformation ref="Transformation"></Transformation>
    </div>
</template>
<script>
import bus from '@c/bus.js'
import md5 from 'js-md5'
import store from '../pages/Files/store'
import Crypto from '@u/crypto'

export default {
    name: 'Header',
    components: {
        EmailTemplateSelection: resolve => require(['@p/Files/AllFiles/Email/EmailTemplateSelection'], resolve),
        EmailList: resolve => require(['@p/Files/AllFiles/Email/EmailList'], resolve),
        Transformation: resolve => require(['@p/Settings/Transformation'], resolve)
    },
    inject: ['reload'],
    data () {
        return {
            miniLogo: require('@a/images/header/header-mini-logo.svg'),
            refreshLogo: require('@a/images/header/header-refresh.svg'),
            uploadLogo: require('@a/images/header/header-upload.svg'),
            settingLogo: require('@a/images/header/header-settings.svg'),
            getAuthInfoName: this.$store.state.userInfo,
            isdot: true,
            locale: this.$i18n.locale
        }
    },
    mounted () {
        const that = this
        this.$nextTick(() => {
            this.cardSetting('makeDwgPdfFlag', this.$store.state.settingPersonal.makeDwgPdfFlag)
            this.cardSetting('reb', this.$store.state.settingPersonal.reb)
            this.cardSetting('sendMailFlag', this.$store.state.settingPersonal.sendMailFlag)
            bus.$on('storeUpdata', () => {
                that.getAuthInfoName = this.$store.state.userInfo
            })
            bus.$on('refresh', () => {
                that.refresh(false)
            })
            bus.$on('settingPersonal', () => {
                that.settingPersonal()
            })
            // 关闭菜单
            document.getElementById('home').addEventListener('click', (e) => {
                if (that.$route.fullPath !== '/login') {
                    const event = e || window.event // 浏览器兼容性
                    let elem = event.target || event.srcElement
                    while (elem) { // 循环判断至跟节点，防止点击的是div子元素
                        if (
                            elem.id && (elem.id === 'dropdownmenu' ||
                            elem.id === 'secondaryPullDownMenu' || elem.id === 'userDropdown')
                        ) {
                            return
                        }
                        elem = elem.parentNode
                    }
                    that.popupSupportMenu('childMenuManual', 'none')
                    that.secondaryMenu('userDropdown', 'none')
                }
            })
        })
    },
    methods: {
        refresh (setDefaultExpandedKeys = true) {
            if (setDefaultExpandedKeys) {
                store.dispatch('setDefaultExpandedKeys', [JSON.parse(Crypto.decrypt(store.state.breadcrumb))[0].NO])
            }
            this.reload()
            if (!['/401', '/404', '/4xx'].includes(this.$route.fullPath)) {
                this.settingPersonal()
            }
        },
        cardSetting (card, cardFlg) {
            document.getElementById(card).style.display = cardFlg ? 'block' : 'none'
        },
        // 1次メニューのonとoff
        popupSupportMenu (menu, display = '') {
            const thisMenu = document.getElementById(menu)
            const disv = thisMenu.style.display
            if (display) {
                thisMenu.style.display = 'none'
            } else {
                if (disv === 'block') {
                    thisMenu.style.display = 'none'
                } else {
                    thisMenu.style.display = 'block'
                }
            }
        },
        // 2次メニューのonとoff
        secondaryMenu (menu, display = '') {
            const subsecondaryMenu = document.getElementById(menu)
            const disv = subsecondaryMenu.style.display
            if (display) {
                subsecondaryMenu.style.display = 'none'
            } else {
                if (disv === 'block') {
                    subsecondaryMenu.style.display = 'none'
                } else {
                    subsecondaryMenu.style.display = 'block'
                }
            }
        },
        // 取得ファイルアップロード設定
        settingPersonal () {
            this.$request.settings.SettingPersonal('').then(response => {
                console.log('settingPersonal-get请求成功:', response.status, response.statusText)
                const data = this.$request.CODE(response.data)
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    this.$store.dispatch('settingPersonal', {
                        makeDwgPdfFlag: Boolean(data.result.makeDwgPdfFlag),
                        reb: Boolean(data.result.reb),
                        sendMailFlag: Boolean(data.result.sendMailFlag)
                    })
                    bus.$emit('isRouterAlice')
                    this.cardSetting('makeDwgPdfFlag', this.$store.state.settingPersonal.makeDwgPdfFlag)
                    this.cardSetting('reb', this.$store.state.settingPersonal.reb)
                    this.cardSetting('sendMailFlag', this.$store.state.settingPersonal.sendMailFlag)
                }
            }).catch(err => {
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.settingPersonal() : ''
                    })
                } else {
                    this.$request.requestError(`settingPersonal-get请求失败:`, err, 'Header')
                }
            })
        },
        // 更新ファイルアップロード設定
        userSettingUpdata (card) {
            const thisCard = document.getElementById(card)
            if (thisCard.style.display === 'block') {
                thisCard.style.display = 'none'
            } else {
                thisCard.style.display = 'block'
            }
            let body = ''
            if (card === 'makeDwgPdfFlag') {
                body = ('{' +
                '"makeDwgPdfFlag": "' + !this.$store.state.settingPersonal.makeDwgPdfFlag + '",' +
                '"reb": "' + this.$store.state.settingPersonal.reb + '",' +
                '"sendMailFlag": "' + this.$store.state.settingPersonal.sendMailFlag + '"' +
            '}')
            } else if (card === 'reb') {
                body = ('{' +
                '"makeDwgPdfFlag": "' + this.$store.state.settingPersonal.makeDwgPdfFlag + '",' +
                '"reb": "' + !this.$store.state.settingPersonal.reb + '",' +
                '"sendMailFlag": "' + this.$store.state.settingPersonal.sendMailFlag + '"' +
            '}')
            } else if (card === 'sendMailFlag') {
                body = ('{' +
                '"makeDwgPdfFlag": "' + this.$store.state.settingPersonal.makeDwgPdfFlag + '",' +
                '"reb": "' + this.$store.state.settingPersonal.reb + '",' +
                '"sendMailFlag": "' + !this.$store.state.settingPersonal.sendMailFlag + '"' +
            '}')
            }
            this.$request.settings.SettingUpdata(body).then(response => {
                console.log('SettingUpdata-post请求成功:', response.status, response.statusText)
                const data = this.$request.CODE(response.data)
                if (Object.prototype.toString.call(data) === '[object Object]') {
                    if (card === 'makeDwgPdfFlag') {
                        this.$store.dispatch('settingPersonal', {
                            makeDwgPdfFlag: !this.$store.state.settingPersonal.makeDwgPdfFlag,
                            reb: this.$store.state.settingPersonal.reb,
                            sendMailFlag: this.$store.state.settingPersonal.sendMailFlag
                        })
                    } else if (card === 'reb') {
                        this.$store.dispatch('settingPersonal', {
                            makeDwgPdfFlag: this.$store.state.settingPersonal.makeDwgPdfFlag,
                            reb: !this.$store.state.settingPersonal.reb,
                            sendMailFlag: this.$store.state.settingPersonal.sendMailFlag
                        })
                    } else if (card === 'sendMailFlag') {
                        this.$store.dispatch('settingPersonal', {
                            makeDwgPdfFlag: this.$store.state.settingPersonal.makeDwgPdfFlag,
                            reb: this.$store.state.settingPersonal.reb,
                            sendMailFlag: !this.$store.state.settingPersonal.sendMailFlag
                        })
                    }
                    this.cardSetting('makeDwgPdfFlag', this.$store.state.settingPersonal.makeDwgPdfFlag)
                    this.cardSetting('reb', this.$store.state.settingPersonal.reb)
                    this.cardSetting('sendMailFlag', this.$store.state.settingPersonal.sendMailFlag)
                }
            }).catch(err => {
                if (err.status === 401) {
                    this.$request.login.refreshToken().then(response => {
                        response ? this.userSettingUpdata() : ''
                    })
                } else {
                    this.$request.requestError(`SettingUpdata(userSettingUpdata)-get请求失败:`, err, 'Header')
                }
            })
        },
        getprojects () {
            bus.$emit('getProjects')
        },
        uploadShow () {
            bus.$emit('showUplaod')
        },
        handleCommand (command) {
            this.secondaryMenu('userDropdown')
            switch (command) {
                case 'Inquiry':
                    bus.$emit('Inquiry', true)
                    break
                case 'License':
                    console.log('ライセンス')
                    bus.$emit('License', true)
                    break
                default:
                    this.logout()
                    break
            }
        },
        settingCommand (command) {
            switch (command) {
                case 'qr_file_setting':
                    bus.$emit('PDFCreating', true)
                    this.$refs.dropdown.visible = false
                    break
                case 'stamp_file_setting':
                    bus.$emit('getStempSetting')
                    this.$refs.dropdown.visible = false
                    break
                case 'blackboard_file_setting':
                    bus.$emit('getBoardSetting')
                    this.$refs.dropdown.visible = false
                    break
                case 'mail_setting':
                    bus.$emit('emailTemplateSelection', true, true)
                    this.$refs.dropdown.visible = false
                    break
                case 'mail_list_setting':
                    this.$refs.EmailList.emailList(true)
                    this.$refs.dropdown.visible = false
                    break
                case 'xc_Gate_setting':
                    bus.$emit('xc_Gate_setting') // XC-Gate認証設定
                    this.$refs.dropdown.visible = false
                    break
                case 'box_setting':
                    bus.$emit('BoxSetting', true)
                    this.$refs.dropdown.visible = false
                    break
                case 'ctb_file_setting':
                    bus.$emit('getCtbSetting')
                    this.$refs.dropdown.visible = false
                    break
                case 'usageStatus_setting':
                    bus.$emit('getSettingUse')
                    this.$refs.dropdown.visible = false
                    break
                case 'cad_file_setting':
                    this.userSettingUpdata('makeDwgPdfFlag')
                    break
                case 'rebro_file_setting':
                    this.userSettingUpdata('reb')
                    break
                case 'file_addmail_setting':
                    this.userSettingUpdata('sendMailFlag')
                    break
                default:
                    this.$refs.dropdown.visible = false
                    this.$i18n.locale = command
                    this.locale = command
            }
        },
        // ユーザーマニュアルのダウンロード
        settingManual (Catalog) {
            this.popupSupportMenu('childMenuManual')
            this.secondaryMenu('userDropdown')
            setTimeout(() => {
                this.upload('', Catalog)
            }, 150)
        },
        // 下载方法
        upload (Body, Catalog) {
            const time = new Date().getTime()
            const signature = md5((`Body=${Body}&Timestamp=${time}3d4f2bf07dc1be38b20cd6e46949a1071f9d0e3d`))
            const commonParametersPost =
                `ApplicationID=10000&Format=JSON&Signature=${signature}&SignatureVersion=1.0&Timestamp=${time}&access_token=${this.$store.getters.getToken.access_token}`
            console.log('共同参数', commonParametersPost, time, Body)

            const downloadTag = document.getElementById('href')
            downloadTag.href = `/api/Setting/Manual/${Catalog}?Body=${Body}&${commonParametersPost}`
            downloadTag.click()
        },
        transformation () {
            this.popupSupportMenu('childMenuManual')
            this.secondaryMenu('userDropdown')
            setTimeout(() => {
                this.$refs.Transformation.transformation(true)
            }, 150)
        },
        logout () {
            const that = this
            bus.$emit('localLoading', true)
            const xhr = new XMLHttpRequest()
            const token = this.$store.getters.getToken
            const time = new Date().getTime()
            const signature = md5((`Body=&Timestamp=${time}3d4f2bf07dc1be38b20cd6e46949a1071f9d0e3d`))
            const commonParametersPost =
                `ApplicationID=10000&Format=JSON&Signature=${signature}&SignatureVersion=1.0&Timestamp=${time}&access_token=${this.$store.getters.getToken.access_token}&refresh_token=${token.refresh_token}`
            xhr.open('DELETE', `/api/logout?${commonParametersPost}`, true)
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
            xhr.onload = function (/* oEvent */) {
                // console.log(
                //     'oEvent', oEvent,
                //     '\nstatus:', xhr.status,
                //     '\nresponse', xhr.response,
                //     '\nheader:', xhr.getResponseHeader('content-disposition')
                // )
                that.$store.dispatch('setToken', {
                    'access_token': '',
                    'refresh_token': ''
                })
                that.$router.push('/login')
                bus.$emit('localLoading', false)
            }
            xhr.ontimeout = function (error) {
                console.log(error)
                that.$message.error('The request for "/api/logout" timed out')
                bus.$emit('localLoading', false)
            }
            xhr.timeout = 10 * 1000
            xhr.send()
        }
    }
}
</script>

<style lang="less" scoped>
@import url("../less/views/Header.less");
</style>
