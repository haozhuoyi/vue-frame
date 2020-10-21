import ChxTest from './test.vue'
 
// 支持按需引用
ChxTest.install = function (Vue) {
  Vue.component(ChxTest.name, ChxTest);
};
 
export default ChxTest;