<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="90px">
      <el-form-item label="供应商编码" prop="supplierCode">
        <el-input
            v-model.trim="queryParams.supplierCode"
            placeholder="请输入供应商编码"
            clearable
            style="width: 240px"
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="供应商名称" prop="supplierName">
        <el-input
            v-model.trim="queryParams.supplierName"
            placeholder="请输入客供应商名称"
            clearable
            style="width: 240px"
            @keyup.enter="handleQuery"
        />
      </el-form-item>

      <el-form-item label="创建时间" style="width: 308px">
        <el-date-picker
            v-model="addDateRangeMode"
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
      <el-table-column label="供应商编码" align="center" prop="supplierCode" :show-overflow-tooltip="true"/>
      <el-table-column label="供应商名称" align="center" prop="supplierName" :show-overflow-tooltip="true"/>
      <el-table-column label="联系人" align="center" prop="contact" :show-overflow-tooltip="true"/>
      <el-table-column label="电话" align="center" prop="telphone" :show-overflow-tooltip="true"/>
      <el-table-column label="传真" align="center" prop="fax" :show-overflow-tooltip="true"/>
      <el-table-column label="邮件" align="center" prop="email" :show-overflow-tooltip="true"/>
      <el-table-column label="微信号" align="center" prop="wxCode" :show-overflow-tooltip="true"/>
      <el-table-column label="创建时间" align="center" prop="createTime"  width="160">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="160" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['system:supplier:edit']">
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
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>

      <el-form ref="dictRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="供应商编码" prop="supplierCode">
          <el-input v-model.trim="form.supplierCode" placeholder="请输入供应商编码"/>
        </el-form-item>
        <el-form-item label="供应商名称" prop="supplierName">
          <el-input v-model.trim="form.supplierName" placeholder="请输入供应商名称"/>
        </el-form-item>
        <el-form-item label="联系人" prop="contact">
          <el-input v-model.trim="form.contact" placeholder="请输入联系人"/>
        </el-form-item>
        <el-form-item label="电话" prop="telphone">
          <el-input v-model.trim="form.telphone" placeholder="请输入电话"/>
        </el-form-item>
        <el-form-item label="传真" prop="fax">
          <el-input v-model.trim="form.fax" placeholder="请输入传真"/>
        </el-form-item>
        <el-form-item label="邮件" prop="email">
          <el-input v-model.trim="form.email" placeholder="请输入邮件"/>
        </el-form-item>
        <el-form-item label="微信号" prop="wxCode">
          <el-input v-model.trim="form.wxCode" placeholder="请输入邮件"/>
        </el-form-item>

      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Supplier">

import {
  getListPage,
  getDetailRequest,
  addRequest,
  updateRequest,
  delRequest,
  delBatchRequest,
} from '@/api/supplier.js'
import { parseTime } from '../../utils/ruoyi.js'

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
const addDateRangeMode = ref([])

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
  },
  rules: {
    supplierCode: [{ required: true, message: '请输入供应商编码', trigger: 'blur' }],
    supplierName: [{ required: true, message: '请输入供应商名称', trigger: 'blur' }],
    contact: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
    // 电话不能包含特殊字符
    telphone: [
      { required: true, message: '请输入电话', trigger: 'blur' },
      { pattern: /^[0-9-]+$/, message: '电话只能包含数字、-', trigger: 'blur' },
    ],
    email: [
      { required: true, message: '请输入邮件', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
    ],
  },
})

const { queryParams, form, rules } = toRefs(data)

/** 查询字典类型列表 */
function getList () {
  loading.value = true
  console.log('queryParams.value', queryParams.value)
  getListPage(proxy.addDateRange(queryParams.value, addDateRangeMode.value)).then(response => {
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
    /**
     * 供应商编码
     */
    supplierCode: '',
    /**
     * 供应商名称
     */
    supplierName: '',
    /**
     * 联系人
     */
    contact: '',
    /**
     * 邮件
     */
    email: '',
    /**
     * 传真
     */
    fax: '',
    /**
     * 电话
     */
    telphone: '',
    /**
     * 微信号
     */
    wxCode: '',
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
  addDateRangeMode.value = []
  proxy.resetForm('queryRef')
  handleQuery()
}

/** 新增按钮操作 */
function handleAdd () {
  reset()
  open.value = true
  title.value = '添加供应商'
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
  proxy.download('/system/supplier/export', {
    ...queryParams.value,
  }, `供应商管理_${new Date().getTime()}.xlsx`)
}

getList()
</script>
