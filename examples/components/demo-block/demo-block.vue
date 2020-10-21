<template>
  <div
    class="demo-block"
    :class="[blockClass, { hover: hovering }]"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
  >
    <!-- 源码运行 -->
    <div class="source">
      <slot name="source"></slot>
    </div>
    <!-- 源码 -->
    <div class="meta" ref="meta">
      <!-- 描述 -->
      <div class="description" v-if="$slots.default">
        <slot></slot>
      </div>
      <!-- 源码 -->
      <div class="highlight">
        <slot name="highlight"></slot>
      </div>
    </div>
    <!-- 源码 显示或者隐藏 -->
    <div
      class="demo-block-control"
      ref="control"
      :class="{ 'is-fixed': fixedControl }"
      @click="isExpanded = !isExpanded"
    >
      <transition name="arrow-slide">
        <i :class="[iconClass, { hovering: hovering }]"></i>
      </transition>
      <transition name="text-slide">
        <span v-show="hovering">{{ controlText }}</span>
      </transition>
    </div>
  </div>
</template>

<script type="text/babel">
export default {
  name:"DemoBlock",
  data() {
    return {
      hovering: false,
      isExpanded: false,
      fixedControl: false,
      scrollParent: null
    };
  },
  computed: {
    lang() {
      return this.$route.path.split("/")[1];
    },
    blockClass() {
      return `demo-${this.lang} demo-${this.$router.currentRoute.path
        .split("/")
        .pop()}`;
    },
    iconClass() {
      return this.isExpanded ? "el-icon-caret-top" : "el-icon-caret-bottom";
    },
    controlText() {
      return this.isExpanded ? "隐藏代码" : "显示代码";
    },
    codeArea() {
      return this.$el.getElementsByClassName("meta")[0];
    },
    codeAreaHeight() {
      if (this.$el.getElementsByClassName("description").length > 0) {
        return (
          this.$el.getElementsByClassName("description")[0].clientHeight +
          this.$el.getElementsByClassName("highlight")[0].clientHeight +
          20
        );
      }
      return this.$el.getElementsByClassName("highlight")[0].clientHeight;
    }
  },
  watch: {
    isExpanded(val) {
      this.codeArea.style.height = val ? `${this.codeAreaHeight + 1}px` : "0";
      if (!val) {
        this.fixedControl = false;
        this.$refs.control.style.left = "0";
        return;
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import './demo-block.less';
</style>