<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="90px">
      <el-form-item label="报价单号" prop="quotationNo">
        <el-input
            v-model.trim="queryParams.quotationNo"
            placeholder="请输入报价单号"
            clearable
            style="width: 240px"
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="产品名称" prop="productName">
        <el-input
            v-model.trim="queryParams.productName"
            placeholder="请输入产品名称"
            clearable
            style="width: 240px"
            @keyup.enter="handleQuery"
        />
      </el-form-item>


      <el-form-item label="创建时间" style="width: 308px">
        <el-date-picker
            v-model="dateRange"
            value-format="YYYY-MM-DD"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="Plus"
            @click="handleAdd"
            v-hasPermi="['system:supplier:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="()=>handleDelete()"
            v-hasPermi="['system:supplier:remove']"
        >批量删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['system:supplier:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="typeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="报价单号" align="center" prop="quotationNo" :show-overflow-tooltip="true"/>
      <el-table-column label="产品名称" align="center" prop="name" :show-overflow-tooltip="true"/>
      <el-table-column label="报价日期" align="center" prop="quotationDate" :show-overflow-tooltip="true"/>
      <el-table-column label="客人款号" align="center" prop="clientStyleNo" :show-overflow-tooltip="true"/>
      <el-table-column label="公司款号" align="center" prop="styleNo" :show-overflow-tooltip="true"/>/>
      <el-table-column label="美元报价" align="center" prop="usdQuotation" :show-overflow-tooltip="true"/>
      <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:supplier:edit']">
            修改
          </el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                     v-hasPermi="['system:supplier:remove']">删除
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

    <!-- 添加或修改参数配置对话框 -->
    <PopSelection
        @refresh="getList"
        ref="PopSelectionRef"
        :title="title"
        width="1200px"
        append-to-body
    />
  </div>

</template>

<script setup name="Quotation">
import PopSelection from './popSelection.vue'
import {
  getListPage,
  getDetailRequest,
  addRequest,
  updateRequest,
  delRequest,
  delBatchRequest,
} from '@/api/quotation.js'

const { proxy } = getCurrentInstance()

const typeList = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
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
//#region <弹窗相关>
const visible = ref(false)
const PopSelectionRef = ref()
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



/** 搜索按钮操作 */
function handleQuery () {
  queryParams.value.pageNum = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery () {
  dateRange.value = []
  handleQuery()
}

/** 新增按钮操作 */
function handleAdd () {
  title.value = '添加报价'
  visible.value = !visible.value
  PopSelectionRef.value.open()
}

/** 多选框选中数据 */
function handleSelectionChange (selection) {
  ids.value = selection.map(item => item.id)
  single.value = selection.length != 1
  multiple.value = !selection.length
  console.log('handleSelectionChange',ids)
}

/** 修改按钮操作 */
function handleUpdate (row) {
  reset()
  const id = row.id || ids.value
  getDetailRequest(id).then(response => {
    form.value = response.data
    open.value = true
    title.value = '修改字典类型'
  })
}

/** 提交按钮 */
function submitForm () {
  proxy.$refs['dictRef'].validate(valid => {
    if (valid) {
      if (form.value.id != undefined) {
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
  proxy.download('/system/quotation/batch/export', {
    ...queryParams.value,
  }, `报价管理_${new Date().getTime()}.xlsx`)
}

getList()
</script>
