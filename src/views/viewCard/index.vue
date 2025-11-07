<template>
  <div class="h5-preview-container">
    <!-- 头部 -->
    <div class="header">
      <h1>产品详情预览</h1>
    </div>

    <!-- 内容区域 -->
    <div class="content">
      <!-- 产品基本信息卡片 -->
      <div class="card">
        <div class="card-header">
          <h2>基本信息</h2>
        </div>
        <div class="card-body">
          <div class="field-item">
            <span class="field-label">{{ fieldLabels.name }}：</span>
            <span class="field-value">{{ productData.name }}</span>
          </div>
          <div class="field-item">
            <span class="field-label">{{ fieldLabels.sampleCategoryId }}：</span>
            <span class="field-value">{{ productData.sampleCategoryId }}</span>
          </div>
          <div class="field-item">
            <span class="field-label">{{ fieldLabels.storageTime }}：</span>
            <span class="field-value">{{ productData.storageTime }}</span>
          </div>
          <div class="field-item">
            <span class="field-label">{{ fieldLabels.clientId }}：</span>
            <span class="field-value">{{ productData.clientId }}</span>
          </div>
          <div class="field-item">
            <span class="field-label">{{ fieldLabels.factoryId }}：</span>
            <span class="field-value">{{ productData.factoryId }}</span>
          </div>
        </div>
      </div>

      <!-- 款号信息卡片 -->
      <div class="card">
        <div class="card-header">
          <h2>款号信息</h2>
        </div>
        <div class="card-body">
          <div class="field-item">
            <span class="field-label">{{ fieldLabels.clientStyleNo }}：</span>
            <span class="field-value">{{ productData.clientStyleNo }}</span>
          </div>
          <div class="field-item">
            <span class="field-label">{{ fieldLabels.styleNo }}：</span>
            <span class="field-value">{{ productData.styleNo }}</span>
          </div>
        </div>
      </div>

      <!-- 报价信息卡片 -->
      <div class="card">
        <div class="card-header">
          <h2>报价信息</h2>
        </div>
        <div class="card-body">
          <div class="field-item">
            <span class="field-label">{{ fieldLabels.factoryQuotation }}：</span>
            <span class="field-value price">{{ formatCurrency(productData.factoryQuotation) }}</span>
          </div>
          <div class="field-item">
            <span class="field-label">{{ fieldLabels.usdQuotation }}：</span>
            <span class="field-value price">{{ formatUSD(productData.usdQuotation) }}</span>
          </div>
        </div>
      </div>

      <!-- 尺寸信息卡片 -->
      <div class="card">
        <div class="card-header">
          <h2>尺寸信息</h2>
        </div>
        <div class="card-body">
          <div class="field-item">
            <span class="field-label">{{ fieldLabels.size }}：</span>
            <span class="field-value">{{ productData.size }}</span>
          </div>
        </div>
      </div>

      <!-- 面料信息卡片 -->
      <div class="card">
        <div class="card-header">
          <h2>面料信息</h2>
        </div>
        <div class="card-body">
          <div class="field-item">
            <span class="field-label">{{ fieldLabels.fabricCategoryId }}：</span>
            <span class="field-value">{{ productData.fabricCategoryId }}</span>
          </div>
          <div class="field-item">
            <span class="field-label">{{ fieldLabels.fabricComposition }}：</span>
            <span class="field-value">{{ productData.fabricComposition }}</span>
          </div>
          <div class="field-item">
            <span class="field-label">{{ fieldLabels.fabricWeight }}：</span>
            <span class="field-value">{{ productData.fabricWeight }}</span>
          </div>
          <div class="field-item">
            <span class="field-label">{{ fieldLabels.fabricPrice }}：</span>
            <span class="field-value price">{{ formatCurrency(productData.fabricPrice) }}</span>
          </div>
          <div class="field-item">
            <span class="field-label">{{ fieldLabels.fabricSupplierId }}：</span>
            <span class="field-value">{{ productData.fabricSupplierId }}</span>
          </div>
        </div>
      </div>

      <!-- 里布信息卡片 -->
      <div class="card">
        <div class="card-header">
          <h2>里布信息</h2>
        </div>
        <div class="card-body">
          <div class="field-item">
            <span class="field-label">{{ fieldLabels.liningCategory }}：</span>
            <span class="field-value">{{ productData.liningCategory }}</span>
          </div>
          <div class="field-item">
            <span class="field-label">{{ fieldLabels.liningIngredient }}：</span>
            <span class="field-value">{{ productData.liningIngredient }}</span>
          </div>
          <div class="field-item">
            <span class="field-label">{{ fieldLabels.liningWeightPer }}：</span>
            <span class="field-value">{{ productData.liningWeightPer }}</span>
          </div>
          <div class="field-item">
            <span class="field-label">{{ fieldLabels.liningPrice }}：</span>
            <span class="field-value price">{{ formatCurrency(productData.liningPrice) }}</span>
          </div>
          <div class="field-item">
            <span class="field-label">{{ fieldLabels.liningSupplierId }}：</span>
            <span class="field-value">{{ productData.liningSupplierId }}</span>
          </div>
        </div>
      </div>

      <!-- 备注信息卡片 -->
      <div class="card">
        <div class="card-header">
          <h2>备注信息</h2>
        </div>
        <div class="card-body">
          <div class="field-item">
            <span class="field-label">{{ fieldLabels.remark }}：</span>
            <span class="field-value remark">{{ productData.remark }}</span>
          </div>
        </div>
      </div>

      <!-- 照片信息卡片 -->
      <div class="card">
        <div class="card-header">
          <h2>{{ fieldLabels.fileUrlList }}</h2>
        </div>
        <div class="card-body">
          <div v-if="productData.fileUrlList && productData.fileUrlList.length > 0" class="image-gallery">
            <el-carousel
                height="200px"
                indicator-position="outside"
                arrow="always"
            >
              <el-carousel-item
                  v-for="(img, index) in productData.fileUrlList"
                  :key="index"
              >
                <div class="carousel-item">
                  <img
                      :src="img.url"
                      :alt="img.name || '产品图片'"
                      class="carousel-image"
                  />
                  <div class="image-name" v-if="img.name">
                    {{ img.name }}
                  </div>
                </div>
              </el-carousel-item>
            </el-carousel>
          </div>
          <div v-else class="no-image">
            暂无图片
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getDicts } from '@/api/system/dict/data'
// 定义数据模型
interface ProductData {
  name: string
  sampleCategoryId: string
  storageTime: string
  clientId: string
  factoryId: string
  clientStyleNo: string
  styleNo: string
  factoryQuotation: string
  usdQuotation: string
  size: string
  fabricCategoryId: string
  fabricComposition: string
  fabricWeight: string
  fabricPrice: string
  fabricSupplierId: string
  liningCategory: string
  liningIngredient: string
  liningWeightPer: string
  liningPrice: string
  liningSupplierId: string
  remark: string
  fileUrlList: { name: string; url: string }[]
}
const { proxy } = getCurrentInstance()
//#region <获取显示隐藏字典>
const productShowConfigList =ref([])
const getProductShowConfigList = async () => {
  const res  = await getDicts("product_show_config")
  productShowConfigList.value = res.data.map(item => ({
    // 下划线转小驼峰
    props: item.dictLabel.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase()),
    show: item.status === '0'
  }))
  console.log('productShowConfigList',productShowConfigList.value)
}
getProductShowConfigList()
//#endregion

// 响应式数据
const productData = ref<ProductData>({
  name: '',
  sampleCategoryId: '',
  storageTime: '',
  clientId: '',
  factoryId: '',
  clientStyleNo: '',
  styleNo: '',
  factoryQuotation: '',
  usdQuotation: '',
  size: '',
  fabricCategoryId: '',
  fabricComposition: '',
  fabricWeight: '',
  fabricPrice: '',
  fabricSupplierId: '',
  liningCategory: '',
  liningIngredient: '',
  liningWeightPer: '',
  liningPrice: '',
  liningSupplierId: '',
  remark: '',
  fileUrlList: []
})

// 字段标签映射
const fieldLabels = {
  name: '产品名称',
  sampleCategoryId: '样品类别',
  storageTime: '入库时间',
  clientId: '客户',
  factoryId: '工厂',
  clientStyleNo: '客人款号',
  styleNo: '公司款号',
  factoryQuotation: '工厂报价',
  usdQuotation: '美元报价',
  size: '尺码',
  fabricCategoryId: '面料种类',
  fabricComposition: '面料成分',
  fabricWeight: '面料克重',
  fabricPrice: '面料价格',
  fabricSupplierId: '面料供应商',
  liningCategory: '里布种类',
  liningIngredient: '里布成分',
  liningWeightPer: '里布克重',
  liningPrice: '里布价格',
  liningSupplierId: '里布供应商',
  remark: '备注',
  fileUrlList: '照片'
}

// 获取路由参数并加载数据（示例）
const route = useRoute()
onMounted(() => {
  // 这里应该从API获取实际数据，这里只是模拟
  // const id = route.query.id
  // fetchData(id)

  // 模拟数据用于演示
  productData.value = {
    name: '夏季休闲衬衫',
    sampleCategoryId: '男装',
    storageTime: '2023-05-15',
    clientId: 'ABC服装公司',
    factoryId: 'DEF制造厂',
    clientStyleNo: 'CS202305001',
    styleNo: 'SS202305001',
    factoryQuotation: '25.50',
    usdQuotation: '3.50',
    size: 'M/L/XL',
    fabricCategoryId: '棉麻混纺',
    fabricComposition: '60%棉 40%麻',
    fabricWeight: '180g/m²',
    fabricPrice: '28.00',
    fabricSupplierId: 'GHI纺织有限公司',
    liningCategory: '聚酯纤维',
    liningIngredient: '100%聚酯纤维',
    liningWeightPer: '60g/m²',
    liningPrice: '8.00',
    liningSupplierId: 'JKL衬布厂',
    remark: '注意颜色搭配和尺寸标准',
    fileUrlList: [
      { name: '正面图', url: 'https://example.com/image1.jpg' },
      { name: '背面图', url: 'https://example.com/image2.jpg' },
      { name: '侧面图', url: 'https://example.com/image3.jpg' }
    ]
  }
})

// 格式化货币显示
const formatCurrency = (value: string) => {
  if (!value) return ''
  return '¥' + parseFloat(value).toFixed(2)
}

// 格式化美元显示
const formatUSD = (value: string) => {
  if (!value) return ''
  return '$' + parseFloat(value).toFixed(2)
}
</script>

<style scoped lang="scss">
.h5-preview-container {
  background-color: #f5f5f5;
  min-height: 100vh;
  padding: 0;
  margin: 0;

  .header {
    background-color: #ffffff;
    padding: 15px 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 100;

    h1 {
      margin: 0;
      font-size: 18px;
      font-weight: bold;
      color: #333;
      text-align: center;
    }
  }

  .content {
    padding: 15px;

    .card {
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      margin-bottom: 15px;
      overflow: hidden;

      .card-header {
        background-color: #f8f9fa;
        padding: 12px 15px;
        border-bottom: 1px solid #eee;

        h2 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #333;
        }
      }

      .card-body {
        padding: 15px;

        .field-item {
          display: flex;
          margin-bottom: 12px;

          &:last-child {
            margin-bottom: 0;
          }

          .field-label {
            width: 30%;
            font-weight: 500;
            color: #666;
            font-size: 14px;
            flex-shrink: 0;
          }

          .field-value {
            flex: 1;
            font-size: 14px;
            color: #333;
            word-break: break-word;

            &.price {
              color: #e74c3c;
              font-weight: 500;
            }

            &.remark {
              line-height: 1.5;
            }
          }
        }

        .image-gallery {
          .carousel-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;

            .carousel-image {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }

            .image-name {
              position: absolute;
              bottom: 0;
              left: 0;
              right: 0;
              background-color: rgba(0, 0, 0, 0.5);
              color: white;
              padding: 8px;
              text-align: center;
              font-size: 14px;
            }
          }

          // 轮播图指示器样式优化
          :deep(.el-carousel__indicator) {
            .el-carousel__button {
              width: 10px;
              height: 10px;
              border-radius: 50%;
            }
          }

          :deep(.el-carousel__arrow) {
            background-color: rgba(31, 45, 61, 0.5);
            width: 30px;
            height: 30px;

            &:hover {
              background-color: rgba(31, 45, 61, 0.7);
            }
          }
        }

        .no-image {
          text-align: center;
          color: #999;
          padding: 20px 0;
          font-size: 14px;
        }
      }
    }
  }
}

// 响应式设计优化
@media (max-width: 768px) {
  .h5-preview-container {
    .content {
      .card {
        .card-body {
          .field-item {
            flex-direction: column;
            gap: 5px;

            .field-label {
              width: 100%;
              font-weight: 600;
            }
          }
        }
      }
    }
  }
}
</style>
