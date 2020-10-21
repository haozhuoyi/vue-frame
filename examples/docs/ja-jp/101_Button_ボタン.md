## ChxButton コンポーネント
element-uiのbuttonを継承し、親のプロパティを保持する。<br>
CheXの特有なスタイルと属性が追加される。

### タイプ

ボタンのタイプを設定する。４種類のタイプがあります。

:::demo プロパティ`chx-type`で　ボタンのスタイルを設定する。
```html
<el-row>
  <chx-button chx-type="normal">デフォルト</chx-button>
  <chx-button chx-type="delete">削除系</chx-button>
  <chx-button chx-type="highlight">警告系</chx-button>
  <chx-button chx-type="noborder">枠無し</chx-button>
</el-row>
<el-row>
  <chx-button chx-type="normal" disabled>デフォルト</chx-button>
  <chx-button chx-type="delete" disabled>削除系</chx-button>
  <chx-button chx-type="highlight" disabled>警告系</chx-button>
  <chx-button chx-type="noborder" disabled>枠無し</chx-button>
</el-row>
<style lang="less" scoped>
    .el-row {
      margin-top:20px
    }
</style>
```
:::

### アイコン

文字を付けないアイコンボタンです。

:::demo プロパティ`chx-icon`で、アイコンを設定する。
```html
普通の例：
<el-row class="icon">
  <div class="bar">
    <chx-button chx-icon="point"></chx-button>
    <chx-button chx-icon="brush"></chx-button>
    <chx-button chx-icon="person"></chx-button>
  </div>
</el-row>

CheXにある全部アイコン：
<el-row class="all-icon">
  <div class="bar" v-for="v in list" >
    <chx-button :chx-icon="v.path"  :title="v.path"></chx-button>
    <div>{{v.path}}</div>
  </div>
</el-row>

<script>
  export default {
      data(){
        return{
          list: []
        }
      },
      mounted () {
        require.context('~/assets/icons/svg', true, /\.svg$/,'lazy').keys().forEach(key => {
          this.list.push({ path: (key.split('.'))[1].replace('/','')})
        });
      }
  }
</script>
<style lang="less" scoped>
    .el-row {
      /deep/ button img{
        width:70px;
        height:70px;
      }

      .bar{
        float:left;
        margin:0 10px 15px 10px;
        div{
          text-overflow: ellipsis;
          white-space:nowrap;
          overflow:hidden;
          text-align:center;
          white-space:nowrap;
          font-size:9px;
        }
      }
    }
</style>
```
:::

### Attributes
| 属性      | 説明    | タイプ      | 設定       | デフォルト値   |
|---------- |-------- |---------- |-------------  |-------- |
| chx-type     | 対応を指定する   | string    |   normal / delete / highlight |     normal    |
| chx-icon | アイコン名を指定する | string   |  src/assets/icons/svg配下のSVGファイル名で設定する  |  —  |
| chx-border | 枠が表示するかどうかを設定する | string   |  true/false  |  true  |