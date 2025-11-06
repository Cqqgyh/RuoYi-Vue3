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
            v-hasPermi="['system:batch:record:add']"
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
            v-hasPermi="['system:batch:record:remove']"
        >批量删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['system:batch:record:export']"
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
      <el-table-column label="公司款号" align="center" prop="styleNo" :show-overflow-tooltip="true"/>
      />
      <el-table-column label="美元报价" align="center" prop="usdQuotation" :show-overflow-tooltip="true"/>
      <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['system:batch:record:edit']">
            修改
          </el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
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
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>

      <el-form ref="dictRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="产品名称" prop="name">
<!--          <el-input v-model.trim="form.name" placeholder="请输入产品名称"/>-->
          <el-text>{{form.name}}</el-text>
        </el-form-item>
        <el-form-item label="客人款号" prop="clientStyleNo">
<!--          <el-input v-model.trim="form.supplierName" placeholder="请输入客人款号"/>-->
          <el-text>{{form.clientStyleNo}}</el-text>
        </el-form-item>
        <el-form-item label="公司款号" prop="styleNo">
<!--          <el-input v-model.trim="form.styleNo" placeholder="请输入公司款号"/>-->
          <el-text>{{form.clientStyleNo}}</el-text>
        </el-form-item>
        <el-form-item label="美元报价" prop="usdQuotation">
          <el-input
              v-model.number="form.usdQuotation"
              placeholder="请输入美元报价"
              size="small"
              type="number"
          />
        </el-form-item>
<!--        // 备注-->
        <el-form-item label="备注" prop="remark">
          <el-input v-model.trim="form.remark" type="textarea" placeholder="请输入备注"/>
        </el-form-item>



      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
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
  console.log('handleSelectionChange', ids)
}

/** 修改按钮操作 */
function handleUpdate (row) {
  reset()
  const id = row.id || ids.value
  getDetailRequest(id).then(response => {
    form.value = response.data
    open.value = true
    title.value = '修改报价'
  })
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
  proxy.download('/system/quotation/batch/export', {
    ...queryParams.value,
  }, `报价管理_${new Date().getTime()}.xlsx`)
}

getList()
</script>
