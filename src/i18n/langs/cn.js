import Message from '../message/cn'
import Login from '@l/views/login/cn'
import DelProject from '@l/views/project/delProject/cn'
import ProjectSelection from '@l/views/project/projectSelection/cn'
import SpecialProjectKey from '@l/views/project/specialProjectKey/cn'
import CloseDialog from '@l/components/CloseDialog/cn'
import DetailedSearch from '@l/components/DetailedSearch/cn'
import Files from '@l/pages/Files/Files/cn'
import AllFiles from '@l/pages/Files/AllFiles/AllFiles/cn'
import AllFilesHeader from '@l/pages/Files/AllFiles/AllFilesHeader/cn'
import Dustbin from '@l/pages/Files/Dustbin/Dustbin/cn'
import DustbinHeader from '@l/pages/Files/Dustbin/DustbinHeader/cn'
import DustbinTable from '@l/pages/Files/Dustbin/DustbinTable/cn'
import Edit from '@l/pages/Files/AllFiles/TreeTable/Edit/cn'
import ListTable from '@l/pages/Files/AllFiles/TreeTable/ListTable/cn'
import TreeTable from '@l/pages/Files/AllFiles/TreeTable/TreeTable/cn'
import Email from '@l/pages/Files/AllFiles/Email/Email/cn'
import EmailAddress from '@l/pages/Files/AllFiles/Email/EmailAddress/cn'
import SendUserList from '@l/components/EmailComponents/SendUserList/cn'
import UserList from '@l/components/EmailComponents/UserList/cn'
import EmailTemplateSelection from '@l/pages/Files/AllFiles/Email/EmailTemplateSelection/cn'
import EmailTemplateManagement from '@l/pages/Files/AllFiles/Email/EmailTemplateManagement/cn'
import EmailListEdit from '@l/pages/Files/AllFiles/Email/EmailListEdit/cn'
import EmailListEditAdd from '@l/pages/Files/AllFiles/Email/EmailListEditAdd/cn'
import CreateSnapShot from '@l/pages/Files/AllFiles/Snapshot/CreateSnapShot/cn'
import Snapshot from '@l/pages/Files/AllFiles/Snapshot/Snapshot/cn'
import SnapshotHeader from '@l/pages/Files/AllFiles/Snapshot/SnapshotHeader/cn'
import Thumbnail from '@l/pages/Files/AllFiles/Thumbnail/Thumbnail/cn'
import MoveAndCopy from '@l/pages/Files/AllFiles/Move/MoveAndCopy/cn'
import Index from '@l/pages/UserManagement/Index/cn'
import UserManagementU from '@l/pages/UserManagement/UserManagementU/UserManagementU/cn'
import GroupManagement from '@l/pages/UserManagement/GroupManagement/GroupManagement/cn'
import GroupEdit from '@l/pages/UserManagement/GroupManagement/components/GroupEdit/cn'
import GroupUser from '@l/pages/UserManagement/GroupManagement/components/GroupUser/cn'
import GroupUserEdit from '@l/pages/UserManagement/GroupManagement/components/GroupUserEdit/cn'
import PermissionManagement from '@l/pages/UserManagement/PermissionManagement/PermissionManagement/cn'
import UserConfirmationWithinTheGroup from '@l/pages/UserManagement/PermissionManagement/UserConfirmationWithinTheGroup/cn'
import TabGroup from '@l/pages/UserManagement/PermissionManagement/tabsView/components/TabGroup/cn'
import Table from '@l/pages/UserManagement/PermissionManagement/tabsView/components/Table/cn'
import Tabs from '@l/pages/UserManagement/PermissionManagement/tabsView/components/Tabs/cn'
import TabUser from '@l/pages/UserManagement/PermissionManagement/tabsView/components/TabUser/cn'
import FileAccessDialog from '@l/pages/UserManagement/PermissionManagement/tabsView/dialog/FileAccessDialog/cn'
import FileAccessDialogList from '@l/pages/UserManagement/PermissionManagement/tabsView/dialog/FileAccessDialogList/cn'
import FileAccessGroupListDialog from '@l/pages/UserManagement/PermissionManagement/tabsView/dialog/FileAccessGroupListDialog/cn'
import FileTree from '@l/pages/UserManagement/PermissionManagement/tabsView/file/FileTree/cn'
import ListTableU from '@l/pages/UserManagement/PermissionManagement/tabsView/file/ListTable/cn'
import UserAccessDialog from '@l/pages/UserManagement/PermissionManagement/tabsView/user/UserAccessDialog/cn'
import Upload from '@l/components/Uploader/Upload/cn'
import BodyTable from '@l/components/Uploader/BodyTable/cn'
import CoverToConfirm from '@l/components/Uploader/CoverToConfirm/cn'
import Inquiry from '@l/pages/Settings/Box/Inquiry/cn'
import LicenseSetting from '@l/pages/Settings/Box/LicenseSetting/cn'
import Transformation from '@l/pages/Settings/Box/Transformation/cn'
import Header from '@l/views/Header/cn'
import Aside from '@l/views/Aside/cn'
import ForgetThePassword from '@l/views/ForgetThePassword/cn'
import LoginReset from '@l/views/LoginReset/cn'
import PasswordSetting from '@l/views/PasswordSetting/cn'

const cn = {
    langList: {
        cn: '中文',
        en: 'English',
        ja: '日本語'
    },
    el: {
        tree: {
            emptyText: ''
        },
        colorpicker: {
            clear: '清除',
            confirm: 'OK'
        }
    },
    common: {
        EDIT: '编辑',
        DELETE: '删除',
        CANCEL: '取消',
        YES: '是',
        NO: '否',
        Password: '密码',
        DialogConfirmCancelTitle: '取消确认',
        DialogConfirmCancelContent: '关闭编辑画面后，编辑的内容将被废弃。<br /><br />确定吗？',
        DialogConfirmCancelButton1: '继续编辑',
        DialogConfirmCancelButton2: '确认关闭',
        DISPLAY_UNDER_READING: '正在载入'
    },
    ...Header,
    ...Aside,
    ...Message,
    ...Login,
    ...ProjectSelection,
    ...DelProject,
    ...SpecialProjectKey,
    ...Files,
    ...AllFiles,
    ...AllFilesHeader,
    ...Dustbin,
    ...DustbinHeader,
    ...DustbinTable,
    ...Edit,
    ...ListTable,
    ...TreeTable,
    ...Email,
    ...EmailAddress,
    ...SendUserList,
    ...UserList,
    ...EmailTemplateSelection,
    ...EmailTemplateManagement,
    ...CreateSnapShot,
    ...Snapshot,
    ...SnapshotHeader,
    ...Thumbnail,
    ...CloseDialog,
    ...DetailedSearch,
    ...EmailListEdit,
    ...EmailListEditAdd,
    ...MoveAndCopy,
    ...Index,
    ...UserManagementU,
    ...GroupManagement,
    ...GroupEdit,
    ...GroupUser,
    ...GroupUserEdit,
    ...PermissionManagement,
    ...UserConfirmationWithinTheGroup,
    ...TabGroup,
    ...Table,
    ...Tabs,
    ...TabUser,
    ...FileAccessDialog,
    ...FileAccessDialogList,
    ...FileAccessGroupListDialog,
    ...FileTree,
    ...ListTableU,
    ...UserAccessDialog,
    ...Upload,
    ...BodyTable,
    ...CoverToConfirm,
    ...Inquiry,
    ...LicenseSetting,
    ...Transformation,
    ...ForgetThePassword,
    ...LoginReset,
    ...PasswordSetting
}

export default cn
