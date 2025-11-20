<template>
  <div class="app-container">
    <Teleport v-if="flag" to="#searchContainer">
      <div class="h5-filter-bar" v-show="showSearch">
        <el-form :model="queryParams" ref="queryRef" :inline="false" label-position="top" class="h5-filter-inline">
          <el-form-item label="" prop="quotationNo" style="margin-bottom: 0;">
            <div class="h5-filter-primary">
              <el-input
                  v-model.trim="queryParams.quotationNo"
                  placeholder="请输入报价单号"
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
        <el-form-item label="报价单号" prop="quotationNo">
          <el-input v-model.trim="queryParams.quotationNo" placeholder="请输入报价单号" clearable
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
        <el-form-item label="报价日期" prop="quotationDate">
          <el-date-picker v-model="queryParams.quotationDate" value-format="YYYY-MM-DD" type="date"
                          placeholder="请选择报价日期" style="margin-bottom: 3px;width: 100%;"/>
        </el-form-item>
        <el-form-item label="客户名称" prop="clientName">
          <el-input v-model.trim="queryParams.clientName" placeholder="请输入客户名称" clearable
                    @keyup.enter="handleQuery"/>
        </el-form-item>

        <div class="h5-drawer-actions">
          <el-button v-btnPreventRepeat type="primary" icon="Search" @click="handleQuery">搜索</el-button>
          <el-button v-btnPreventRepeat icon="Refresh" @click="resetQuery">重置</el-button>
        </div>
      </el-form>
    </el-drawer>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button v-btnPreventRepeat
                   type="primary"
                   plain
                   icon="Plus"
                   @click="handleAdd"
                   size="small"
                   v-hasPermi="['system:batch:record:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button v-btnPreventRepeat
                   type="danger"
                   plain
                   icon="Delete"
                   :disabled="multiple"
                   @click="()=>handleDelete()"
                   size="small"
                   v-hasPermi="['system:batch:record:remove']"
        >批量删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button v-btnPreventRepeat
                   type="warning"
                   plain
                   icon="Download"
                   @click="handleExport"
                   size="small"
                   v-hasPermi="['system:batch:record:export']"
        >导出
        </el-button>
      </el-col>
      <!--      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>-->
    </el-row>

    <el-table v-loading="loading" :data="typeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column type="expand">
        <template #default="props">
          <el-table :data="props.row.productList" :max-height="200" style="margin-left: 55px">
            <el-table-column prop="productName" label="产品名称" :show-overflow-tooltip="true"/>
            <el-table-column prop="clientStyleNo" label="客人款号" :show-overflow-tooltip="true"/>
            <el-table-column prop="styleNo" label="公司款号" :show-overflow-tooltip="true"/>
            <el-table-column prop="usdQuotation" label="美元报价" :show-overflow-tooltip="true"/>
            <el-table-column prop="remark" label="备注" :show-overflow-tooltip="true"/>
          </el-table>
        </template>
      </el-table-column>

      <el-table-column label="报价单号" align="center" prop="quotationNo" :show-overflow-tooltip="true"/>
      <el-table-column label="客户名称" align="center" prop="clientName" :show-overflow-tooltip="true"/>
      <el-table-column label="报价日期" align="center" prop="quotationDate" :show-overflow-tooltip="true"/>
      <el-table-column label="报价产品个数" align="center" prop="productList" :show-overflow-tooltip="true">
        <template #default="scope">
          {{ scope?.row?.productList?.length || 0 }}
        </template>
      </el-table-column>
      <el-table-column label="业务员名称" align="center" prop="salesPersonName" :show-overflow-tooltip="true"/>
      <el-table-column label="创建时间" align="center" prop="createTime" width="160">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作"  align="center" width="240" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button v-btnPreventRepeat link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['system:batch:record:edit']">
            修改
          </el-button>
          <el-button v-btnPreventRepeat link type="primary" icon="Message" @click="handleSendEmail(scope.row)"
                     v-hasPermi="['system:record:mail']">发送邮件
          </el-button>
          <el-button v-btnPreventRepeat link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                     v-hasPermi="['system:batch:record:remove']">删除
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
    <!--单个修改-->
    <!--    <el-dialog :title="title" v-model="open" width="500px" append-to-body>-->

    <!--      <el-form ref="dictRef" :model="form" :rules="rules" label-width="100px">-->
    <!--        <el-form-item label="客户名称" prop="clientName">-->
    <!--          &lt;!&ndash;          <el-input v-model.trim="form.name" placeholder="请输入产品名称"/>&ndash;&gt;-->
    <!--          <el-text>{{ form.clientName }}</el-text>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="客人款号" prop="clientStyleNo">-->
    <!--          &lt;!&ndash;          <el-input v-model.trim="form.supplierName" placeholder="请输入客人款号"/>&ndash;&gt;-->
    <!--          <el-text>{{ form.clientStyleNo }}</el-text>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="公司款号" prop="styleNo">-->
    <!--          &lt;!&ndash;          <el-input v-model.trim="form.styleNo" placeholder="请输入公司款号"/>&ndash;&gt;-->
    <!--          <el-text>{{ form.clientStyleNo }}</el-text>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="美元报价" prop="usdQuotation">-->
    <!--          <el-input-->
    <!--              v-model.number="form.usdQuotation"-->
    <!--              placeholder="请输入美元报价"-->
    <!--              size="small"-->
    <!--              type="number"-->
    <!--          />-->
    <!--        </el-form-item>-->
    <!--        &lt;!&ndash;        // 备注&ndash;&gt;-->
    <!--        <el-form-item label="备注" prop="remark">-->
    <!--          <el-input v-model.trim="form.remark" type="textarea" placeholder="请输入备注"/>-->
    <!--        </el-form-item>-->


    <!--      </el-form>-->
    <!--      <template #footer>-->
    <!--        <div class="dialog-footer">-->
    <!--          <el-button  v-btnPreventRepeat type="primary" @click="submitForm">确 定</el-button>-->
    <!--          <el-button  v-btnPreventRepeat @click="cancel">取 消</el-button>-->
    <!--        </div>-->
    <!--      </template>-->
    <!--    </el-dialog>-->
  </div>

</template>

<script setup name="Quotation">
import {
  getListPage,
  getDetailRequest,
  addRequest,
  updateRequest,
  delRequest,
  delBatchRequest, sendMailRequest,
} from '@/api/quotation.js'
import { parseTime } from '@/utils/ruoyi.js'
import { useRouter } from 'vue-router'


const { proxy } = getCurrentInstance()
const router = useRouter()
const typeList = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
let flag = ref(false)
onMounted(() => {
  if (document.getElementById('searchContainer')) {
    flag.value = true
  }
})
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
})

const { queryParams, form } = toRefs(data)

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

const rules = ref({
//   美元报价
  usdQuotation: [
    { required: true, message: '请输入美元报价', trigger: 'blur' },
    { min: 0, message: '美元报价必须大于等于0', trigger: 'blur' },
  ],
})

/** 取消按钮 */
function cancel () {
  open.value = false
  reset()
}

/** 表单重置 */
function reset () {
  form.value = {
    /**
     * 产品名称
     */
    name: '',
    /**
     * 客人款号
     */
    clientStyleNo: '',
    /**
     * 公司款号
     */
    styleNo: '',
    /**
     * 美元报价
     */
    usdQuotation: '',
    /**
     * 备注
     */
    remark: '',
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

/** 新增按钮操作 */
function handleAdd () {
  router.push({ path: '/quotationAddOrEdit' })
  // title.value = '添加报价'
  // visible.value = !visible.value
  // PopSelectionRef.value.open()
}

function openMore () {
  moreVisible.value = true
}

function closeMore () {
  moreVisible.value = false
}

/** 多选框选中数据 */
function handleSelectionChange (selection) {
  ids.value = selection.map(item => item.id)
  single.value = selection.length != 1
  multiple.value = !selection.length
  console.log('handleSelectionChange', ids)
}

/** 修改按钮操作 */
async function handleUpdate (row) {
  router.push({ path: '/quotationAddOrEdit', query: { id: row.id } })
  // 获取row.productList数组的id
  // visible.value = !visible.value
  // const res = await getDetailRequest(row.id)
  // PopSelectionRef.value.open(res.data)
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

// handleSendEmail
/** 发送邮件按钮操作 */
function handleSendEmail (row) {
  proxy.$modal.confirm('是否确认发送邮件？').then(function () {
    return sendMailRequest({ recordId: row.id })
  }).then(() => {
    proxy.$modal.msgSuccess('发送成功')
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport () {
  proxy.download('/system/quotation/batch/export', {
    ...queryParams.value,
  }, `报价管理_${new Date().getTime()}.xlsx`)
}

getList()
</script>

<style scoped>
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
  padding: 10px 0;
  background: var(--el-bg-color);
  border-top: 1px solid var(--el-border-color-light);
  z-index: 10;
}

.h5-filter-more {
  padding-bottom: 60px;
}
</style>
