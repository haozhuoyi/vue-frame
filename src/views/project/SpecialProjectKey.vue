<template>
    <div id="projectlist">
        <el-dialog :visible.sync="dialogVisible"
                   :title="$t('specialProjectKey.DISPLAY_AVAILABLE_PROJECT_LIST_SELECT_TITLE')"
                   :close-on-click-modal="false"
                   :before-close="close"
                   :destroy-on-close="true"
                   class="elementuiDialog"
                   v-loading="loading"
                   :element-loading-text="$t('common.DISPLAY_UNDER_READING')"
                   element-loading-spinner="el-icon-loading"
                   element-loading-background="rgba(255,255,255,.4)">
            <div class="projectList">
                <div class="list"
                     v-for="(item, index) in projects"
                     :key="index"
                     :style="{backgroundColor: selectProject.PROJECT_KEY === item.PROJECT_KEY ? '#ccddee' : ''}"
                     @click="selectProject = item"
                     @dblclick="dblclickEvent(item)">
                    <p :title="item.PROJECT_NAME">{{ item.PROJECT_NAME }}</p>
                </div>
            </div>
            <span slot="footer"
                  class="dialog-footer">
                <button :class="['button', 'buttonHighlight', !selectProject.PROJECT_KEY ? 'disabled' : '']"
                        :disabled="!selectProject.PROJECT_KEY"
                        @click="signIn">
                    {{ $t('specialProjectKey.DISPLAY_AVAILABLE_PROJECT_LIST_LOGIN_BUTTON') }}
                </button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'Projectlist',
    data () {
        return {
            dialogVisible: false,
            loading: false,
            projectKey: '',
            username: '',
            password: '',
            projects: [],
            selectProject: {}
        }
    },
    methods: {
        project (data, projectKey, username, password) {
            this.projects = data
            this.projectKey = projectKey
            this.username = username
            this.password = password
            this.dialogVisible = true
        },
        dblclickEvent (item) {
            this.selectProject = item
            this.signIn()
        },
        signIn () {
            this.close()
            this.$emit('selectProject', this.selectProject)
        },
        close () {
            this.dialogVisible = false
        }
    }
}
</script>

<style lang="less" scoped>
@import url("../../less/views/project/SpecialProjectKey.less");
</style>
