## ChxLayout组件
集合CheX中常用的布局

### 布局1

主要用于 BIM\-PC在线视图

:::demo 使用`chx-type`属性来定义 Button 的样式。
```html
<template>
    <chx-layout1 :chx-src="containerSetting" class="layout1" :chx-list-show="listShow" :chx-detail-show="detailShow">
      <div slot="header">header</div>
      <div slot="toolbar">
          <chx-button chx-type="normal" class="left" @click="leftOpen">左侧列表打开</chx-button>
          <chx-button chx-type="normal" class="left" @click="leftClose">左侧列表关闭</chx-button>
          toolbar
          <chx-button chx-type="normal" class="right" @click="rightOpen">右侧列表打开</chx-button>
          <chx-button chx-type="normal" class="right" @click="rightClose">右侧列表关闭</chx-button>
          </div>
      <div slot="navbar">navbar</div>
      <div slot="list">list</div>
      <div slot="main">main</div>
      <div slot="detail">detail</div>
    </chx-layout1>
</template>
<script>
export default {
  data() {
    return {
      containerSetting: {
        header: {
          show: true,
          height: "32px",
        },
        toolbar: {
          show: true,
          height: "40px",
        },
        navbar: {
          show: true,
          width: "56px",
        },
        list: {
          show: true,
          width: "311px",
        },
        detail: {
          show: true,
          width: "356px",
        }
      },
      listShow:true,
      detailShow:true
    }
  },
  methods:{
      leftOpen(){
          this.listShow = true;
      },
      leftClose(){
          this.listShow = false;
      },
      rightOpen(){
          this.detailShow = true;
      },
      rightClose(){
          this.detailShow = false;
      }
  }
};
</script>
<style lang="less" >

.layout1{
  border: 1px solid #789;
  .header{
      line-height:32px;
      text-align:center;
  }
  .toolbar{
      line-height:40px;
      text-align:center;
      .chx-button{
          width:120px;
          line-height: 10px;
      }
      .left{
          left:-50px;
      }
  }

  .main{
    background-color:#000;
    color:white;
    text-align:center;
  }

  .navbar{
    background-color:#ff00004d;
    line-height:673px;
  }

  .list{
    background-color:#ff00004d;
    line-height:673px;
    color:white;
  }

  .detail{
    background-color:#00ff004d;
    line-height:673px;
    color:white;
  }
}

</style>
```
:::


### Attributes
| 参数      | 说明    | 类型      | 可选值       | 默认值   |
|---------- |-------- |---------- |-------------  |-------- |
| chx-src     | 布局设置   | string    |   - |     参考如下※1    |
| chx-list-show | 左侧列表面板显示 | string   |  true/false  |  true  |
| chx-detail-show | 右侧详情面板显示 | string   |  true/false  |  true  |

> ※1 chx-src 的默认值

```
{
    header: {
        show: true,
        height: '32px',
        class: 'header'
    },
    toolbar: {
        show: true,
        height: '40px',
        class: 'toolbar'
    },
    navbar: {
        show: true,
        width: '56px',
        class: 'navbar'
    },
    list: {
        show: true,
        width: '200px',
        class: 'list'
    },
    detail: {
        show: true,
        width: '200px',
        class: 'detail'
    }
}

```
