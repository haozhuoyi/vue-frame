## Table表格组件
封装了element-ui的el-table，继承了el-table的部分属性和方法。
用于展示多条结构类似的数据，可对数据进行排序、筛选、对比或其他自定义操作。

### 基础用法

基础的表格展示用法。

:::demo 使用`<chx-table>`标签，css样式已定制
```html
<chx-table ref="userTable"
        height="500px"
        :data="tableData"
        chxSort
        chxHighlightCurrentRow
        :row-contextmenu="rowContextmenu"
        oncontextmenu="return false;"
        onselectstart="return false;">
<el-table-column prop="NAME"
                    label="USER_NAME"
                    min-width="100">
</el-table-column>
<el-table-column prop="MAILADDRESS"
                    label="MAILADDRESS">
</el-table-column>
<el-table-column
                    prop="BELONGING_NAME"
                    label="BELONGING_NAME"
                    min-width="80">
</el-table-column>
<el-table-column prop="AUTHORITY_NAME"
                    label="AUTH_NAME"
                    min-width="140">
</el-table-column>
<el-table-column prop="PROCEDURE"
                    label="REMARKS"
                    min-width="150">
</el-table-column>
</chx-table>
<script>
export default {
  data() {
    return {
      tableData:[{"NO":551,"USER_ID":"asdes","NAME":"qwqw","PHONETIC":"asasa","MAILADDRESS":"qwdqwdqwdgwbec@q.com","AUTHORITY_NO":2,"BELONGING_NO":117,"BELONGING_NAME":"fwewefew01","PROCEDURE_INSERT_USER":1,"PROCEDURE_UPDATE_MAILADDRESS":0,"LAST_UPDATE":"2020-09-23 16:30:57","AUTHORITY_NAME":"一般","i18n":"UserManagementU.AUTHORITY_NAME2"},{"NO":503,"USER_ID":"kohata","NAME":"木幡","PHONETIC":"こはた","MAILADDRESS":"kazuya.kohata@ysl.co.jp","AUTHORITY_NO":2,"BELONGING_NO":2,"BELONGING_NAME":"開発部","PROCEDURE_INSERT_USER":0,"PROCEDURE_UPDATE_MAILADDRESS":0,"LAST_UPDATE":"2020-08-03 14:34:05","AUTHORITY_NAME":"一般","i18n":"UserManagementU.AUTHORITY_NAME2"},{"NO":1,"USER_ID":"mawl","NAME":"馬 文龍","PHONETIC":"mawenlong","MAILADDRESS":"mawl@ysl.co.jp","AUTHORITY_NO":1,"BELONGING_NO":6,"BELONGING_NAME":"belongingName","PROCEDURE_INSERT_USER":0,"PROCEDURE_UPDATE_MAILADDRESS":0,"LAST_UPDATE":"2020-09-12 14:45:18","AUTHORITY_NAME":"プロジェクト管理者","i18n":"UserManagementU.AUTHORITY_NAME1"},{"NO":493,"USER_ID":"mawlTest","NAME":"馬　文龍","PHONETIC":"mawenlong1","MAILADDRESS":"1170664986@qq.com","AUTHORITY_NO":2,"BELONGING_NO":21,"BELONGING_NAME":"(所属なし)","PROCEDURE_INSERT_USER":0,"PROCEDURE_UPDATE_MAILADDRESS":0,"LAST_UPDATE":"2020-10-16 10:59:32","AUTHORITY_NAME":"一般","i18n":"UserManagementU.AUTHORITY_NAME2"},{"NO":519,"USER_ID":"test2","NAME":"test2","PHONETIC":"ceshi211","MAILADDRESS":"test2@ysl.co.jp","AUTHORITY_NO":1,"BELONGING_NO":6,"BELONGING_NAME":"belongingName","PROCEDURE_INSERT_USER":0,"PROCEDURE_UPDATE_MAILADDRESS":0,"LAST_UPDATE":"2020-09-11 15:03:01","AUTHORITY_NAME":"プロジェクト管理者","i18n":"UserManagementU.AUTHORITY_NAME1"},{"NO":481,"USER_ID":"test123","NAME":"test123","PHONETIC":"test123","MAILADDRESS":"18738782182@163.com","AUTHORITY_NO":2,"BELONGING_NO":2,"BELONGING_NAME":"開発部","PROCEDURE_INSERT_USER":0,"PROCEDURE_UPDATE_MAILADDRESS":0,"LAST_UPDATE":"2020-09-15 17:07:40","AUTHORITY_NAME":"一般","i18n":"UserManagementU.AUTHORITY_NAME2"},{"NO":4,"USER_ID":"wangzh","NAME":"王志浩","PHONETIC":"wangzhihao","MAILADDRESS":"wangzh@ysl.co.jp","AUTHORITY_NO":1,"BELONGING_NO":2,"BELONGING_NAME":"開発部","PROCEDURE_INSERT_USER":0,"PROCEDURE_UPDATE_MAILADDRESS":1,"LAST_UPDATE":"2020-08-27 11:13:14","AUTHORITY_NAME":"プロジェクト管理者","i18n":"UserManagementU.AUTHORITY_NAME1"},{"NO":494,"USER_ID":"wangzh11","NAME":"2王志浩","PHONETIC":"wangzhihao","MAILADDRESS":"y139148y@126.com","AUTHORITY_NO":2,"BELONGING_NO":18,"BELONGING_NAME":"開発部12","PROCEDURE_INSERT_USER":0,"PROCEDURE_UPDATE_MAILADDRESS":0,"LAST_UPDATE":"2020-10-14 16:02:24","AUTHORITY_NAME":"一般","i18n":"UserManagementU.AUTHORITY_NAME2"},{"NO":523,"USER_ID":"wangzh12","NAME":"王志浩","PHONETIC":"wangzhihao","MAILADDRESS":"wangzh@ysl.co.jp","AUTHORITY_NO":2,"BELONGING_NO":2,"BELONGING_NAME":"開発部","PROCEDURE_INSERT_USER":0,"PROCEDURE_UPDATE_MAILADDRESS":1,"LAST_UPDATE":"2020-09-27 15:37:03","AUTHORITY_NAME":"一般","i18n":"UserManagementU.AUTHORITY_NAME2"},{"NO":483,"USER_ID":"yoshioka","NAME":"yoshioka","PHONETIC":"よしおか","MAILADDRESS":"daisuke.yoshioka@ysl.co.jp","AUTHORITY_NO":2,"BELONGING_NO":19,"BELONGING_NAME":"test1\\\\\\//?>;\"","PROCEDURE_INSERT_USER":0,"PROCEDURE_UPDATE_MAILADDRESS":0,"LAST_UPDATE":"2020-10-16 12:03:47","AUTHORITY_NAME":"一般","i18n":"UserManagementU.AUTHORITY_NAME2"},{"NO":564,"USER_ID":"yuhll","NAME":"余华","PHONETIC":"yuhualiang","MAILADDRESS":"1173922405@qq.com","AUTHORITY_NO":1,"BELONGING_NO":2,"BELONGING_NAME":"開発部","PROCEDURE_INSERT_USER":0,"PROCEDURE_UPDATE_MAILADDRESS":0,"LAST_UPDATE":"2020-09-27 16:18:59","AUTHORITY_NAME":"プロジェクト管理者","i18n":"UserManagementU.AUTHORITY_NAME1"},{"NO":567,"USER_ID":"yuhll1","NAME":"余华1","PHONETIC":"yuhualiang","MAILADDRESS":"1173922405@qq.com","AUTHORITY_NO":2,"BELONGING_NO":2,"BELONGING_NAME":"開発部","PROCEDURE_INSERT_USER":0,"PROCEDURE_UPDATE_MAILADDRESS":0,"LAST_UPDATE":"2020-09-27 16:18:59","AUTHORITY_NAME":"一般","i18n":"UserManagementU.AUTHORITY_NAME2"},{"NO":569,"USER_ID":"yuhll2","NAME":"余华3","PHONETIC":"yuhualiang","MAILADDRESS":"yuhl3@ysl.co.jp","AUTHORITY_NO":1,"BELONGING_NO":2,"BELONGING_NAME":"開発部","PROCEDURE_INSERT_USER":0,"PROCEDURE_UPDATE_MAILADDRESS":0,"LAST_UPDATE":"2020-09-27 16:18:59","AUTHORITY_NAME":"プロジェクト管理者","i18n":"UserManagementU.AUTHORITY_NAME1"}]
    }
  },
  methods: {
        // show user Contextmenu
        rowContextmenu (row, column, event) {

        },
  },
};
</script>
<style lang="less" >
.el-table{
    .el-table__header-wrapper{
        .el-table__header{
            margin: 0;
        }
    }

    td{
        padding: 6px 0 !important;
    }
}
</style>
```
:::

### Attributes
| 参数      | 说明    | 类型      | 可选值       | 默认值   |
|---------- |-------- |---------- |-------------  |-------- |
| data     | 显示的数据   | Array    |   - |    -    |
| chx-sort     | 是否开启点击列头排序功能   | Boolean    |   - |     false    |
| chx-highlight-current-row     | 是否要高亮当前行（可多选）   | Boolean    |   - |    false    |
| size     | Table 的尺寸   | String    |   medium/small/mini |    -    |
| height     | Table 的高度。如果 height 为 number 类型，单位 px；如果 height 为 string 类型，则这个高度会设置为 Table 的 style.height 的值，Table 的高度会受控于外部样式。   | String/Number    |   - |    100%    |
| tooltip-effect     | tooltip effect 属性   | String    |   dark/light |    -    |
| cell-style     | 单元格的 style 的回调方法，也可以使用一个固定的 Object 为所有单元格设置一样的 Style。   | Function({row, column, rowIndex, columnIndex})/Object    |   - |    -    |
| row-class-name     | 行的 className 的回调方法，也可以使用字符串为所有行设置一个固定的 className。   | Function({row, rowIndex})/String    |   - |    row.index = rowIndex    |
| header-cell-class-name     | 表头单元格的 className 的回调方法，也可以使用字符串为所有表头单元格设置一个固定的 className。   | Function({row, column, rowIndex, columnIndex})/String    |   - |    'thCell ' + columnIndex    |

### Events
| 事件名称      | 说明    | 回调参数      |
|---------- |-------- |---------- |-------------  |-------- |
| header-click     | 当某一列的表头被点击时会触发该事件   | column, event    |
| selection-change     | 当选择项发生变化时会触发该事件   | selection    |
| row-click     | 当某一行被点击时会触发该事件   | row, column, event    |
| row-dblclick     | 当某一行被双击时会触发该事件   | row, column, event    |
| row-contextmenu     | 当某一行被鼠标右键点击时会触发该事件   | row, column, event    |
