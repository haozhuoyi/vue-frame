## Segment分段组件
封装了element-ui的el-radio-group。

### 基础用法

以按钮组的方式出现，常用于多项类似操作。

:::demo 使用`<chx-segment>`标签，css样式已定制
```html
<chx-segment :chx-selected-value.sync="selectedValue" :chx-data="itemData" :chx-selected-item.sync="selectedItem" @onSelectedChange="OnSelectedChange"></chx-segment>
<br>
<br>
<chx-segment :chx-selected-value.sync="selectedValue" :chx-data="itemData" :chx-selected-item.sync="selectedItem" chx-size="medium" @onSelectedChange="OnSelectedChange"></chx-segment>
<br>
<br>
<chx-segment :chx-selected-value.sync="selectedValue" :chx-data="itemData" :chx-selected-item.sync="selectedItem" chx-size="small" @onSelectedChange="OnSelectedChange"></chx-segment>
<br>
<br>
<chx-segment :chx-selected-value.sync="selectedValue" :chx-data="itemData" :chx-selected-item.sync="selectedItem" chx-size="mini" @onSelectedChange="OnSelectedChange"></chx-segment>
<br>
<br>
<div>chx-selected-value:{{ selectedValue }}</div>
<br>
<div>chx-selected-item:{{ itemJson2 }}</div>
<script>
export default {
  data() {
    return {
      selectedValue: 1,
      itemData: [
        {
            value: 1,
            title: '小'
        },
        {
            value: 2,
            title: '中'
        },
        {
            value: 3,
            title: '大'
        }
      ],
      selectedItem: {},
      itemJson1: "",
    }
  },
  methods: {
      OnSelectedChange(item){
          this.value1 = JSON.stringify(item)
      }
  },
  computed: {
        itemJson2 () {
            return JSON.stringify(this.selectedItem)
        }
    },
};
</script>
```
:::

### Attributes
| 参数      | 说明    | 类型      | 可选值       | 默认值   |
|---------- |-------- |---------- |-------------  |-------- |
| chx-data     | 控件数据（数据格式参考如下※1）   | array    |   - |     -    |
| chx-selected-item     | 选中的控件数据对象(只返回选中结果，赋值无作用，数据格式参考如下※2)   | Object    |   - |    -    |
| chx-selected-value     | 选中的控件数据对象下标   | Number    |   选中的控件数据对象的value |    -1    |
| chx-size     | 控件格子尺寸   | string    |   medium/small/mini |     medium    |

> ※1 控件数据格式

```
[
    {
        value: 1,
        title: '小'
    },
    {
        value: 2,
        title: '中'
    },
    {
        value: 3,
        title: '大'
    }
]

```

> ※2 控件数据对象格式

```
{
    value: 1,
    title: '小'
}
```

### Events
| 事件名称      | 说明    | 回调参数      |
|---------- |-------- |---------- |-------------  |-------- |
| on-selected-change     | 选中按钮改变时触发的事件   | 选中的按钮 item 对象    |
