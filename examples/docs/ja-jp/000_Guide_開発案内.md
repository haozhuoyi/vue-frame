## Guid 开发指南

Element-UIをベースにして、CheX Webに使われたコンポーネントをまとめます。

### 文件结构

```
.
├── examples
├── node_modules
├── packages    //CheX UIのライブラリー
│   ├── assets
│   │    ├── elementui    //CheXの画面設計によって、element-uiのスタイルをカストマイズしたCSSです。
│   │    └── icon    //CheXに使われてるicon
│   │         └── svg    //CheXに使われてるsvgファイル
│   │              ├── basictool.svg
│   │              ├── brush.svg
│   │              └── ...
│   └── ui    //CheX UI
│        ├── button
│        └── ...
└── exaponents
    ├── ...
    │  
    └── docs    //MDファイル
         ├── en-us    //英語版
         ├── ja-jp    //日本語版
         └── zh-cn    //中国語版


```

### CheX UIの使い方

`main.js`に、以下のコードを入れるとCheXUIが使えます。
```javascript
//コンポーネントをインポートする
import CheXUI from '../packages/ui'

//コンポーネントをリジェストーする
Vue.use(CheXUI)

//CSSファイルをインポートする
import "../packages/assets/elementui/index.css";

```

### MDファイル編集

ファル名：[ソート用番号]\_[コンポーネント英語名]\_[コンポーネント名称].md ， MDファイルを`/examples/docs/`の配下の言語フォルダに置きます。
| フォルダ      | 言語    |
|---------- |-------- |
| en-us     | 英語   |
| ja-jp | 日本語 |
| zh-cn | 中国語 |
