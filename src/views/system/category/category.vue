<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
      <el-form-item label="分类名称" prop="categoryName">
        <el-input
            v-model="queryParams.categoryName"
            placeholder="请输入分类名称"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <!--      <el-form-item label="创建时间" style="width: 308px">-->
      <!--        <el-date-picker v-model="dateRange" value-format="YYYY-MM-DD" type="daterange" range-separator="-"-->
      <!--                        start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>-->
      <!--      </el-form-item>-->
      <el-form-item>
        <el-button v-btnPreventRepeat type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button v-btnPreventRepeat icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button v-btnPreventRepeat
                   type="primary"
                   plain
                   icon="Plus"
                   @click="handleAdd"
                   v-hasPermi="['system:sample:category:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button v-btnPreventRepeat
                   type="info"
                   plain
                   icon="Sort"
                   @click="toggleExpandAll"
        >展开/折叠
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
        v-if="refreshTable"
        v-loading="loading"
        :data="deptList"
        row-key="id"
        :default-expand-all="isExpandAll"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column prop="categoryName" label="分类名称" width="260"></el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="200">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button v-btnPreventRepeat link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['system:sample:category:edit']">修改
          </el-button>
          <el-button v-btnPreventRepeat link type="primary" icon="Plus" @click="handleAdd(scope.row)"
                     v-hasPermi="['system:sample:category:add']">新增
          </el-button>
          <el-button v-btnPreventRepeat v-if="scope.row.parentId != 0" link type="primary" icon="Delete"
                     @click="handleDelete(scope.row)" v-hasPermi="['system:sample:category:remove']">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改分类对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form ref="deptRef" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24" v-if="form.parentId !== 0">
            <el-form-item label="上级分类" prop="parentId">
              <el-tree-select
                  v-model="form.parentId"
                  :data="deptOptions"
                  :props="{ value: 'id', label: 'categoryName', children: 'children' }"
                  value-key="id"
                  placeholder="选择上级分类"
                  check-strictly
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="分类名称" prop="categoryName">
              <el-input v-model="form.categoryName" placeholder="请输入分类名称"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button v-btnPreventRepeat type="primary" @click="submitForm">确 定</el-button>
          <el-button v-btnPreventRepeat @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Category">
import { getListPageAll, getDetailRequest, delRequest, addRequest, updateRequest } from '@/api/category'
import { parseTime } from '@/utils/ruoyi.js'

const { proxy } = getCurrentInstance()

const deptList = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const title = ref('')
const deptOptions = ref([])
const isExpandAll = ref(true)
const refreshTable = ref(true)

const data = reactive({
  form: {},
  queryParams: {
    categoryName: undefined,
    status: undefined,
  },
  rules: {
    // parentId: [{ required: true, message: '上级分类不能为空', trigger: 'blur' }],
    categoryName: [{ required: true, message: '分类名称不能为空', trigger: 'blur' }],
  },
})

const { queryParams, form, rules } = toRefs(data)

/** 查询分类列表 */
function getList () {
  loading.value = true
  getListPageAll().then(response => {
    const tree = proxy.handleTree(response.data, 'id')
    deptList.value = tree
    loading.value = false
  })
  getListPageAll().then(response => {
    const tree = proxy.handleTree(response.data, 'id')
    const filtered = applyLocalFilter(tree, queryParams.value)
    deptList.value = filtered
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
    id: undefined,
    parentId: undefined,
    categoryName: undefined,
  }
  proxy.resetForm('deptRef')
}

function applyLocalFilter (tree, params) {
  const keyword = (params.categoryName || '').trim()
  const hasStatus = params.status !== undefined && params.status !== null && params.status !== ''
  const match = (node) => {
    let ok = true
    if (keyword) {
      ok = (node.categoryName || '').includes(keyword)
    }
    if (hasStatus) {
      ok = ok && node.status === params.status
    }
    return ok
  }
  const loop = (nodes) => {
    const res = []
    ;(nodes || []).forEach((node) => {
      const children = loop(node.children || [])
      const matched = match(node)
      if (matched || children.length) {
        const n = { ...node }
        n.children = children
        res.push(n)
      }
    })
    return res
  }
  return loop(tree || [])
}

/** 搜索按钮操作 */
function handleQuery () {
  getList()
}

/** 重置按钮操作 */
function resetQuery () {
  proxy.resetForm('queryRef')
  handleQuery()
}

/** 新增按钮操作 */
function handleAdd (row) {
  reset()
  getListPageAll().then(response => {
    deptOptions.value = proxy.handleTree(response.data, 'id')
  })
  if (row != undefined) {
    form.value.parentId = row.id
  }
  open.value = true
  title.value = '添加分类'
}

/** 展开/折叠操作 */
function toggleExpandAll () {
  refreshTable.value = false
  isExpandAll.value = !isExpandAll.value
  nextTick(() => {
    refreshTable.value = true
  })
}

/** 修改按钮操作 */
function handleUpdate (row) {
  reset()
  getListPageAll(row.id).then(response => {
    deptOptions.value = proxy.handleTree(response.data, 'id')
  })
  getDetailRequest(row.id).then(response => {
    form.value = response.data
    open.value = true
    title.value = '修改分类'
  })
}

/** 提交按钮 */
function submitForm () {
  proxy.$refs['deptRef'].validate(valid => {
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
  proxy.$modal.confirm('是否确认删除名称为"' + row.categoryName + '"的数据项?').then(function () {
    return delRequest(row.id)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess('删除成功')
  }).catch(() => {})
}

getList()
</script>
