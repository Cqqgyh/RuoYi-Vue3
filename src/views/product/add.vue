<template>
  <div class="app-container mobile-container">
    <el-card class="mobile-card" shadow="never">
      <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-position="top"
          size="large"
          class="mobile-form"
          scroll-to-error
          :scroll-into-view-options='{
            block: "center",
            behavior: "smooth",
          }'
      >
        <el-form-item label="产品名称" prop="name">
          <el-input v-model.trim="form.name" placeholder="请输入产品名称" clearable/>
        </el-form-item>
        <el-form-item label="样品类别" prop="sampleCategoryId">
          <el-tree-select
              v-model="form.sampleCategoryId"
              :data="sampleCategoryList"
              :props="{ value: 'id', label: 'categoryName', children: 'children' }"
              value-key="id"
              placeholder="请选择样品类别"
              check-strictly
              clearable
          />
<!--          <el-select v-model="form.sampleCategoryId" placeholder="请选择样品类别" filterable clearable>-->
<!--            <el-option v-for="item in sampleCategoryList" :key="item.value" :label="item.label" :value="item.value"/>-->
<!--          </el-select>-->
<!--          -->
        </el-form-item>
        <el-form-item label="入库时间" prop="storageTime">
          <el-date-picker style="width: 100%;" v-model="form.storageTime" type="datetime"
                          value-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择入库时间"/>
        </el-form-item>
        <el-form-item label="客户" prop="clientId">
          <el-select v-model="form.clientId" placeholder="请选择客户" filterable clearable>
            <el-option v-for="item in clientList" :key="item.id" :label="item.clientName" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="工厂" prop="factoryId">
          <el-select v-model="form.factoryId" placeholder="请选择供应商" filterable clearable>
            <el-option v-for="item in supplierList" :key="item.id" :label="item.supplierName" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="客人款号" prop="clientStyleNo">
          <el-input v-model.trim="form.clientStyleNo" placeholder="请输入客人款号" clearable/>
        </el-form-item>
        <el-form-item label="公司款号" prop="styleNo">
          <el-input v-model.trim="form.styleNo" placeholder="请输入公司款号" clearable/>
        </el-form-item>
        <el-form-item label="工厂报价" prop="factoryQuotation">
          <el-input-number v-model.trim="form.factoryQuotation" placeholder="请输入工厂报价" :precision="2"/>
        </el-form-item>
        <el-form-item label="美元报价" prop="usdQuotation">
          <el-input-number v-model.trim="form.usdQuotation" placeholder="请输入美元报价" :precision="2"/>
        </el-form-item>
        <el-form-item label="尺码" prop="size">
          <el-input v-model.trim="form.size" placeholder="请输入尺码" clearable/>
        </el-form-item>
        <el-form-item label="面料种类" prop="fabricCategoryId">
          <el-select v-model="form.fabricCategoryId" placeholder="请选择面料种类" filterable clearable>
            <el-option v-for="item in fabricCategoryList" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="面料成分" prop="fabricComposition">
          <el-input v-model.trim="form.fabricComposition" placeholder="请输入面料成分" clearable/>
        </el-form-item>
        <el-form-item label="面料克重" prop="fabricWeight">
          <el-input-number v-model.trim="form.fabricWeight" placeholder="请输入面料克重" :precision="2"/>
        </el-form-item>
        <el-form-item label="面料价格" prop="fabricPrice">
          <el-input-number v-model.trim="form.fabricPrice" placeholder="请输入面料价格" :precision="2"/>
        </el-form-item>
        <el-form-item label="面料供应商" prop="fabricSupplierId">
          <el-select v-model="form.fabricSupplierId" placeholder="请选择面料供应商" filterable clearable>
            <el-option v-for="item in supplierList" :key="item.id" :label="item.supplierName" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="里布种类" prop="liningCategory">
          <el-input v-model.trim="form.liningCategory" placeholder="请输入里布种类" clearable/>
        </el-form-item>
        <el-form-item label="里布成分" prop="liningIngredient">
          <el-input v-model.trim="form.liningIngredient" placeholder="请输入里布成分" clearable/>
        </el-form-item>
        <el-form-item label="里布克重" prop="liningWeightPer">
          <el-input-number v-model.trim="form.liningWeightPer" placeholder="请输入里布克重" :precision="2"/>
        </el-form-item>
        <el-form-item label="里布价格" prop="liningPrice">
          <el-input-number v-model.trim="form.liningPrice" placeholder="请输入里布价格" :precision="2"/>
        </el-form-item>
        <el-form-item label="里布供应商" prop="liningSupplierId">
          <el-select v-model="form.liningSupplierId" placeholder="请选择里布供应商" filterable clearable>
            <el-option v-for="item in supplierList" :key="item.id" :label="item.supplierName" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="照片" prop="fileUrlList">
          <image-upload v-model="form.fileUrlList"/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model.trim="form.remark" type="textarea" placeholder="请输入备注"/>
        </el-form-item>
        <el-form-item v-if="form.id" label="历史报价" prop="remark">
          <div>
            <div v-if="Array.isArray(form.quotationProductList) && form.quotationProductList.length">
              <ul style="overflow: auto;">
                <li v-for="i in form.quotationProductList" :key="i" style="margin-bottom: 10px;">
                  <span style="margin-right:50px">报价日期:{{ i.quotationDate }}</span>
                  <span>美元报价:{{ i.usdQuotation }}</span>
                </li>
              </ul>
            </div>
            <div v-else style="color: var(--el-text-color-secondary);">暂无历史报价</div>
          </div>
        </el-form-item>

      </el-form>
    </el-card>
    <van-action-bar class="mobile-actions">
      <el-button v-btnPreventRepeat style="width: 100px;" round size="large" @click="cancel">返 回</el-button>
      <el-button v-btnPreventRepeat round type="primary" size="large" @click="submitForm">确 定</el-button>
    </van-action-bar>
  </div>
</template>

<script setup name="ProductAdd">
import { getDetailRequest, addRequest, updateRequest } from '@/api/product.js'
import { useRouter, useRoute } from 'vue-router'
import { ActionBar as VanActionBar } from 'vant'
import useSettingsStore from '@/store/modules/settings.js'
import { getListPageAll as getClientListAll } from '@/api/client.js'
import { getListPageAll as getSupplierListAll } from '@/api/supplier.js'
import ImageUpload from '@/components/ImageUpload/index.vue'
import { getListPageAll as getSampleCategoryListAll } from '@/api/category.js'

const { proxy } = getCurrentInstance()
const router = useRouter()
const route = useRoute()
const formRef = ref(null)

const data = reactive({
  form: {},
  rules: {
    name: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
    clientStyleNo: [{ required: true, message: '请输入客人款号', trigger: 'blur' }],
    styleNo: [{ required: true, message: '请输入公司款号', trigger: 'blur' }],
    clientId: [{ required: true, message: '请选择客户', trigger: 'change' }],
  },
})

const { form, rules } = toRefs(data)

const pageTitle = computed(() => route.query?.id ? '修改产品' : '添加产品')
const settingsStore = useSettingsStore()
settingsStore.title = pageTitle.value

function cancel () {
  router.back()
}

function reset () {
  form.value = {
    /* 客户id
    */
    clientId: '',
    /**
     * 客人款号
     */
    clientStyleNo: '',
    /**
     * 面料种类
     */
    fabricCategoryId: '',
    /**
     * 面料成分
     */
    fabricComposition: '',
    /**
     * 面料价格
     */
    fabricPrice: null,
    /**
     * 面料供应商id
     */
    fabricSupplierId: '',
    /**
     * 面料克重
     */
    fabricWeight: null,
    /**
     * 工厂id
     */
    factoryId: '',
    /**
     * 工厂报价
     */
    factoryQuotation: null,
    /**
     * 附件列表-附件url
     */
    fileUrlList: [],
    /**
     * 是否可以展示给客户：是、否
     */
    isShowFlag: '',
    /**
     * 里布种类
     */
    liningCategory: '',
    /**
     * 里布成分
     */
    liningIngredient: '',
    /**
     * 里布价格
     */
    liningPrice: null,
    /**
     * 里布供应商id
     */
    liningSupplierId: '',
    /**
     * 里布克重
     */
    liningWeightPer: null,
    /**
     * 产品名称
     */
    name: '',
    /**
     * 最新美元报价-多次报价取最新
     */
    newestUsdQuotation: '',

    /**
     * 备注
     */
    remark: '',
    /**
     * 样品类别id-字典取
     */
    sampleCategoryId: '',
    /**
     * 尺码
     */
    size: '',
    /**
     * 入库时间
     */
    storageTime: '',
    /**
     * 公司款号
     */
    styleNo: '',
    /**
     * 美元报价
     */
    usdQuotation: null,
  }
  setTimeout(() => {
    formRef.value?.clearValidate()
  })
}

const supplierList = ref([])
const clientList = ref([])
const { fabric_category: fabricCategoryList } = proxy.useDictForCode(
    'fabric_category', )
const sampleCategoryList = ref([])
const getSampleCategoryList = async () => {
  await getSampleCategoryListAll().then(response => {
    sampleCategoryList.value = proxy.handleTree(response.data, 'id')
  })
}
getSampleCategoryList()

async function getClientList () {
  const res = await getClientListAll()
  clientList.value = res.data
}

async function getSupplierList () {
  const res = await getSupplierListAll()
  supplierList.value = res.data
}

async function initDetail () {
  const id = route.query?.id
  if (id) {
    const res = await getDetailRequest(id)
    form.value = {
      /* 客户id
 */
      clientId: '',
      /**
       * 客人款号
       */
      clientStyleNo: '',
      /**
       * 面料种类
       */
      fabricCategoryId: '',
      /**
       * 面料成分
       */
      fabricComposition: '',
      /**
       * 面料价格
       */
      fabricPrice: null,
      /**
       * 面料供应商id
       */
      fabricSupplierId: '',
      /**
       * 面料克重
       */
      fabricWeight: null,
      /**
       * 工厂id
       */
      factoryId: '',
      /**
       * 工厂报价
       */
      factoryQuotation: null,
      /**
       * 附件列表-附件url
       */
      fileUrlList: [],
      /**
       * 是否可以展示给客户：是、否
       */
      isShowFlag: '',
      /**
       * 里布种类
       */
      liningCategory: '',
      /**
       * 里布成分
       */
      liningIngredient: '',
      /**
       * 里布价格
       */
      liningPrice: null,
      /**
       * 里布供应商id
       */
      liningSupplierId: '',
      /**
       * 里布克重
       */
      liningWeightPer: null,
      /**
       * 产品名称
       */
      name: '',
      /**
       * 最新美元报价-多次报价取最新
       */
      newestUsdQuotation: '',

      /**
       * 备注
       */
      remark: '',
      /**
       * 样品类别id-字典取
       */
      sampleCategoryId: '',
      /**
       * 尺码
       */
      size: '',
      /**
       * 入库时间
       */
      storageTime: '',
      /**
       * 公司款号
       */
      styleNo: '',
      /**
       * 美元报价
       */
      usdQuotation: null,
      ...res.data,
    }
    setTimeout(() => {
      formRef.value?.clearValidate()
    })
  } else {
    reset()
  }
}

onMounted(() => {
  getClientList()
  getSupplierList()
  initDetail()
})

function submitForm () {
  formRef.value?.validate(async valid => {
    if (valid) {
      if (form.value.id) {
        await updateRequest(form.value).then(response => {
          proxy.$modal.msgSuccess('修改成功')
          router.back()
        })
      } else {
        await addRequest(form.value).then(response => {
          proxy.$modal.msgSuccess('新增成功')
          router.back()
        })
      }
    }
  })
}

</script>

<style scoped lang="scss">
.mobile-container {
  background: #f7f8fa;
  min-height: 100%;
  padding-bottom: 80px;
}

.mobile-card {
  border-radius: 12px;
  max-width: 720px;
}

.mobile-form :deep(.el-form-item) {
  margin-bottom: 16px;
}

.mobile-actions {
  padding: 0 15px;
}

.mobile-actions :deep(.el-button) {
  flex: 1;
}
</style>
