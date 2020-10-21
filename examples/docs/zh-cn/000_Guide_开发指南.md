## Guid 开发指南

本节介绍在Element-UI基础上，定制的CheX Web中自定义的组件的使用。

### 文件结构

```
.
├── examples
├── node_modules
├── packages    //CheX风格定制库
│   ├── assets
│   │    ├── elementui    //根据CheX风格，定制的elementui样式
│   │    └── icon    //CheX风格中用到的icon集合
│   │         └── svg    //CheX风格中用到的svg集合
│   │              ├── basictool.svg
│   │              ├── brush.svg
│   │              └── ...
│   └── ui    //根据CheX UI
│        ├── button
│        └── ...
└── exaponents
    ├── ...
    │
    └── docs
         ├── en-us    //英文文档
         ├── ja-jp    //日文文档
         └── zh-cn    //中文文档


```

### 使用CheX UI

在main.js中写入以下内容：
```javascript
//导入组件
import CheXUI from '../packages/ui'

//注册组件
Vue.use(CheXUI)

//按需导入css
import "../packages/assets/elementui/index.css";

```

### 编辑文档

文档文件名：[编号]\_[组件英文名称]\_[组件名称].md 的方式，放到 `/examples/docs/`下对应的语言文件夹中。其中：
| 文件夹      | 语言    |
|---------- |-------- |
| en-us     | 英文   |
| ja-jp | 日文 |
| zh-cn | 中文 |

### 开发规则

> 目标：确保功能扩展，而不是功能覆盖，保留原控件的可扩展性。保留原element-ui的原有特性的基础上，增加CheX控件的特性和特征。

- 原则上继承element-ui的控件进行定制。
- 不覆盖element-ui控件的已有属性。
- 新加属性采用 `chx-property` 的形式。如：chx-type:指定类型；chx-icon:指定CheX中专属icon等。
- 控件一律采用 `ChexTag` 的形式。如：按钮：ChexButton；分段控件：ChexSegment。


### 自定义控件列表

> 按制作时间排序

No | 控件英文 | 控件名称 | 功能说明
---------|----------|---------|---------
 001 | ChxButton | 按钮 | 定制图标、颜色和动画特效
 002 | ChxLayout | 布局集合 | 收集使用中的布局（CheX、Laxsy、AQuick、BIM)
 003 | ChxSegment | 分段控件 | 定制颜色和特效
