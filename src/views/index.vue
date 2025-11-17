<template>
  <div class="mobile-home">
    <!-- 功能区域 -->
    <div class="features-container">
      <div
          v-for="(item, index) in featureItems"
          :key="index"
          class="feature-card"
          @click="navigateTo(item.path)"
      >
        <div class="feature-icon" :class="item.iconClass">
          <el-icon :class="item.icon"></el-icon>
        </div>
        <div class="feature-content">
          <h3 class="feature-title">{{ item.title }}</h3>
          <p class="feature-desc">{{ item.description }}</p>
        </div>
      </div>
    </div>

    <!-- 统计信息 -->
    <div class="stats-section">
      <div class="stat-item">
        <div class="stat-value">128</div>
        <div class="stat-label">产品数量</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">42</div>
        <div class="stat-label">客户数量</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">24</div>
        <div class="stat-label">供应商数</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 原始路径列表
const pathList = ref([
  {
    "path": "/",
    "hidden": false,
    "component": "Layout",
    "children": [
      {
        "name": "Product",
        "path": "product",
        "hidden": false,
        "component": "product/product",
        "meta": {
          "title": "产品管理",
          "icon": "shopping",
          "noCache": false,
          "link": null
        }
      }
    ]
  },
  {
    "path": "/",
    "hidden": false,
    "component": "Layout",
    "children": [
      {
        "name": "Cilent",
        "path": "cilent",
        "hidden": false,
        "component": "client/client",
        "meta": {
          "title": "客户管理",
          "icon": "user",
          "noCache": false,
          "link": null
        }
      }
    ]
  },
  {
    "path": "/",
    "hidden": false,
    "component": "Layout",
    "children": [
      {
        "name": "Supplier",
        "path": "supplier",
        "hidden": false,
        "component": "supplier/supplier",
        "meta": {
          "title": "供应商管理",
          "icon": "tree",
          "noCache": false,
          "link": null
        }
      }
    ]
  },
  {
    "path": "/",
    "hidden": false,
    "component": "Layout",
    "children": [
      {
        "name": "Batch",
        "path": "batch",
        "hidden": false,
        "component": "quotation/quotation",
        "meta": {
          "title": "报价管理",
          "icon": "star",
          "noCache": false,
          "link": null
        }
      }
    ]
  }
])

// 提取功能项用于展示
const featureItems = computed(() => {
  return pathList.value.map(item => {
    const child = item.children[0]
    return {
      title: child.meta.title,
      path: child.path,
      icon: `el-icon-${child.meta.icon}`,
      iconClass: `icon-bg-${child.meta.icon}`,
      description: `${child.meta.title}模块，点击进入查看详情`
    }
  })
})

// 导航到指定路径
const navigateTo = (path) => {
  router.push(`/${path}`)
}
</script>

<style scoped>
.mobile-home {
  height: 100%;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4edf5 100%);
  box-sizing: border-box;
  padding: 20px;
}


/* 功能区域 - 美化后的垂直排列 */
.features-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 30px;
}

.feature-card {
  background: white;
  border-radius: 16px;
  padding: 25px 20px;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
}

.feature-card:hover {
  transform: translateX(5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  width: 70px;
  height: 70px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: white;
  margin-right: 20px;
  flex-shrink: 0;
}

.icon-bg-shopping {
  background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%);
}

.icon-bg-user {
  background: linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%);
}

.icon-bg-tree {
  background: linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%);
}

.icon-bg-star {
  background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
}

.feature-content {
  flex: 1;
}

.feature-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #333;
  text-align: left;
}

.feature-desc {
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.5;
  text-align: left;
}

/* 统计信息 */
.stats-section {
  display: flex;
  justify-content: space-between;
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.stat-item {
  text-align: center;
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .mobile-home {
    padding: 15px;
  }

  .header {
    padding: 20px 15px;
  }

  .header-title {
    font-size: 24px;
  }

  .feature-card {
    padding: 20px 15px;
  }

  .feature-icon {
    width: 60px;
    height: 60px;
    font-size: 24px;
    margin-right: 15px;
  }

  .feature-title {
    font-size: 16px;
  }

  .feature-desc {
    font-size: 13px;
  }

  .stats-section {
    padding: 15px;
  }

  .stat-value {
    font-size: 20px;
  }

  .stat-label {
    font-size: 12px;
  }
}
</style>
