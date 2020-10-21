## Container 布局容器
用于布局的容器组件，方便快速搭建页面的基本结构：

`<el-container>`：外层容器。当子元素中包含 `<el-header>` 或 `<el-footer>` 时，全部子元素会垂直上下排列，否则会水平左右排列。

`<el-header>`：顶栏容器。

`<el-aside>`：侧边栏容器。

`<el-main>`：主要区域容器。

`<el-footer>`：底栏容器。

:::tip
以上组件采用了 flex 布局，使用前请确定目标浏览器是否兼容。此外，`<el-container>` 的子元素只能是后四者，后四者的父元素也只能是 `<el-container>`。
:::

### 实例1

:::demo 本实例为CheX-bim的布局示意图
```html
<template>
    <chx-container1 :containerSetting="containerSetting" :listShow="true" :detailShow="true">
      <div slot="header">header</div>
      <div slot="toolbar">toolbar</div>
      <div slot="navbar">navbar</div>
      <div slot="list">list</div>
      <div slot="main">main</div>
      <div slot="detail">detail</div>
    </chx-container1>
</template>

<script>
export default {
  data() {
    return {
      containerSetting: {
        header: {
          show: true,
          height: "30px",
        },
        toolbar: {
          show: true,
          height: "70px",
        },
        navbar: {
          show: true,
          width: "100px",
        },
        list: {
          show: true,
          width: "200px",
        },
        detail: {
          show: true,
          width: "300px",
        }
      }
    }
  }
};
</script>
<style lang="less" scoped>
.chx-container1 {
  height: 768px;
  width: 1024px;
    /deep/ .el-header{
      .header{
        background-color: #999999;
      }
      .toolbar{
        background-color: #898999;
      }
    }
    /deep/ .el-container{
        .navbar{
          background-color: #797999;
        }
        .main{
          background-color: #696999;
        }
        .detail{
          background-color: #595999;
        }
        .list{
          background-color: #496999;
        }
      }
  }
</style>
```
:::

### ChxContainer1 Attributes
| 参数    | 说明     | 类型    | 可选值      | 默认值 |
|---------|----------|---------|-------------|--------|
| containerSetting | 子元素的渲染和宽高 | object | header/toolbar/navbar/list/detail | show:true&width,height:*px |
| header | header元素的渲染和高度 | object | show:true/show:false height:*px | show:true&height:30px |
| toolbar | toolbar元素的渲染和高度 | object | show:true/show:false height:*px | show:true&height:30px |
| navbar | navbar元素的渲染和宽度 | object | show:true/show:false width:*px | show:true&width:200px |
| list | list元素的渲染和宽度 | object | show:true/show:false width:*px | show:true&width:200px |
| detail | detail元素的渲染和宽度 | object | show:true/show:false width:*px | show:true&width:200px |
| listShow | 切换list元素的显示和隐藏 | object | true/false | true |
| detailShow | 切换detail元素的显示和隐藏 | object | true/false | true |
