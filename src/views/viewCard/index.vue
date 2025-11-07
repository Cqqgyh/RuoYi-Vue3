<template>
  <div class="h5-preview-container">
    <!-- 头部 -->
    <div class="header">
      <h1>产品详情预览</h1>
    </div>

    <!-- 内容区域 -->
    <div class="content" :key="productData.id">
      <!-- 产品基本信息卡片 -->
      <div class="card" v-if="shouldShowSection(['name', 'sampleCategoryName', 'storageTime', 'clientName', 'factoryName'])">
        <div class="card-header">
          <h2>基本信息</h2>
        </div>
        <div class="card-body">
          <div class="field-item" v-if="shouldShowField('name')">
            <span class="field-label">{{ fieldLabels.name }}：</span>
            <span class="field-value">{{ productData.name }}</span>
          </div>
          <div class="field-item" v-if="shouldShowField('sampleCategoryName')">
            <span class="field-label">{{ fieldLabels.sampleCategoryName }}：</span>
            <span class="field-value">{{ productData.sampleCategoryName }}</span>
          </div>
          <div class="field-item" v-if="shouldShowField('storageTime')">
            <span class="field-label">{{ fieldLabels.storageTime }}：</span>
            <span class="field-value">{{ productData.storageTime }}</span>
          </div>
          <div class="field-item" v-if="shouldShowField('clientName')">
            <span class="field-label">{{ fieldLabels.clientName }}：</span>
            <span class="field-value">{{ productData.clientName }}</span>
          </div>
          <div class="field-item" v-if="shouldShowField('factoryName')">
            <span class="field-label">{{ fieldLabels.factoryName }}：</span>
            <span class="field-value">{{ productData.factoryName }}</span>
          </div>
        </div>
      </div>

      <!-- 款号信息卡片 -->
      <div class="card" v-if="shouldShowSection(['clientStyleNo', 'styleNo'])">
        <div class="card-header">
          <h2>款号信息</h2>
        </div>
        <div class="card-body">
          <div class="field-item" v-if="shouldShowField('clientStyleNo')">
            <span class="field-label">{{ fieldLabels.clientStyleNo }}：</span>
            <span class="field-value">{{ productData.clientStyleNo }}</span>
          </div>
          <div class="field-item" v-if="shouldShowField('styleNo')">
            <span class="field-label">{{ fieldLabels.styleNo }}：</span>
            <span class="field-value">{{ productData.styleNo }}</span>
          </div>
        </div>
      </div>

      <!-- 报价信息卡片 -->
      <div class="card" v-if="shouldShowSection(['factoryQuotation', 'usdQuotation'])">
        <div class="card-header">
          <h2>报价信息</h2>
        </div>
        <div class="card-body">
          <div class="field-item" v-if="shouldShowField('factoryQuotation')">
            <span class="field-label">{{ fieldLabels.factoryQuotation }}：</span>
            <span class="field-value price">{{ formatCurrency(productData.factoryQuotation) }}</span>
          </div>
          <div class="field-item" v-if="shouldShowField('usdQuotation')">
            <span class="field-label">{{ fieldLabels.usdQuotation }}：</span>
            <span class="field-value price">{{ formatUSD(productData.usdQuotation) }}</span>
          </div>
        </div>
      </div>

      <!-- 尺寸信息卡片 -->
      <div class="card" v-if="shouldShowSection(['size'])">
        <div class="card-header">
          <h2>尺寸信息</h2>
        </div>
        <div class="card-body">
          <div class="field-item" v-if="shouldShowField('size')">
            <span class="field-label">{{ fieldLabels.size }}：</span>
            <span class="field-value">{{ productData.size }}</span>
          </div>
        </div>
      </div>

      <!-- 面料信息卡片 -->
      <div class="card" v-if="shouldShowSection(['fabricCategoryName', 'fabricComposition', 'fabricWeight', 'fabricPrice', 'fabricSupplierName'])">
        <div class="card-header">
          <h2>面料信息</h2>
        </div>
        <div class="card-body">
          <div class="field-item" v-if="shouldShowField('fabricCategoryName')">
            <span class="field-label">{{ fieldLabels.fabricCategoryName }}：</span>
            <span class="field-value">{{ productData.fabricCategoryName }}</span>
          </div>
          <div class="field-item" v-if="shouldShowField('fabricComposition')">
            <span class="field-label">{{ fieldLabels.fabricComposition }}：</span>
            <span class="field-value">{{ productData.fabricComposition }}</span>
          </div>
          <div class="field-item" v-if="shouldShowField('fabricWeight')">
            <span class="field-label">{{ fieldLabels.fabricWeight }}：</span>
            <span class="field-value">{{ productData.fabricWeight }}</span>
          </div>
          <div class="field-item" v-if="shouldShowField('fabricPrice')">
            <span class="field-label">{{ fieldLabels.fabricPrice }}：</span>
            <span class="field-value price">{{ formatCurrency(productData.fabricPrice) }}</span>
          </div>
          <div class="field-item" v-if="shouldShowField('fabricSupplierName')">
            <span class="field-label">{{ fieldLabels.fabricSupplierName }}：</span>
            <span class="field-value">{{ productData.fabricSupplierName }}</span>
          </div>
        </div>
      </div>

      <!-- 里布信息卡片 -->
      <div class="card" v-if="shouldShowSection(['liningCategory', 'liningIngredient', 'liningWeightPer', 'liningPrice', 'liningSupplierName'])">
        <div class="card-header">
          <h2>里布信息</h2>
        </div>
        <div class="card-body">
          <div class="field-item" v-if="shouldShowField('liningCategory')">
            <span class="field-label">{{ fieldLabels.liningCategory }}：</span>
            <span class="field-value">{{ productData.liningCategory }}</span>
          </div>
          <div class="field-item" v-if="shouldShowField('liningIngredient')">
            <span class="field-label">{{ fieldLabels.liningIngredient }}：</span>
            <span class="field-value">{{ productData.liningIngredient }}</span>
          </div>
          <div class="field-item" v-if="shouldShowField('liningWeightPer')">
            <span class="field-label">{{ fieldLabels.liningWeightPer }}：</span>
            <span class="field-value">{{ productData.liningWeightPer }}</span>
          </div>
          <div class="field-item" v-if="shouldShowField('liningPrice')">
            <span class="field-label">{{ fieldLabels.liningPrice }}：</span>
            <span class="field-value price">{{ formatCurrency(productData.liningPrice) }}</span>
          </div>
          <div class="field-item" v-if="shouldShowField('liningSupplierName')">
            <span class="field-label">{{ fieldLabels.liningSupplierName }}：</span>
            <span class="field-value">{{ productData.liningSupplierName }}</span>
          </div>
        </div>
      </div>

      <!-- 备注信息卡片 -->
      <div class="card" v-if="shouldShowSection(['remark'])">
        <div class="card-header">
          <h2>备注信息</h2>
        </div>
        <div class="card-body">
          <div class="field-item" v-if="shouldShowField('remark')">
            <span class="field-label">{{ fieldLabels.remark }}：</span>
            <span class="field-value remark">{{ productData.remark }}</span>
          </div>
        </div>
      </div>

      <!-- 照片信息卡片 -->
      <div class="card" v-if="shouldShowSection(['fileUrlList'])">
        <div class="card-header">
          <h2>{{ fieldLabels.fileUrlList }}</h2>
        </div>
        <div class="card-body">
          <div v-if="productData.fileUrlList && productData.fileUrlList.length > 0 && shouldShowField('fileUrlList')" class="image-gallery">
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
          <div v-else-if="shouldShowField('fileUrlList')" class="no-image">
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
import { getDicts } from '@/api/system/dict/data.js'
import {  getDetailRequest} from '@/api/product.js'
// 定义数据模型
interface ProductData {
  id?:  number
  name: string | number
  sampleCategoryName: string | number
  storageTime: string | number
  clientName: string | number
  factoryName: string | number
  clientStyleNo: string | number
  styleNo: string | number
  factoryQuotation: string | number
  usdQuotation: string | number
  size: string | number
  fabricCategoryName: string | number
  fabricComposition: string | number
  fabricWeight: string | number
  fabricPrice: string | number
  fabricSupplierName: string | number
  liningCategory: string | number
  liningIngredient: string | number
  liningWeightPer: string | number
  liningPrice: string | number
  liningSupplierName: string | number
  remark: string | number
  fileUrlList: { name: string; url: string  }[]
  [key: string]: any
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
  // {
  //   "props": "storageTime",
  //     "show": true
  // }
  console.log('productShowConfigList',productShowConfigList.value)
}
getProductShowConfigList()
//#endregion

// 响应式数据
const productData = ref<ProductData>({
  name: '',
  sampleCategoryName: '',
  storageTime: '',
  clientName: '',
  factoryName: '',
  clientStyleNo: '',
  styleNo: '',
  factoryQuotation: '',
  usdQuotation: '',
  size: '',
  fabricCategoryName: '',
  fabricComposition: '',
  fabricWeight: '',
  fabricPrice: '',
  fabricSupplierName: '',
  liningCategory: '',
  liningIngredient: '',
  liningWeightPer: '',
  liningPrice: '',
  liningSupplierName: '',
  remark: '',
  fileUrlList: []
})
/** 修改按钮操作 */
async function fetchData (id) {
  const res = await getDetailRequest(id)
  productData.value = res.data
}

// 字段标签映射
const fieldLabels = {
  // name: '产品名称',
  sampleCategoryName: '样品类别',
  storageTime: '入库时间',
  clientName: '客户',
  factoryName: '工厂',
  clientStyleNo: '客人款号',
  styleNo: '公司款号',
  factoryQuotation: '工厂报价',
  usdQuotation: '美元报价',
  size: '尺码',
  fabricCategoryName: '面料种类',
  fabricComposition: '面料成分',
  fabricWeight: '面料克重',
  fabricPrice: '面料价格',
  fabricSupplierName: '面料供应商',
  liningCategory: '里布种类',
  liningIngredient: '里布成分',
  liningWeightPer: '里布克重',
  liningPrice: '里布价格',
  liningSupplierName: '里布供应商',
  remark: '备注',
  fileUrlList: '照片'
}

// 获取路由参数并加载数据（示例）
const route = useRoute()
onMounted(() => {
  // 这里应该从API获取实际数据，这里只是模拟
  const id = route.query.id
  // fetchData(id)
  productData.value= {
    "createBy": "consequat cillum velit anim",
    "createTime": "2025-11-01 01:18:29",
    "updateBy": "2025-04-15",
    "updateTime": "2025-11-01 01:18:29",
    "remark": "in adipisicing laboris do",
    "createStartTime": null,
    "createEndTime": null,
    "userId": null,
    "deptId": null,
    "sysDictDataList": null,
    "id": 65,
    "delFlag": "0",
    "name": "仪秀英",
    "sampleCategoryId": 30,
    "sampleCategoryName": "分类1",
    "storageTime": "1974-03-31",
    "clientId": 4,
    "clientName": "禚一全",
    "factoryId": 1,
    "factoryName": "印子欣",
    "clientStyleNo": "clientStyleNo",
    "styleNo": "styleNo003",
    "factoryQuotation": 92,
    "usdQuotation": 8,
    "newestUsdQuotation": 84,
    "size": 21,
    "fabricCategoryId": 33,
    "fabricCategoryName": "面料种类1",
    "fabricComposition": "laboris in tempor irure cillum",
    "fabricWeight": 25,
    "fabricPrice": 34.89,
    "fabricSupplierId": 2,
    "fabricSupplierName": "功鑫",
    "liningCategory": "pariatur Duis",
    "liningIngredient": "tempor",
    "liningWeightPer": 35,
    "liningPrice": 87.69,
    "liningSupplierId": 4,
    "liningSupplierName": "宛安琪",
    "isShowFlag": "1",
    "isShowFlagStr": "是",
    "registrar": 1,
    "registrarName": "admin",
    "fileUrlList": null,
    "qrCodeUrl": null,
    "quotationRecordList": null
  }

  // 模拟数据用于演示
  // productData.value = {
  //   name: '夏季休闲衬衫',
  //   sampleCategoryName: '男装',
  //   storageTime: '2023-05-15',
  //   clientName: 'ABC服装公司',
  //   factoryName: 'DEF制造厂',
  //   clientStyleNo: 'CS202305001',
  //   styleNo: 'SS202305001',
  //   factoryQuotation: '25.50',
  //   usdQuotation: '3.50',
  //   size: 'M/L/XL',
  //   fabricCategoryName: '棉麻混纺',
  //   fabricComposition: '60%棉 40%麻',
  //   fabricWeight: '180g/m²',
  //   fabricPrice: '28.00',
  //   fabricSupplierName: 'GHI纺织有限公司',
  //   liningCategory: '聚酯纤维',
  //   liningIngredient: '100%聚酯纤维',
  //   liningWeightPer: '60g/m²',
  //   liningPrice: '8.00',
  //   liningSupplierName: 'JKL衬布厂',
  //   remark: '注意颜色搭配和尺寸标准',
  //   fileUrlList: [
  //     { name: '正面图', url: 'https://example.com/image1.jpg' },
  //     { name: '背面图', url: 'https://example.com/image2.jpg' },
  //     { name: '侧面图', url: 'https://example.com/image3.jpg' }
  //   ]
  // }
})

// 格式化货币显示
const formatCurrency = (value: string | number) => {
  if (!value) return ''
  // return '¥' + parseFloat(value).toFixed(2)
  return '¥' +value
}

// 格式化美元显示
const formatUSD = (value: string | number) => {
  if (!value) return ''
  // return '$' + parseFloat(value).toFixed(2)
  return '$' + value
}

// 判断字段是否应该显示
const shouldShowField = (fieldName: string | number) => {
  // 查找字段配置
  const config = productShowConfigList.value.find(item => item.props === fieldName)
  console.log('config',fieldName,config)
  // 如果没有配置，默认不显示
  if (!config) return false

  // 如果配置为不显示，直接返回false
  if (!config.show) return false

  // 如果配置为显示，检查对应的数据是否为空
  const fieldValue = productData.value[fieldName]

  // 对于数组类型字段的特殊处理
  if (fieldName === 'fileUrlList') {
    return Array.isArray(fieldValue) && fieldValue.length > 0
  }

  // 对于字符串类型字段，检查是否为空
  return fieldValue !== '' && fieldValue !== null && fieldValue !== undefined
}

// 判断模块是否应该显示（至少有一个字段需要显示）
const shouldShowSection = (fieldNames: string[]) => {
  return fieldNames.some(fieldName => shouldShowField(fieldName))
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
