<template>
    <chx-container1 :containerSetting="containerSetting">
      <div slot="header">header</div>
      <div slot="toolbar">toolbar</div>
      <div slot="navbar">navbar</div>
      <div slot="list">list</div>
      <div slot="main">main</div>
      <div slot="detail">detail</div>
    </chx-container1>
</template>

<script>
export default {
  data() {
    return {
      containerSetting: {
        header: {
          show: true,
          height: "30px",
        },
        toolbar: {
          show: true,
          height: "70px",
        },
        navbar: {
          show: true,
          width: "100px",
        },
        list: {
          show: true,
          width: "200px",
        },
        detail: {
          show: true,
          width: "300px",
        }
      }
    }
  }
};
</script>
<style lang="less" scoped>
.chx-container1 {
    /deep/ .el-header{
      .header{
        background-color: #999999;
      }
      .toolbar{
        background-color: #898999;
      }
    }
    /deep/ .el-container{
        .navbar{
          background-color: #797999;
        }
        .main{
          background-color: #696999;
        }
        .detail{
          background-color: #595999;
        }
        .list{
          background-color: #496999;
        }
      }
  }
</style>
