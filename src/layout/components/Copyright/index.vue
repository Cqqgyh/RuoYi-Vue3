<template>
  <footer class="copyright">
    <van-tabbar v-model="active">
      <van-tabbar-item to="/index" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/user/profile" icon="friends-o">个人中心</van-tabbar-item>
    </van-tabbar>
  </footer>
</template>

<script setup>
import { ref } from 'vue'
import { Tabbar as VanTabbar, TabbarItem as VanTabbarItem } from 'vant';

const active = ref(0)
</script>

<style scoped>
.copyright {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 36px;
  padding: 10px 20px;
  text-align: right;
  background-color: #f8f8f8;
  color: #666;
  font-size: 14px;
  border-top: 1px solid #e7e7e7;
  z-index: 999;
}
</style>
