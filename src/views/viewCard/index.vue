<template>
  <div class="h5-preview-container">
    <!-- 头部 -->
    <!--    <div class="header">-->
    <!--      <h1>产品详情预览</h1>-->
    <!--    </div>-->

    <!-- 内容区域 -->
    <div class="content" :key="productData.id">
      <!-- 产品基本信息卡片 -->
      <div class="card"
           v-if="shouldShowSection(['name', 'sampleCategoryName', 'storageTime', 'clientName', 'factoryName'])">
        <div class="card-header">
          <h2>基本信息</h2>
        </div>
        <div class="card-body">
          <div class="field-item" v-if="shouldShowField('name')">
            <div class="field-label"><div class="label-cn">{{ fieldText.name.cn }}</div><div class="label-en">{{ fieldText.name.en }}</div></div>
            <div class="field-value">{{ productData.name }}</div>
          </div>
          <div class="field-item" v-if="shouldShowField('sampleCategoryName')">
            <div class="field-label"><div class="label-cn">{{ fieldText.sampleCategoryName.cn }}</div><div class="label-en">{{ fieldText.sampleCategoryName.en }}</div></div>
            <div class="field-value">{{ productData.sampleCategoryName }}</div>
          </div>
          <div class="field-item" v-if="shouldShowField('storageTime')">
            <div class="field-label"><div class="label-cn">{{ fieldText.storageTime.cn }}</div><div class="label-en">{{ fieldText.storageTime.en }}</div></div>
            <div class="field-value">{{ productData.storageTime }}</div>
          </div>
          <div class="field-item" v-if="shouldShowField('clientName')">
            <div class="field-label"><div class="label-cn">{{ fieldText.clientName.cn }}</div><div class="label-en">{{ fieldText.clientName.en }}</div></div>
            <div class="field-value">{{ productData.clientName }}</div>
          </div>
          <div class="field-item" v-if="shouldShowField('factoryName')">
            <div class="field-label"><div class="label-cn">{{ fieldText.factoryName.cn }}</div><div class="label-en">{{ fieldText.factoryName.en }}</div></div>
            <div class="field-value">{{ productData.factoryName }}</div>
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
            <div class="field-label"><div class="label-cn">{{ fieldText.clientStyleNo.cn }}</div><div class="label-en">{{ fieldText.clientStyleNo.en }}</div></div>
            <div class="field-value">{{ productData.clientStyleNo }}</div>
          </div>
          <div class="field-item" v-if="shouldShowField('styleNo')">
            <div class="field-label"><div class="label-cn">{{ fieldText.styleNo.cn }}</div><div class="label-en">{{ fieldText.styleNo.en }}</div></div>
            <div class="field-value">{{ productData.styleNo }}</div>
          </div>
        </div>
      </div>

      <!-- 报价信息卡片 -->
      <div class="card" v-if="shouldShowSection(['factoryQuotation', 'newestUsdQuotation'])">
        <div class="card-header">
          <h2>报价信息</h2>
        </div>
        <div class="card-body">
          <div class="field-item" v-if="shouldShowField('factoryQuotation')">
            <div class="field-label"><div class="label-cn">{{ fieldText.factoryQuotation.cn }}</div><div class="label-en">{{ fieldText.factoryQuotation.en }}</div></div>
            <div class="field-value price">{{ formatCurrency(productData.factoryQuotation) }}</div>
          </div>
          <div class="field-item" v-if="shouldShowField('newestUsdQuotation')">
            <div class="field-label"><div class="label-cn">{{ fieldText.newestUsdQuotation.cn }}</div><div class="label-en">{{ fieldText.newestUsdQuotation.en }}</div></div>
            <div class="field-value price">{{ formatUSD(productData.newestUsdQuotation) }}</div>
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
            <div class="field-label"><div class="label-cn">{{ fieldText.size.cn }}</div><div class="label-en">{{ fieldText.size.en }}</div></div>
            <div class="field-value">{{ productData.size }}</div>
          </div>
        </div>
      </div>

      <!-- 面料信息卡片 -->
      <div class="card"
           v-if="shouldShowSection(['fabricCategoryName', 'fabricComposition', 'fabricWeight', 'fabricPrice', 'fabricSupplierName'])">
        <div class="card-header">
          <h2>面料信息</h2>
        </div>
        <div class="card-body">
          <div class="field-item" v-if="shouldShowField('fabricCategoryName')">
            <div class="field-label"><div class="label-cn">{{ fieldText.fabricCategoryName.cn }}</div><div class="label-en">{{ fieldText.fabricCategoryName.en }}</div></div>
            <div class="field-value">{{ productData.fabricCategoryName }}</div>
          </div>
          <div class="field-item" v-if="shouldShowField('fabricComposition')">
            <div class="field-label"><div class="label-cn">{{ fieldText.fabricComposition.cn }}</div><div class="label-en">{{ fieldText.fabricComposition.en }}</div></div>
            <div class="field-value">{{ productData.fabricComposition }}</div>
          </div>
          <div class="field-item" v-if="shouldShowField('fabricWeight')">
            <div class="field-label"><div class="label-cn">{{ fieldText.fabricWeight.cn }}</div><div class="label-en">{{ fieldText.fabricWeight.en }}</div></div>
            <div class="field-value">{{ productData.fabricWeight }}</div>
          </div>
          <div class="field-item" v-if="shouldShowField('fabricPrice')">
            <div class="field-label"><div class="label-cn">{{ fieldText.fabricPrice.cn }}</div><div class="label-en">{{ fieldText.fabricPrice.en }}</div></div>
            <div class="field-value price">{{ formatCurrency(productData.fabricPrice) }}</div>
          </div>
          <div class="field-item" v-if="shouldShowField('fabricSupplierName')">
            <div class="field-label"><div class="label-cn">{{ fieldText.fabricSupplierName.cn }}</div><div class="label-en">{{ fieldText.fabricSupplierName.en }}</div></div>
            <div class="field-value">{{ productData.fabricSupplierName }}</div>
          </div>
        </div>
      </div>

      <!-- 里布信息卡片 -->
      <div class="card"
           v-if="shouldShowSection(['liningCategory', 'liningIngredient', 'liningWeightPer', 'liningPrice', 'liningSupplierName'])">
        <div class="card-header">
          <h2>里布信息</h2>
        </div>
        <div class="card-body">
          <div class="field-item" v-if="shouldShowField('liningCategory')">
            <div class="field-label"><div class="label-cn">{{ fieldText.liningCategory.cn }}</div><div class="label-en">{{ fieldText.liningCategory.en }}</div></div>
            <div class="field-value">{{ productData.liningCategory }}</div>
          </div>
          <div class="field-item" v-if="shouldShowField('liningIngredient')">
            <div class="field-label"><div class="label-cn">{{ fieldText.liningIngredient.cn }}</div><div class="label-en">{{ fieldText.liningIngredient.en }}</div></div>
            <div class="field-value">{{ productData.liningIngredient }}</div>
          </div>
          <div class="field-item" v-if="shouldShowField('liningWeightPer')">
            <div class="field-label"><div class="label-cn">{{ fieldText.liningWeightPer.cn }}</div><div class="label-en">{{ fieldText.liningWeightPer.en }}</div></div>
            <div class="field-value">{{ productData.liningWeightPer }}</div>
          </div>
          <div class="field-item" v-if="shouldShowField('liningPrice')">
            <div class="field-label"><div class="label-cn">{{ fieldText.liningPrice.cn }}</div><div class="label-en">{{ fieldText.liningPrice.en }}</div></div>
            <div class="field-value price">{{ formatCurrency(productData.liningPrice) }}</div>
          </div>
          <div class="field-item" v-if="shouldShowField('liningSupplierName')">
            <div class="field-label"><div class="label-cn">{{ fieldText.liningSupplierName.cn }}</div><div class="label-en">{{ fieldText.liningSupplierName.en }}</div></div>
            <div class="field-value">{{ productData.liningSupplierName }}</div>
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
            <div class="field-label"><div class="label-cn">{{ fieldText.remark.cn }}</div><div class="label-en">{{ fieldText.remark.en }}</div></div>
            <div class="field-value remark">{{ productData.remark }}</div>
          </div>
        </div>
      </div>

      <!-- 照片信息卡片 -->
      <div class="card" v-if="shouldShowSection(['fileUrlList'])">
        <div class="card-header">
          <h2><span class="header-cn">{{ fieldText.fileUrlList.cn }}</span> <span class="header-en">{{ fieldText.fileUrlList.en }}</span></h2>
        </div>
        <div class="card-body">
          <div v-if="productData.fileUrlList && productData.fileUrlList.length > 0 && shouldShowField('fileUrlList')"
               class="image-gallery">
            <!--            <el-carousel-->
            <!--                height="200px"-->
            <!--                indicator-position="outside"-->
            <!--                arrow="always"-->
            <!--            >-->
            <!--              <el-carousel-item-->
            <!--                  v-for="(img, index) in productData.fileUrlList"-->
            <!--                  :key="index"-->
            <!--              >-->
            <!--                <div class="carousel-item">-->
            <!--                  <img-->
            <!--                      :src="img.url"-->
            <!--                      :alt="img.name || '产品图片'"-->
            <!--                      class="carousel-image"-->
            <!--                  />-->
            <!--&lt;!&ndash;                  <div class="image-name" v-if="img.name">&ndash;&gt;-->
            <!--&lt;!&ndash;                    {{ img.name }}&ndash;&gt;-->
            <!--&lt;!&ndash;                  </div>&ndash;&gt;-->
            <!--                </div>-->
            <!--              </el-carousel-item>-->
            <!--            </el-carousel>-->
            <Swipe :autoplay="3000" indicator-color="white">
              <SwipeItem class="carousel-item" v-for="(img, index) in productData.fileUrlList" :key="index">
                <VanImage
                    class="carousel-image"
                    fit="contain"
                    :src="img.url"
                    :alt="img.name || '产品图片'"
                    @click="handleImagePreview(index)"
                />
              </SwipeItem>
            </Swipe>

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
import {ref, onMounted, getCurrentInstance} from 'vue'
import {useRoute} from 'vue-router'
import {Swipe, SwipeItem, Image as VanImage, ImagePreview, showImagePreview} from 'vant';
import {getViewDetailRequest} from '@/api/product.js'

// 定义数据模型
interface ProductData {
  id?: number
  name: string | number
  sampleCategoryName: string | number
  storageTime: string | number
  clientName: string | number
  factoryName: string | number
  clientStyleNo: string | number
  styleNo: string | number
  factoryQuotation: string | number
  newestUsdQuotation: string | number
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
  fileUrlList: { name: string; url: string }[]

  [key: string]: any
}

const {proxy} = getCurrentInstance()
const productShowConfigList = ref([])

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
  newestUsdQuotation: '',
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
async function fetchData(id) {
  const res = await getViewDetailRequest(id)
  productData.value = res.data
  Object.keys(productData.value).forEach(key => {
    // fieldValue !== '' && fieldValue !== null && fieldValue !== undefined
    if (productData.value[key] === '' || productData.value[key] === null || productData.value[key] === undefined) {
      productData.value[key] = '--'
    }
  })
  productShowConfigList.value = res.data?.sysDictDataList?.map(item => ({
    // 下划线转小驼峰
    props: item.dictValue.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase()),
    show: item.status === '0'
  }))
}

const fieldText = {
  name: { cn: '产品名称', en: 'NAME' },
  sampleCategoryName: { cn: '样品类别', en: 'SAMPLE CATEGORY' },
  storageTime: { cn: '入库时间', en: 'DATE' },
  clientName: { cn: '客户', en: 'CLIENT' },
  factoryName: { cn: '工厂', en: 'FACTORY' },
  clientStyleNo: { cn: '客人款号', en: 'CLIENT STYLE NO.' },
  styleNo: { cn: '公司款号', en: 'STYLE NO.' },
  factoryQuotation: { cn: '工厂报价', en: 'RMB' },
  newestUsdQuotation: { cn: '美元报价', en: 'USD' },
  size: { cn: '尺码', en: 'SIZE' },
  fabricCategoryName: { cn: '面料种类', en: 'FABRIC CATEGORY' },
  fabricComposition: { cn: '面料成分', en: 'COMPOSTION' },
  fabricWeight: { cn: '面料克重', en: 'FABRIC WEIGHT' },
  fabricPrice: { cn: '面料价格', en: 'FABRIC PRICE' },
  fabricSupplierName: { cn: '面料供应商', en: 'FABRIC SUPPLIER' },
  liningCategory: { cn: '里布种类', en: 'LINING CATEGORY' },
  liningIngredient: { cn: '里布成分', en: 'COMPOSTION' },
  liningWeightPer: { cn: '里布克重', en: 'LINING WEIGHT' },
  liningPrice: { cn: '里布价格', en: 'LINING PRICE' },
  liningSupplierName: { cn: '里布供应商', en: 'LINING SUPPLIER' },
  remark: { cn: '备注', en: 'Remark' },
  fileUrlList: { cn: '照片', en: 'Photos' },
}

// 获取路由参数并加载数据（示例）
const route = useRoute()
onMounted(() => {
  // 这里应该从API获取实际数据，这里只是模拟
  const id = route.query.id
  fetchData(id)

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
  //   newestUsdQuotation: '3.50',
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
  const num = Number(value)
  return Number.isFinite(num) ? '¥' + num.toFixed(2) : '--'
}

// 格式化美元显示
const formatUSD = (value: string | number) => {
  const num = Number(value)
  return Number.isFinite(num) ? '$' + num.toFixed(2) : '--'
}

// 判断字段是否应该显示
const shouldShowField = (fieldName: string | number) => {
  // 查找字段配置
  const config = productShowConfigList.value.find(item => item.props === fieldName)
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

  // return fieldValue !== '' && fieldValue !== null && fieldValue !== undefined
  return true
}

// 判断模块是否应该显示（至少有一个字段需要显示）
const shouldShowSection = (fieldNames: string[]) => {
  return fieldNames.some(fieldName => shouldShowField(fieldName))
}
// 预览图片
const handleImagePreview = (startPosition: number) => {
  showImagePreview({
    images: productData.value.fileUrlList.map(item => item.url),
    closeable: true,
    startPosition: startPosition,
  })
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
            width: 38%;
            flex-shrink: 0;
          }

          .label-cn {
            font-weight: 600;
            color: #333;
            font-size: 14px;
            line-height: 1.2;
          }

          .label-en {
            color: #888;
            font-size: 12px;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            line-height: 1.2;
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
            }
          }
        }
      }
    }
  }
}
</style>
