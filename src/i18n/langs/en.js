import Message from '../message/en'
import Login from '@l/views/login/en'
import DelProject from '@l/views/project/delProject/en'
import ProjectSelection from '@l/views/project/projectSelection/en'
import SpecialProjectKey from '@l/views/project/specialProjectKey/en'
import CloseDialog from '@l/components/CloseDialog/en'
import DetailedSearch from '@l/components/DetailedSearch/en'
import Files from '@l/pages/Files/Files/en'
import AllFiles from '@l/pages/Files/AllFiles/AllFiles/en'
import AllFilesHeader from '@l/pages/Files/AllFiles/AllFilesHeader/en'
import Dustbin from '@l/pages/Files/Dustbin/Dustbin/en'
import DustbinHeader from '@l/pages/Files/Dustbin/DustbinHeader/en'
import DustbinTable from '@l/pages/Files/Dustbin/DustbinTable/en'
import Edit from '@l/pages/Files/AllFiles/TreeTable/Edit/en'
import ListTable from '@l/pages/Files/AllFiles/TreeTable/ListTable/en'
import TreeTable from '@l/pages/Files/AllFiles/TreeTable/TreeTable/en'
import Email from '@l/pages/Files/AllFiles/Email/Email/en'
import EmailAddress from '@l/pages/Files/AllFiles/Email/EmailAddress/en'
import SendUserList from '@l/components/EmailComponents/SendUserList/en'
import UserList from '@l/components/EmailComponents/UserList/en'
import EmailTemplateSelection from '@l/pages/Files/AllFiles/Email/EmailTemplateSelection/en'
import EmailTemplateManagement from '@l/pages/Files/AllFiles/Email/EmailTemplateManagement/en'
import EmailListEdit from '@l/pages/Files/AllFiles/Email/EmailListEdit/en'
import EmailListEditAdd from '@l/pages/Files/AllFiles/Email/EmailListEditAdd/en'
import CreateSnapShot from '@l/pages/Files/AllFiles/Snapshot/CreateSnapShot/en'
import Snapshot from '@l/pages/Files/AllFiles/Snapshot/Snapshot/en'
import SnapshotHeader from '@l/pages/Files/AllFiles/Snapshot/SnapshotHeader/en'
import Thumbnail from '@l/pages/Files/AllFiles/Thumbnail/Thumbnail/en'
import MoveAndCopy from '@l/pages/Files/AllFiles/Move/MoveAndCopy/en'
import Index from '@l/pages/UserManagement/Index/en'
import UserManagementU from '@l/pages/UserManagement/UserManagementU/UserManagementU/en'
import GroupManagement from '@l/pages/UserManagement/GroupManagement/GroupManagement/en'
import GroupEdit from '@l/pages/UserManagement/GroupManagement/components/GroupEdit/en'
import GroupUser from '@l/pages/UserManagement/GroupManagement/components/GroupUser/en'
import GroupUserEdit from '@l/pages/UserManagement/GroupManagement/components/GroupUserEdit/en'
import PermissionManagement from '@l/pages/UserManagement/PermissionManagement/PermissionManagement/en'
import UserConfirmationWithinTheGroup from '@l/pages/UserManagement/PermissionManagement/UserConfirmationWithinTheGroup/en'
import TabGroup from '@l/pages/UserManagement/PermissionManagement/tabsView/components/TabGroup/en'
import Table from '@l/pages/UserManagement/PermissionManagement/tabsView/components/Table/en'
import Tabs from '@l/pages/UserManagement/PermissionManagement/tabsView/components/Tabs/en'
import TabUser from '@l/pages/UserManagement/PermissionManagement/tabsView/components/TabUser/en'
import FileAccessDialog from '@l/pages/UserManagement/PermissionManagement/tabsView/dialog/FileAccessDialog/en'
import FileAccessDialogList from '@l/pages/UserManagement/PermissionManagement/tabsView/dialog/FileAccessDialogList/en'
import FileAccessGroupListDialog from '@l/pages/UserManagement/PermissionManagement/tabsView/dialog/FileAccessGroupListDialog/en'
import FileTree from '@l/pages/UserManagement/PermissionManagement/tabsView/file/FileTree/en'
import ListTableU from '@l/pages/UserManagement/PermissionManagement/tabsView/file/ListTable/en'
import UserAccessDialog from '@l/pages/UserManagement/PermissionManagement/tabsView/user/UserAccessDialog/en'
import Upload from '@l/components/Uploader/Upload/en'
import BodyTable from '@l/components/Uploader/BodyTable/en'
import CoverToConfirm from '@l/components/Uploader/CoverToConfirm/en'
import Inquiry from '@l/pages/Settings/Box/Inquiry/en'
import LicenseSetting from '@l/pages/Settings/Box/LicenseSetting/en'
import Transformation from '@l/pages/Settings/Box/Transformation/en'
import Header from '@l/views/Header/en'
import Aside from '@l/views/Aside/en'
import ForgetThePassword from '@l/views/ForgetThePassword/en'
import LoginReset from '@l/views/LoginReset/en'
import PasswordSetting from '@l/views/PasswordSetting/en'

const en = {
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
            clear: 'Clear',
            confirm: 'OK'
        }
    },
    common: {
        EDIT: 'Edit',
        DELETE: 'Delete',
        CANCEL: 'Cancel',
        YES: 'Yes',
        NO: 'No',
        Password: 'Password',
        DialogConfirmCancelTitle: 'Cancel confirmation',
        DialogConfirmCancelContent: 'Closing the editing screen destroys the edited content. <br /><br />Would you like it?',
        DialogConfirmCancelButton1: 'Keep editing',
        DialogConfirmCancelButton2: 'Destroy',
        DISPLAY_UNDER_READING: 'Loading'
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

export default en
