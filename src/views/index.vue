<template>
  <div class="home-page">
    <!-- 顶部区域 -->
    <header class="home-header">
      <div class="home-header-title">
        <div class="title-main">产品管理中心</div>
        <div class="title-sub">随时随地，掌握业务动态</div>
      </div>
      <div class="home-user">
        <div class="user-avatar">Hi</div>
        <div class="user-info">
          <div class="user-name">{{ userStore.nickName || userStore.name }}</div>
          <div class="user-tip">欢迎回来</div>
        </div>
      </div>
    </header>

    <!-- 快速统计，可自行删减/修改 -->
<!--    <section class="home-summary">-->
<!--      <div class="summary-card">-->
<!--        <div class="summary-label">今日新增客户</div>-->
<!--        <div class="summary-value">12</div>-->
<!--      </div>-->
<!--      <div class="summary-card">-->
<!--        <div class="summary-label">待处理报价</div>-->
<!--        <div class="summary-value">5</div>-->
<!--      </div>-->
<!--      <div class="summary-card">-->
<!--        <div class="summary-label">本月订单</div>-->
<!--        <div class="summary-value">36</div>-->
<!--      </div>-->
<!--    </section>-->

    <!-- 功能区 -->
    <section class="home-section">
      <div class="section-title">功能入口</div>
      <div class="feature-grid">
        <div
            class="feature-item"
            v-for="item in featureList"
            :key="item.path"
            @click="go(item.path)"
        >
          <div class="feature-icon" :style="{ background: item.bg }">
            <!-- 简单图标占位，如有图标库可替换 -->
            <span>{{ item.short }}</span>
          </div>
          <div class="feature-name">{{ item.name }}</div>
          <div class="feature-desc">{{ item.desc }}</div>
        </div>
      </div>
    </section>

    <!-- 底部快捷区，可选 -->
    <section class="home-section">
      <div class="section-title">常用操作</div>
      <div class="quick-list">
        <div class="quick-item" @click="go('/productAddOrEdit')">
          <div class="quick-main">
            <div class="quick-title">新建产品</div>
            <div class="quick-desc">快速录入新的产品信息</div>
          </div>
          <div class="quick-arrow">›</div>
        </div>
        <div class="quick-item" @click="go('/clientAddOrEdit')">
          <div class="quick-main">
            <div class="quick-title">新增客户</div>
            <div class="quick-desc">记录新的合作客户</div>
          </div>
          <div class="quick-arrow">›</div>
        </div>
        <div class="quick-item" @click="go('/supplierAddOrEdit')">
          <div class="quick-main">
            <div class="quick-title">新增供应商</div>
            <div class="quick-desc">记录新的供应商</div>
          </div>
          <div class="quick-arrow">›</div>
        </div>
<!--        <div class="quick-item" @click="go('/batchAddOrEdit')">-->
<!--          <div class="quick-main">-->
<!--            <div class="quick-title">发起报价</div>-->
<!--            <div class="quick-desc">根据客户需求快速报价</div>-->
<!--          </div>-->
<!--          <div class="quick-arrow">›</div>-->
<!--        </div>-->
      </div>
    </section>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import usePermissionStore from '@/store/modules/permission'
import useUserStore from '@/store/modules/user.js'
const router = useRouter()
const userStore = useUserStore()
const permissionStore = usePermissionStore()
// 功能宫格配置
const featureList = computed(() => {
 const target = [
    {
      name: '产品管理',
      path: '/product',
      pathName: 'Product',
      short: '品',
      desc: '统一管理所有产品信息',
      bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      name: '客户管理',
      path: '/cilent',
      pathName: 'Cilent',
      short: '客',
      desc: '维护客户资料及跟进',
      bg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    },
    {
      name: '供应商管理',
      path: '/supplier',
      pathName: 'Supplier',
      short: '供',
      desc: '管理供应商及合作记录',
      bg: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    },
    {
      name: '报价管理',
      path: '/batch',
      pathName: 'Batch',
      short: '报',
      desc: '报价单创建与维护',
      bg: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)'
    }
  ]
    return target.filter(item => {
      return permissionStore.addRoutes.find(route => route.children[0].name === item.pathName)
    })
})



const go = (path) => {
  router.push(path)
}
</script>

<style scoped>
/* 整体布局适配移动端 */
.home-page {
  min-height:100%;
  background: #f5f6f8;
  padding: 12px 12px 12px 12px;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'PingFang SC',
  'Microsoft YaHei', sans-serif;
}

/* 顶部 */
.home-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  border-radius: 12px;
  padding: 14px 14px 16px;
  color: #fff;
  margin-bottom: 12px;
}

.home-header-title .title-main {
  font-size: 18px;
  font-weight: 600;
}

.home-header-title .title-sub {
  margin-top: 4px;
  font-size: 12px;
  opacity: 0.9;
}

.home-user {
  display: flex;
  align-items: center;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  margin-right: 8px;
}

.user-info {
  text-align: right;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
}

.user-tip {
  font-size: 12px;
  opacity: 0.9;
}

/* 快速统计 */
.home-summary {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.summary-card {
  flex: 1;
  background: #ffffff;
  border-radius: 10px;
  padding: 8px 8px 10px;
  margin-right: 6px;
  box-sizing: border-box;
  box-shadow: 0 2px 6px rgba(15, 35, 52, 0.04);
}

.summary-card:last-child {
  margin-right: 0;
}

.summary-label {
  font-size: 12px;
  color: #888;
  margin-bottom: 6px;
}

.summary-value {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

/* 区块标题 */
.home-section {
  margin-top: 10px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

/* 功能宫格 */
.feature-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 10px;
}

.feature-item {
  background: #ffffff;
  border-radius: 12px;
  padding: 12px 10px;
  box-sizing: border-box;
  box-shadow: 0 2px 8px rgba(15, 35, 52, 0.04);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.feature-item:active {
  transform: scale(0.98);
  transition: transform 0.08s;
}

.feature-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}

.feature-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.feature-desc {
  font-size: 12px;
  color: #999;
}

/* 快捷操作列表 */
.quick-list {
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(15, 35, 52, 0.04);
}

.quick-item {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  border-bottom: 1px solid #f1f1f1;
}

.quick-item:last-child {
  border-bottom: none;
}

.quick-item:active {
  background: #f5f7fa;
}

.quick-main {
  flex: 1;
}

.quick-title {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.quick-desc {
  font-size: 12px;
  color: #999;
  margin-top: 2px;
}

.quick-arrow {
  font-size: 18px;
  color: #ccc;
  margin-left: 6px;
}
</style>
