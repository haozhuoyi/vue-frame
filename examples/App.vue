<template>
    <div id="app">
        <el-container>
            <el-header>
                <div class="left">
                    <a href="/examples">
                        <el-image :src="logo"></el-image>
                        <span>CheX UI</span>
                    </a>
                </div>
                <div class="right">
                    <el-select class="lang-select"
                               v-model="lang"
                               placeholder="请选择"
                               popper-class="lang-popper"
                               @change="onLangChanged">
                        <el-option
                            v-for="item in langs"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </el-header>
            <el-container>
                <el-aside width="200px">
                    <div class="subtitle">Component</div>
                    <div class="bar"
                         v-for="(v,i) in list"
                         :key="i">
                        <router-link :to="v.path">{{ v.name }}</router-link>
                    </div>
                </el-aside>
                <el-container class="app-view">
                    <el-scrollbar>
                        <el-main>
                            <router-view></router-view>
                        </el-main>
                        <el-footer><span class="copyright">Copyright &copy;2020 CheX Team</span></el-footer>
                    </el-scrollbar>
                </el-container>
            </el-container>
        </el-container>
    </div>
</template>

<script>
export default {
    data () {
        return {
            list: [],
            logo: require('@/assets/logo.png'),
            langs: [{
                value: 'zh-cn',
                label: '中文'
            }, {
                value: 'ja-jp',
                label: '日本語'
            }, {
                value: 'en-us',
                label: 'English'
            }],
            lang: 'zh-cn'
        }
    },
    mounted () {
        this.lang = localStorage.getItem('CHEXUI_LANGUAGE')
        this.lang = this.lang === null ? 'zh-cn' : this.lang
        this.changeLangOnSideBar()
    },
    methods: {
        // 刷新左侧组件列表
        changeLangOnSideBar () {
            const self = this
            self.list.splice(0)
            this.$router.options.routes.forEach(key => {
                const {path: path, name: name} = key
                if (!path.includes(self.lang)) return

                let displayname = name
                const divs = name.split('_')
                if (divs.length > 1) {
                    divs.splice(0, 1)
                    displayname = divs.join(' ')
                }

                self.list.push({
                    path,
                    name: displayname})
            })
        },
        // 语言切换
        onLangChanged (targetLang) {
            const currentLang = localStorage.getItem('CHEXUI_LANGUAGE')
            if (currentLang === targetLang) return
            localStorage.setItem('CHEXUI_LANGUAGE', targetLang)
            this.changeLangOnSideBar()
            this.$router.push(this.$route.path.replace(currentLang, targetLang))
        }
    }
}
</script>
<style lang="less" scoped>
  #app .el-container{
    width: 1140px;
    padding: 0;
    margin: 0 auto;
  }
 .el-header {
    background-color: white;
    color: #333;
    text-align: left;;
    line-height: 60px;
    padding: 10px 10px;
    border-bottom: 1px solid #789;

    .left{
      .el-image{
        width: 70px;
        float: left;
        line-height:40px;
        height: 40px;
      }
      span{
        color: black;
        font-size: 1.5rem;
        float: left;
        line-height:40px;
        height: 40px;
      }
    }
    .right{
      float:right;

      .lang-select{
        text-align: right;
        top:-5px;
        /deep/ input{
          text-align: right;
          border: none;
        }
      }
    }
  }
  .el-footer{
    background-color: white;
    color: #333;
    padding: 10px 10px;
    .copyright{
      line-height: 40px;
      font-size: 0.8rem;
    }
  }

  .el-aside {
    background-color: white;
    color: #333;
    line-height: 30px;
    padding-left: 5px;

    .subtitle{
      color: #ccc;
      font-size: 0.8rem;
    }
    .bar{
      font-size: 0.9rem;
      margin-bottom: 5px;;
      a{
        color:#333;
      }
    }
  }

  .app-view{
    height: calc(~'100vh - 60px');
    .el-scrollbar{
      width: 100%;
    }
  }

  .el-main {
    color: #333;
  }

</style>

<style lang="less">
  .lang-popper{
    border-color: #EBEEF5!important;
    .popper__arrow{
      left:135px!important;
    }
  }
</style>
