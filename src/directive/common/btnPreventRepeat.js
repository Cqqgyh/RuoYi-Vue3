/**
 * v-btnPreventRepeat 按钮防重复点击指令
 * Copyright (c) 2023 ruoyi
 */

export default {
  mounted(el, binding) {
    // 获取传入的参数，如果没有则默认为500ms
    const delay = binding.value || 1000;

    el.addEventListener('click', e => {
      // 添加loading状态样式类
      el.classList.add('is-loading');

      // 延时恢复按钮状态
      setTimeout(() => {
        el.classList.remove('is-loading');
      }, delay);
    });
  }
}
