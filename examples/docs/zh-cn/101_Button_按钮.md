## ChxButton组件
继承element-ui的按钮。保留所有原有属性。<br>
增加chex样式和属性。

### 类型

设置按钮类型。4种CheX中常用表现类型。

:::demo 使用`chx-type`属性来定义 Button 的样式。
```html
<el-row>
  <chx-button chx-type="normal">默认按钮</chx-button>
  <chx-button chx-type="delete">删除按钮</chx-button>
  <chx-button chx-type="highlight">警示按钮</chx-button>
  <chx-button chx-type="noborder">无边框按钮</chx-button>
</el-row>
<el-row>
  <chx-button chx-type="normal" disabled>默认按钮</chx-button>
  <chx-button chx-type="delete" disabled>删除按钮</chx-button>
  <chx-button chx-type="highlight" disabled>警示按钮</chx-button>
  <chx-button chx-type="noborder" disabled>无边框按钮</chx-button>
</el-row>
<style lang="less" scoped>
    .el-row {
      margin-top:20px
    }
</style>
```
:::

### 图标

无文字图标按钮

:::demo 使用`chx-icon`属性来定义 图标 的样式。
```html
例子
<el-row class="icon">
  <div class="bar">
    <chx-button chx-icon="point"></chx-button>
    <chx-button chx-icon="brush"></chx-button>
    <chx-button chx-icon="person"></chx-button>
  </div>
</el-row>
CheX中的所有icon
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

### 图标+文字

有文字图标按钮

:::demo 使用`chx-text`属性来设置文本，`chx-text-position`来控制文本的位置，`chx-text-margin`来控制文本和图标的距离
```html
例子
<el-row class="icon">
  <div class="bar">
    <chx-button chx-icon="point" chx-text=""></chx-button>
    <chx-button chx-icon="point" chx-text="图钉"></chx-button>
    <chx-button chx-icon="point" chx-text="图钉" chx-text-position="top" chx-text-margin='5px'></chx-button>
    <chx-button chx-icon="point" chx-text="图钉" chx-text-position="bottom" chx-text-margin='6px'></chx-button>
    <chx-button chx-icon="point" chx-text="图钉" chx-text-position="left" chx-text-margin='7px'></chx-button>
    <chx-button chx-icon="point" chx-text="图钉" chx-text-position="right" chx-text-margin='8px'></chx-button>
  </div>
</el-row>

<style lang="less" scoped>
    .chx-icon-button {
      vertical-align: top;
    }
</style>
```
:::

### Attributes
| 参数      | 说明    | 类型      | 可选值       | 默认值   |
|---------- |-------- |---------- |-------------  |-------- |
| chx-type     | 类型   | string    |   normal / delete / highlight |     normal    |
| chx-icon | 图标类名 | string   |  src/assets/icons/svg目录下的svg图片名  |  —  |
| chx-border | 是否显示边框线 | string   |  true/false  |  true  |
| chx-text     | 文本   | string    |   — |     —    |
| chx-text-position | 文本位置 | string   |  top/bottom/left/right  |  bottom  |
| chx-text-margin | 文本和图标之间的间隔大小 | string   |  *px  |  0px  |
