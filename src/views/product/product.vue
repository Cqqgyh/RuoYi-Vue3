<template>
  <div class="app-container">
    <Teleport v-if="flag" to="#searchContainer">
      <div class="h5-filter-bar" v-show="showSearch">
        <el-form :model="queryParams" ref="queryRef" :inline="false" label-position="top" class="h5-filter-inline">
          <el-form-item label="" prop="name" style="margin-bottom: 0;">
            <div class="h5-filter-primary">
              <el-input
                  v-model.trim="queryParams.name"
                  placeholder="请输入产品名称"
                  clearable
                  class="h5-input"
                  @keyup.enter="handleQuery"
              />
              <div class="h5-actions">
                <el-button v-btnPreventRepeat type="primary" icon="Search" size="small"
                           @click="handleQuery"></el-button>
                <el-button v-btnPreventRepeat icon="Refresh" size="small" @click="resetQuery"></el-button>
                <el-button v-btnPreventRepeat link icon="MoreFilled" size="small" @click="openMore"></el-button>
              </div>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </Teleport>

    <el-drawer v-model="moreVisible" title="更多筛选" direction="rtl" size="80%">
      <el-form :model="queryParams" ref="queryMoreRef" :inline="false" label-position="top" class="h5-filter-more">
        <el-form-item label="产品名称" prop="name">
          <el-input v-model.trim="queryParams.name" placeholder="请输入产品名称" clearable
                    @keyup.enter="handleQuery"/>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
              v-model="dateRange[0]"
              value-format="YYYY-MM-DD"
              type="date"
              placeholder="请选择开始日期"
              style="margin-bottom: 3px;width: 100%;"
          />
          <el-date-picker
              v-model="dateRange[1]"
              value-format="YYYY-MM-DD"
              type="date"
              placeholder="请选择结束日期"
              style="margin-bottom: 3px;width: 100%;"
          />
        </el-form-item>
        <el-form-item label="样品类别" prop="sampleCategoryId">
          <el-tree-select
              v-model="queryParams.sampleCategoryId"
              :data="sampleCategoryList"
              :props="{ value: 'id', label: 'categoryName', children: 'children' }"
              value-key="id"
              placeholder="请选择样品类别"
              check-strictly
              clearable
          />
          <!--          <el-select v-model="queryParams.sampleCategoryId" placeholder="请选择样品类别">-->
          <!--            <el-option v-for="item in sampleCategoryList" :key="item.value" :label="item.label" :value="item.value"/>-->
          <!--          </el-select>-->
        </el-form-item>
        <el-form-item label="公司款号" prop="styleNo">
          <el-input v-model.trim="queryParams.styleNo" placeholder="请输入公司款号" clearable
                    @keyup.enter="handleQuery"/>
        </el-form-item>
        <el-form-item label="客人款号" prop="clientStyleNo">
          <el-input v-model.trim="queryParams.clientStyleNo" placeholder="请输入客人款号" clearable
                    @keyup.enter="handleQuery"/>
        </el-form-item>
        <el-form-item label="客户名称" prop="clientName">
          <el-input v-model.trim="queryParams.clientName" placeholder="请输入客户名称" clearable
                    @keyup.enter="handleQuery"/>
        </el-form-item>
        <el-form-item label="工厂名称" prop="factoryName">
          <el-input v-model.trim="queryParams.factoryName" placeholder="请输入工厂名称" clearable
                    @keyup.enter="handleQuery"/>
        </el-form-item>
      </el-form>
      <div class="h5-drawer-actions">
        <el-button v-btnPreventRepeat type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button v-btnPreventRepeat icon="Refresh" @click="resetQuery">重置</el-button>
      </div>
    </el-drawer>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button v-btnPreventRepeat
                   type="primary"
                   plain
                   icon="Plus"
                   @click="handleAdd"
                   size="small"
                   v-hasPermi="['system:product:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button v-btnPreventRepeat
                   type="danger"
                   plain
                   icon="Delete"
                   :disabled="multiple"
                   size="small"
                   @click="handleDelete"
                   v-hasPermi="['system:product:remove']"
        >批量删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button v-btnPreventRepeat
                   type="warning"
                   plain
                   icon="Download"
                   @click="handleExport"
                   v-hasPermi="['system:product:export']"
                   size="small"
        >导出
        </el-button>
      </el-col>
      <!--      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>-->
    </el-row>

    <el-table v-loading="loading" :data="typeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <!--        产品名称 name-->
      <!--        样品类别id	sampleCategoryId 下拉列表-->
      <!--        入库时间	storageTime-->
      <!--        客户	clientId  客户下拉列表-->
      <!--        工厂	factoryId 供应商下拉列表-->
      <!--        客人款号	clientStyleNo.-->
      <!--        公司款号	styleNo.-->
      <!--        工厂报价	factoryQuotation-->
      <!--        美元报价	usdQuotation/newestUsdQuotation-->
      <!--        尺码	size-->
      <!--        面料种类	fabricCategoryId	下拉列表-->
      <!--        面料成分	fabricComposition-->
      <!--        面料克重	fabricWeight-->
      <!--        面料价格	fabricPrice-->
      <!--        面料供应商	fabricSupplierId	供应商下拉列表-->
      <!--        里布种类	liningCategory-->
      <!--        里布成分	liningIngredient-->
      <!--        里布克重	liningWeightPer-->
      <!--        里布价格	liningPrice-->
      <!--        里布供应商	liningSupplierId	供应商下拉列表-->
      <!--        备注  remark-->
      <!--        照片  fileUrlList-->
      <el-table-column label="产品名称" align="center" prop="name" :show-overflow-tooltip="true" width="180px"/>
      <el-table-column label="样品类别" align="center" prop="sampleCategoryName" :show-overflow-tooltip="true"/>
      <el-table-column label="客人款号" align="center" prop="clientStyleNo" :show-overflow-tooltip="true"
                       width="180px"/>
      <el-table-column label="公司款号" align="center" prop="styleNo" :show-overflow-tooltip="true" width="180px"/>
      <el-table-column label="客户名称" align="center" prop="clientName" :show-overflow-tooltip="true" width="180px"/>
      <el-table-column label="工厂名称" align="center" prop="factoryName" :show-overflow-tooltip="true" width="180px"/>
      <el-table-column label="入库时间" align="center" prop="storageTime" :show-overflow-tooltip="true" width="180px"/>
      <el-table-column label="工厂报价" align="center" prop="factoryQuotation" :show-overflow-tooltip="true"/>
      <el-table-column label="美元报价" align="center" prop="usdQuotation" :show-overflow-tooltip="true"/>
      <el-table-column label="尺码" align="center" prop="size" :show-overflow-tooltip="true"/>
      <el-table-column label="面料种类" align="center" prop="fabricCategoryName" :show-overflow-tooltip="true"
                       width="180px"/>
      <el-table-column label="面料成分" align="center" prop="fabricComposition" :show-overflow-tooltip="true"
                       width="180px"/>
      <el-table-column label="面料克重" align="center" prop="fabricWeight" :show-overflow-tooltip="true" width="180px"/>
      <el-table-column label="面料价格" align="center" prop="fabricPrice" :show-overflow-tooltip="true" width="180px"/>
      <el-table-column label="面料供应商" align="center" prop="fabricSupplierName" :show-overflow-tooltip="true"
                       width="180px"/>
      <el-table-column label="里布种类" align="center" prop="liningCategory" :show-overflow-tooltip="true"
                       width="180px"/>
      <el-table-column label="里布成分" align="center" prop="liningIngredient" :show-overflow-tooltip="true"
                       width="180px"/>
      <el-table-column label="里布克重" align="center" prop="liningWeightPer" :show-overflow-tooltip="true"
                       width="180px"/>
      <el-table-column label="里布价格" align="center" prop="liningPrice" :show-overflow-tooltip="true" width="180px"/>
      <el-table-column label="里布供应商" align="center" prop="liningSupplierName" :show-overflow-tooltip="true"
                       width="180px"/>
      <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true" width="180px"/>
      <el-table-column label="创建时间" align="center" prop="createTime" width="160">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <!--      悬浮操作列-->
      <el-table-column label="操作" align="center" width="460" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button v-btnPreventRepeat link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['system:product:edit']">
            修改
          </el-button>
          <el-button v-btnPreventRepeat link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                     v-hasPermi="['system:product:remove']">删除
          </el-button>
          <el-button v-btnPreventRepeat link type="primary" icon="Share" @click="handleShareLink(scope.row)"
                     v-hasPermi="['system:product:share']">
            获取分享链接
          </el-button>
          <!--         icon是用符合二维码的icon-->
          <el-button v-btnPreventRepeat link type="primary" icon="Link" @click="handleShareLink(scope.row,true)"
                     v-hasPermi="['system:product:share']">
            下载二维码
          </el-button>
          <el-button v-btnPreventRepeat link type="primary" icon="Printer" @click="handlePrintPdf(scope.row)"
                     v-hasPermi="['system:product:print']">PDF下载
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
        v-show="total > 0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
    />
  </div>
</template>

<script setup name="Product">
import {
  getListPage,
  getDetailRequest,
  addRequest,
  updateRequest,
  delRequest,
  delBatchRequest,
  getQrcodeUrlRequest, printPdfRequest,
} from '@/api/product.js'
import { getListPageAll as getClientListAll } from '@/api/client.js'
import { getListPageAll as getSupplierListAll } from '@/api/supplier.js'
import ImageUpload from '@/components/ImageUpload/index.vue'
import { useRouter } from 'vue-router'
import { parseTime } from '@/utils/ruoyi.js'
import { showImagePreview } from 'vant'
import { getListPageAll as getSampleCategoryListAll } from '@/api/category.js'
import downloadFile from '@/utils/download.js'

const { proxy } = getCurrentInstance()
const router = useRouter()
let flag = ref(false)
onMounted(() => {
  if (document.getElementById('searchContainer')) {
    flag.value = true
  }
})
const typeList = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const moreVisible = ref(false)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref('')
const dateRange = ref([])

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
  },
  rules: {
    // 产品名称
    name: [
      { required: true, message: '请输入产品名称', trigger: 'blur' },
    ],
    // 客人款号
    clientStyleNo: [
      { required: true, message: '请输入客人款号', trigger: 'blur' },
    ],
    styleNo: [
      { required: true, message: '请输入公司款号', trigger: 'blur' },
    ],
    //   客户
    // 客户id
    clientId: [
      { required: true, message: '请选择客户', trigger: 'change' },
    ],
  },
})

const { queryParams, form, rules } = toRefs(data)
//#region <供应商、客户>
const supplierList = ref([])
const clientList = ref([])

/** 获取客户列表 */
async function getClientList () {
  const res = await getClientListAll()
  clientList.value = res.data
}

async function getSupplierList () {
  const res = await getSupplierListAll()
  supplierList.value = res.data
}

getClientList()
getSupplierList()
//#endregion
//#region <样品类别、面料种类>
const { fabric_category: fabricCategoryList } = proxy.useDictForCode(
    'fabric_category')
console.log('fabricCategoryList', fabricCategoryList)
const sampleCategoryList = ref([])
const getSampleCategoryList = async () => {
  await getSampleCategoryListAll().then(response => {
    sampleCategoryList.value = proxy.handleTree(response.data, 'id')
  })
}
getSampleCategoryList()

//#endregion

/** 查询字典类型列表 */
function getList () {
  loading.value = true
  console.log('queryParams.value', queryParams.value)
  getListPage(proxy.addDateRangeMode(queryParams.value, dateRange.value)).then(response => {
    typeList.value = response.rows
    total.value = response.total
    loading.value = false
  })
}

/** 取消按钮 */
function cancel () {
  open.value = false
  reset()
}

/** 表单重置 */
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
    fabricPrice: '',
    /**
     * 面料供应商id
     */
    fabricSupplierId: '',
    /**
     * 面料克重
     */
    fabricWeight: '',
    /**
     * 工厂id
     */
    factoryId: '',
    /**
     * 工厂报价
     */
    factoryQuotation: '',
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
    liningPrice: '',
    /**
     * 里布供应商id
     */
    liningSupplierId: '',
    /**
     * 里布克重
     */
    liningWeightPer: '',
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
    usdQuotation: '',
  }
  proxy.resetForm('dictRef')
}

/** 搜索按钮操作 */
function handleQuery () {
  queryParams.value.pageNum = 1
  getList()
  closeMore()
}

/** 重置按钮操作 */
function resetQuery () {
  dateRange.value = []
  proxy.resetForm('queryRef')
  proxy.resetForm('queryMoreRef')
  handleQuery()
}

const x = () => {
  const digitalProjectId = params.formConfig.data?.digitalProjectId
  const digitalProjectColumn = params.formConfig.columns.find(col => col.key === 'digitalProjectId')
  if (digitalProjectId && digitalProjectColumn) {
    const res = digitalProjectColumn.props.options?.find(item => item.value === digitalProjectId)
    if (res) {
      params.formConfig.data.firstName = res.secondName
      params.formConfig.data.firstId = res.secondId
    } else {
      params.formConfig.data.firstName = ''
      params.formConfig.data.firstId = null
    }

  }

}

function openMore () {
  moreVisible.value = true
}

function closeMore () {
  moreVisible.value = false
}

/** 新增按钮操作 */
function handleAdd () {
  router.push({ path: '/productAddOrEdit' })
  // reset()
  // open.value = true
  // title.value = '添加客户'
}

/** 多选框选中数据 */
function handleSelectionChange (selection) {
  ids.value = selection.map(item => item.id)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 修改按钮操作 */
function handleUpdate (row) {
  router.push({ path: '/productAddOrEdit', query: { id: row.id } })
  // reset()
  // const id = row.id || ids.value
  // getDetailRequest(id).then(response => {
  //   form.value = response.data
  //   open.value = true
  //   title.value = '修改字典类型'
  // })
}

/** 打印PDF按钮操作 */
function handlePrintPdf (row) {
  proxy.$modal.confirm('是否确认下载此PDF？').then(async function () {
    const res = await printPdfRequest({ productId: row.id })
    if (window.navigator.userAgent.includes('miniProgram') || window.navigator.userAgent.includes('wechat') ||
        window.navigator.userAgent.includes('chat') || window.navigator.userAgent.includes('Chat')) {
      // 打开新地址页面
      window.open(window.location.origin + import.meta.env.VITE_APP_BASE_API + res.url)
    } else {
      await downloadFile(window.location.origin + import.meta.env.VITE_APP_BASE_API + res.url, `产品_${row.name}.pdf`)
    }
    // 调用浏览器打印这个PDF
    proxy.$modal.msgSuccess('下载成功')
  }).then((res) => {

  }).catch(() => {})
}

const shareLink = ref('')

/** 分享链接按钮操作 */
async function handleShareLink (row, isDownload) {
  // 获取当前域名
  const origin = window.location.origin
  // 拼接分享链接
  shareLink.value = `${origin}/viewCard?id=${row.id}`
  if (isDownload) {
    const res = await getQrcodeUrlRequest({ url: shareLink.value })

    if (window.navigator.userAgent.includes('miniProgram') || window.navigator.userAgent.includes('wechat') ||
        window.navigator.userAgent.includes('chat') || window.navigator.userAgent.includes('Chat')) {
      // 获取元素 class van-image-preview__index 内容修改为：请手动截图下载
      //
      const base64url = URL.createObjectURL(new Blob([res], { type: 'image/png' }))
      showImagePreview({
        images: [base64url],
        closeable: true,
        startPosition: 0,
      })
      setTimeout(() => {
        const indexElement = document.querySelector('.van-image-preview__index')
        if (indexElement) {
          indexElement.innerHTML = '&nbsp&nbsp&nbsp&nbsp请手动截图下载<br/>或者长按保存到手机 <br/> '

        }
      })
    } else {
      // 使用项目已有的下载方式
      const blob = new Blob([res], { type: 'image/png' })
      const fileName = `二维码_${row.name}.png`
      saveAs(blob, fileName)
      proxy.$modal.msgSuccess('下载成功')
    }

  } else {
    // 复制分享链接到剪贴板
    await copyToClipboard(shareLink.value)
    // await navigator.clipboard.writeText(shareLink.value)
    proxy.$modal.msgSuccess('复制成功')
  }

}

function copyToClipboard (text) {
  // 优先尝试 Clipboard API（仅在安全上下文可用）
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text)
  } else {
    // 降级：使用 execCommand（可在 HTTP 下工作）
    const textarea = document.createElement('textarea')
    textarea.value = text

    // 隐藏元素
    textarea.style.position = 'fixed'
    textarea.style.left = '-9999px'
    textarea.style.top = '-9999px'

    document.body.appendChild(textarea)
    textarea.focus()
    textarea.select()

    try {
      const success = document.execCommand('copy')
      document.body.removeChild(textarea)
      if (success) {
        return Promise.resolve()
      } else {
        throw new Error('execCommand 复制失败')
      }
    } catch (err) {
      document.body.removeChild(textarea)
      console.error('复制失败:', err)
      return Promise.reject(err)
    }
  }
}

/** 提交按钮 */
function submitForm () {
  proxy.$refs['dictRef'].validate(valid => {
    if (valid) {
      if (form.value.id) {
        updateRequest(form.value).then(response => {
          proxy.$modal.msgSuccess('修改成功')
          open.value = false
          getList()
        })
      } else {
        addRequest(form.value).then(response => {
          proxy.$modal.msgSuccess('新增成功')
          open.value = false
          getList()
        })
      }
    }
  })
}

/** 删除按钮操作 */
function handleDelete (row) {
  const idOrIdList = row?.id || ids.value
  proxy.$modal.confirm('是否确认删除？').then(function () {
    return Array.isArray(idOrIdList) ? delBatchRequest(idOrIdList) : delRequest(idOrIdList)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess('删除成功')
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport () {
  proxy.download('/system/product/export', {
    ...queryParams.value,
  }, `产品管理_${new Date().getTime()}.xlsx`)
}

getList()
</script>

<style scoped lang="scss">
.h5-filter-bar {
  padding: 10px 12px;
  background: var(--el-fill-color-light);
  border-radius: 8px;
  position: sticky;
  top: 0;
  width: 100%;
  left: 0;
  right: 0;
  z-index: 1000;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
}

.h5-filter-inline {
  display: block;
}

.h5-filter-primary {
  display: flex;
  width: 100%;
}

.h5-input {
  width: 100%;
  min-width: 200px;
}

.h5-actions {
  display: flex;
  align-items: center;
  margin-left: 5px;
}


.h5-drawer-actions {
  position: sticky;
  bottom: 0;
  display: flex;
  gap: 8px;
  padding: 10px 0 10px 0;
  background: var(--el-bg-color);
  border-top: 1px solid var(--el-border-color-light);
  z-index: 100;
}

.h5-filter-more {
  padding-bottom: 60px;
}

.h5-drawer-actions::after {
  overflow: hidden;
  content: '';
  position: absolute;
  bottom: -20px;
  left: 0;
  width: 100%;
  height: 25px;
  background: var(--el-bg-color);
  z-index: 100;
}
</style>
