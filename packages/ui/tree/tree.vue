<template>

    <div>

        <el-tree lazy
                 ref="tree"
                 class="chxtree"
                 :node-key="nodeKey"
                 :indent="0"
                 :load="loadNode"
                 :props="props"
                 :check-on-click-node="true"
                 :expand-on-click-node="false"
                 :render-content="renderContent"
                 :default-expanded-keys="defaultExpandedKeys"
                 icon-class="chxtree_expand_icon"
                 @node-contextmenu="handleNodeContextmenu"
                 @node-expand="handleNodeExpand"
                 @node-collapse="handleNodeCollapse"
                 @node-click="handleNodeClick"
                 @current-change="handleCurrentChange">
        </el-tree>
    </div>
</template>
<script>

export default {
    name: 'ChxTree',
    props: {
        /** chx配套懒加载 两个参数：第一个是node，第二个是执行方法 */
        chxLoad: Function,
        props: {
            default () {
                return {label: 'FILE_NAME', id: 'NO', isLeaf: 'leaf'}
            }
        },
        defaultExpandedKeys: {
            type: Array,
            default: () => [1]
        },
        nodeKey: {
            type: String,
            default: ''
        },
        /** chx配套懒加载 缓存已经加载过的子文件夹 */
        chxNeedCache: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            preSelectedNode: null,
            selectedNode: null
        }
    },
    watch: {

    },
    mounted () {
        console.log('chx-tree:mounted:')

    },
    methods: {
        // 配合懒加载，局部加载node
        loadNode (node, resolve) {
            console.log('chx-tree:nodeLoad', node)
            this.chxLoad(node, resolve)
        },
        handleNodeContextmenu (event, Object, Node) {

        },
        handleNodeExpand (nodeData, node, instance) {
            this.$emit('chxNodeExpand')
        },
        handleNodeCollapse (nodeData, node, instance) {
            this.$emit('chxNodeCollapse')

            // 缓存开关
            if (!this.chxNeedCache) {
                node.loaded = false
            }

            // 如果选中的节点在子节点中，收起后，选中当前节点
            if (this.selectedNode !== null && node.contains(this.selectedNode)) {
                this.selectNode(node)
            }
        },
        handleNodeClick () {

        },
        // カスタム tree
        renderContent (h, {node, data, store}) {
            return (
                <span class='renderContent'
                    ondblclick={(event) => this.handleNodeDbclick(data, event)}
                    onclick={(event) => this.handleNodeClick(data, event)}
                >
                    <i class='childIcon'></i>
                    <span class='childLabel'>{node.label}</span>
                </span>
            )
        },
        handleNodeDbclick (data, event) {
            const node = this.$refs.tree.getNode(data.NO)
            node.expand()
        },
        handleNodeClick (data, event) {

        },
        handleCurrentChange (data, node) {
            this.selectedNode = node
            if (this.preSelectedNode !== null && this.preSelectedNode.key === node.key) {
                return
            }
            console.log('handleCurrentChange')

            this.$emit('chx-current-change', node.data, node)
            this.preSelectedNode = node
        },
        setCurrentNode (node) {
            this.selectedNode = node
            this.$refs.tree.setCurrentKey(node.key)
            this.$emit('chx-current-change', node.data, node)
            this.preSelectedNode = node
        },
        setCurrentNodeByKey (key) {
            const node = this.$refs.tree.getNode(key)
            this.setCurrentNode(node)
        },
        expandNodeByKey (key) {
            const node = this.$refs.tree.getNode(key)
            node.expand()
        },
        expandNodeByNode (node) {
            node.expand()
        },
        appendChildren (parentNode, data) {
            data.forEach(item => {
                this.$refs.tree.append(item, parentNode)
            })
        }
    }

}
</script>

<style lang="less" scoped>
@import './tree.less';
</style>
