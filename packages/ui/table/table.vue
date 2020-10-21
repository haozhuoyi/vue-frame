
<template>
    <el-table
        ref="ChxTable"
        :data="data"
        :size="size"
        :height="height"
        :tooltip-effect="tooltipEffect"
        :row-class-name="rowClassName"
        :cell-style="cellStyle.length === 0 ? cellStyleEvent : cellStyle"
        :header-cell-class-name="headerCellClassName"
        @header-click="headerClickEvent"
        @selection-change="selectionChangeEvent"
        @row-click="rowClickEvent"
        @row-contextmenu="rowContextmenuEvent"
        @row-dblclick="rowDblclickEvent">
        <slot></slot>
    </el-table>
</template>
<script>

export default {
    name: 'ChxTable',
    props: {
        data: { // 表格数据
            type: Array,
            default: () => []
        },
        chxSort: {
            type: Boolean,
            default: false
        },
        chxHighlightCurrentRow: {
            type: Boolean,
            default: false
        },
        size: {
            type: String,
            default: ''
        },
        height: {
            type: [String, Number],
            default: '100%'
        },
        tooltipEffect: {
            type: String,
            default: ''
        },
        cellStyle: {
            type: [Function, Object],
            default: () => {}
        },
        rowClassName: {
            type: [Function, String],
            default: ({row, rowIndex}) => {
                row.index = rowIndex
            }
        },
        headerCellClassName: {
            type: [Function, String],
            default: ({columnIndex}) => {
                return 'thCell ' + columnIndex
            }
        },
        headerClick: {
            type: Function,
            default: () => {}
        },
        selectionChange: {
            type: Function,
            default: () => {}
        },
        rowClick: {
            type: Function,
            default: () => {}
        },
        rowDblclick: {
            type: Function,
            default: () => {}
        },
        rowContextmenu: {
            type: Function,
            default: () => {}
        }
    },
    data () {
        return {
            contextmenuData: {}, // データを単選で選ぶ(单选选中数据)
            multiSelectData: [], // データを選ぶ(选中数据)
            name: ''
        }
    },
    methods: {
        headerClickEvent (column, event) {
            if (this.headerClick.length !== 0) {
                this.headerClick(column, event) // 将参数传回父组件中的回调函数
            } else if (this.chxSort) {
                this.sort(column.property)
            }
        },
        selectionChangeEvent (selection) {
            this.multiSelectData = selection
            if (this.selectionChange.length !== 0) {
                this.selectionChange(selection)
            }
        },
        rowClickEvent (row, column, event) {
            if (this.rowClick.length !== 0) {
                this.rowClick(row, column, event)
            } else if (this.chxHighlightCurrentRow) {
                if (event.ctrlKey || event.metaKey) { // 键盘事件: Ctrl
                    this.contextmenuData = {}
                    this.$refs.ChxTable.toggleRowSelection(row)
                    for (let index = 0; index < this.multiSelectData.length; index++) {
                        if (this.multiSelectData[index].NO === row.NO) {
                            this.contextmenuData = row
                        }
                    }
                } else if (event.shiftKey) { // 键盘事件: Shift
                    if (row.index < this.contextmenuData.index) {
                    // 清空选中状态
                        this.$refs.ChxTable.clearSelection()
                        for (let i = row.index; i <= this.contextmenuData.index; i++) {
                            this.$refs.ChxTable.toggleRowSelection(this.data[i], true)
                        }
                    } else if (row.index > this.contextmenuData.index) {
                    // 清空选中状态
                        this.$refs.ChxTable.clearSelection()
                        for (let i = this.contextmenuData.index; i <= row.index; i++) {
                            this.$refs.ChxTable.toggleRowSelection(this.data[i], true)
                        }
                    } else if (row.index === this.contextmenuData.index) {
                        return
                    }
                } else {
                    this.cellClickEvent({row})
                }
            }
        },
        rowDblclickEvent (row, column, event) {
            this.rowDblclick(row, column, event)
        },
        rowContextmenuEvent (row, column, event) {
            this.rowContextmenu(row, column, event)
        },
        sort (name) {
            if (this.name && this.name === name) {
                this.data.reverse()
            }
            this.name = name
            this.cellClickEvent({row: this.data[0]})
        },
        // クリック選択 user
        cellClickEvent ({row}) {
            if (!row) return
            this.multiSelectData = []
            this.contextmenuData = row
            this.$refs.ChxTable.clearSelection() // 清空选中
            this.$refs.ChxTable.toggleRowSelection(row, true) // 设置选中
        },
        // 行データをレンダリングする(渲染行数据)
        cellStyleEvent ({rowIndex}) {
            for (let i = 0; i < this.multiSelectData.length; i++) {
                if (rowIndex === this.multiSelectData[i].index) {
                    return {backgroundColor: '#ccddee'}
                }
            }
        }
    }
}
</script>

<style lang="less" scoped>
@import './table.less';
</style>
