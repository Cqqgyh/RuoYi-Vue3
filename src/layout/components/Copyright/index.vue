<template>
  <footer class="copyright" v-if="isShowTabBar">
    <van-tabbar v-model="active">
      <van-tabbar-item to="/index" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/user/profile" icon="friends-o">个人中心</van-tabbar-item>
    </van-tabbar>
  </footer>
</template>

<script setup>
import { ref } from 'vue'
import { Tabbar as VanTabbar, TabbarItem as VanTabbarItem } from 'vant';
import { useRoute } from 'vue-router'

const active = ref(0)
const route = useRoute()

const isShowTabBar = computed(() => {
  return ['/index', '/user/profile'].includes(route.path)
})
// 兼容当前路由
watch(() => route.path, (newPath) => {
  console.log('111')
  if (newPath === '/index') {
    active.value = 0
  } else if (newPath === '/user/profile') {
    active.value = 1
  }
},{
    immediate: true

    }
)
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
