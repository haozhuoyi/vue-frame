import Message from '../message/ja'
import Login from '@l/views/login/ja'
import DelProject from '@l/views/project/delProject/ja'
import ProjectSelection from '@l/views/project/projectSelection/ja'
import SpecialProjectKey from '@l/views/project/specialProjectKey/ja'
import CloseDialog from '@l/components/CloseDialog/ja'
import DetailedSearch from '@l/components/DetailedSearch/ja'
import Files from '@l/pages/Files/Files/ja'
import AllFiles from '@l/pages/Files/AllFiles/AllFiles/ja'
import AllFilesHeader from '@l/pages/Files/AllFiles/AllFilesHeader/ja'
import Dustbin from '@l/pages/Files/Dustbin/Dustbin/ja'
import DustbinHeader from '@l/pages/Files/Dustbin/DustbinHeader/ja'
import DustbinTable from '@l/pages/Files/Dustbin/DustbinTable/ja'
import Edit from '@l/pages/Files/AllFiles/TreeTable/Edit/ja'
import ListTable from '@l/pages/Files/AllFiles/TreeTable/ListTable/ja'
import TreeTable from '@l/pages/Files/AllFiles/TreeTable/TreeTable/ja'
import Email from '@l/pages/Files/AllFiles/Email/Email/ja'
import EmailAddress from '@l/pages/Files/AllFiles/Email/EmailAddress/ja'
import SendUserList from '@l/components/EmailComponents/SendUserList/ja'
import UserList from '@l/components/EmailComponents/UserList/ja'
import EmailTemplateSelection from '@l/pages/Files/AllFiles/Email/EmailTemplateSelection/ja'
import EmailTemplateManagement from '@l/pages/Files/AllFiles/Email/EmailTemplateManagement/ja'
import EmailListEdit from '@l/pages/Files/AllFiles/Email/EmailListEdit/ja'
import EmailListEditAdd from '@l/pages/Files/AllFiles/Email/EmailListEditAdd/ja'
import CreateSnapShot from '@l/pages/Files/AllFiles/Snapshot/CreateSnapShot/ja'
import Snapshot from '@l/pages/Files/AllFiles/Snapshot/Snapshot/ja'
import SnapshotHeader from '@l/pages/Files/AllFiles/Snapshot/SnapshotHeader/ja'
import Thumbnail from '@l/pages/Files/AllFiles/Thumbnail/Thumbnail/ja'
import MoveAndCopy from '@l/pages/Files/AllFiles/Move/MoveAndCopy/ja'
import Index from '@l/pages/UserManagement/Index/ja'
import UserManagementU from '@l/pages/UserManagement/UserManagementU/UserManagementU/ja'
import GroupManagement from '@l/pages/UserManagement/GroupManagement/GroupManagement/ja'
import GroupEdit from '@l/pages/UserManagement/GroupManagement/components/GroupEdit/ja'
import GroupUser from '@l/pages/UserManagement/GroupManagement/components/GroupUser/ja'
import GroupUserEdit from '@l/pages/UserManagement/GroupManagement/components/GroupUserEdit/ja'
import PermissionManagement from '@l/pages/UserManagement/PermissionManagement/PermissionManagement/ja'
import UserConfirmationWithinTheGroup from '@l/pages/UserManagement/PermissionManagement/UserConfirmationWithinTheGroup/ja'
import TabGroup from '@l/pages/UserManagement/PermissionManagement/tabsView/components/TabGroup/ja'
import Table from '@l/pages/UserManagement/PermissionManagement/tabsView/components/Table/ja'
import Tabs from '@l/pages/UserManagement/PermissionManagement/tabsView/components/Tabs/ja'
import TabUser from '@l/pages/UserManagement/PermissionManagement/tabsView/components/TabUser/ja'
import FileAccessDialog from '@l/pages/UserManagement/PermissionManagement/tabsView/dialog/FileAccessDialog/ja'
import FileAccessDialogList from '@l/pages/UserManagement/PermissionManagement/tabsView/dialog/FileAccessDialogList/ja'
import FileAccessGroupListDialog from '@l/pages/UserManagement/PermissionManagement/tabsView/dialog/FileAccessGroupListDialog/ja'
import FileTree from '@l/pages/UserManagement/PermissionManagement/tabsView/file/FileTree/ja'
import ListTableU from '@l/pages/UserManagement/PermissionManagement/tabsView/file/ListTable/ja'
import UserAccessDialog from '@l/pages/UserManagement/PermissionManagement/tabsView/user/UserAccessDialog/ja'
import Upload from '@l/components/Uploader/Upload/ja'
import BodyTable from '@l/components/Uploader/BodyTable/ja'
import CoverToConfirm from '@l/components/Uploader/CoverToConfirm/ja'
import Inquiry from '@l/pages/Settings/Box/Inquiry/ja'
import LicenseSetting from '@l/pages/Settings/Box/LicenseSetting/ja'
import Transformation from '@l/pages/Settings/Box/Transformation/ja'
import Header from '@l/views/Header/ja'
import Aside from '@l/views/Aside/ja'
import ForgetThePassword from '@l/views/ForgetThePassword/ja'
import LoginReset from '@l/views/LoginReset/ja'
import PasswordSetting from '@l/views/PasswordSetting/ja'

const ja = {
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
            clear: 'クリア',
            confirm: 'OK'
        }
    },
    common: {
        EDIT: '編集',
        DELETE: '削除',
        Cancel: 'キャンセル',
        YES: 'はい',
        NO: 'いいえ',
        Password: 'パスワード',
        DialogConfirmCancelTitle: 'キャンセル確認',
        DialogConfirmCancelContent: '編集画面を閉じると編集した内容は破棄されます。<br /><br />よろしいですか？',
        DialogConfirmCancelButton1: '編集を続ける',
        DialogConfirmCancelButton2: '破棄する',
        DISPLAY_UNDER_READING: '読み込み中'
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

export default ja
