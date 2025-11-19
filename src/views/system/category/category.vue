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
                   size="small"
                   v-hasPermi="['system:sample:category:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button v-btnPreventRepeat
                   type="info"
                   plain
                   size="small"
                   icon="Sort"
                   @click="toggleExpandAll"
        >展开/折叠
        </el-button>
      </el-col>
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
      <el-table-column label="操作" align="center" width="230">
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

  </div>
</template>

<script setup name="Category">
import { getListPageAll, delRequest, addRequest, updateRequest } from '@/api/category'
import { parseTime } from '@/utils/ruoyi.js'
import { useRouter } from 'vue-router'

const { proxy } = getCurrentInstance()
const router = useRouter()
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
    parentId: [{ required: true, message: '上级分类不能为空', trigger: 'blur' }],
    categoryName: [{ required: true, message: '分类名称不能为空', trigger: 'blur' }],
    orderNum: [{ required: true, message: '显示排序不能为空', trigger: 'blur' }],
    email: [{ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }],
    phone: [{ pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: '请输入正确的手机号码', trigger: 'blur' }],
  },
})

const { queryParams, form, rules } = toRefs(data)

/** 查询分类列表 */
function getList () {
  loading.value = true
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
  router.push({ path: '/categoryAddOrEdit', query: { parentId: row.id }  })
  // reset()
  // getListPageAll().then(response => {
  //   deptOptions.value = proxy.handleTree(response.data, 'id')
  // })
  // if (row != undefined) {
  //   form.value.parentId = row.id
  // }
  // open.value = true
  // title.value = '添加分类'
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
  router.push({ path: '/categoryAddOrEdit', query: { id: row.id } })
  // reset()
  // getListPageAll(row.id).then(response => {
  //   deptOptions.value = proxy.handleTree(response.data, 'id')
  // })
  // getDetailRequest(row.id).then(response => {
  //   form.value = response.data
  //   open.value = true
  //   title.value = '修改分类'
  // })
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
