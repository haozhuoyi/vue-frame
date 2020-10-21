import Vue from 'vue'
import locale from 'element-ui/lib/locale'
import VueI18n from 'vue-i18n'
import messages from './langs'

Vue.use(VueI18n)
// 从localStorage中拿到用户的语言选择，如果没有，那默认中文。
const browserLanguage = (navigator.language || navigator.browserLanguage).toLowerCase()
let language = ''
if (browserLanguage.indexOf('cn') >= 0) {
    language = 'cn'
} else if (browserLanguage.indexOf('ja') >= 0) {
    language = 'ja'
} else {
    language = 'en'
}
const i18n = new VueI18n({
    locale: language,
    messages,
    silentTranslationWarn: true
})
locale.i18n((key, value) => i18n.t(key, value)) // 为了实现element插件的多语言切换
export default i18n
