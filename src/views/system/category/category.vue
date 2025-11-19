<template>
  <div class="app-container">
    <Teleport v-if="flag" to="#searchContainer">
      <div class="h5-filter-bar" v-show="showSearch">
        <el-form :model="queryParams" ref="queryRef" :inline="false" label-position="top" class="h5-filter-inline">
          <el-form-item label="" prop="categoryName" style="margin-bottom: 0;">
            <div class="h5-filter-primary">
              <el-input
                  v-model.trim="queryParams.categoryName"
                  placeholder="请输入分类名称"
                  clearable
                  class="h5-input"
                  @keyup.enter="handleQuery"
              />
              <div class="h5-actions">
                <el-button v-btnPreventRepeat type="primary" icon="Search" size="small" @click="handleQuery"></el-button>
                <el-button v-btnPreventRepeat icon="Refresh" size="small" @click="resetQuery"></el-button>
<!--                <el-button v-btnPreventRepeat link icon="MoreFilled" size="small" @click="openMore"></el-button>-->
              </div>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </Teleport>

    <el-drawer v-model="moreVisible" title="更多筛选" direction="rtl" size="80%">
      <el-form :model="queryParams" ref="queryMoreRef" :inline="false" label-position="top" class="h5-filter-more">
        <el-form-item label="分类名称" prop="categoryName">
          <el-input v-model.trim="queryParams.categoryName" placeholder="请输入分类名称" clearable @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
            <el-option label="正常" value="0" />
            <el-option label="停用" value="1" />
          </el-select>
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
      <!--      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>-->
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
import { getListPageAll, getDetailRequest, delRequest, addRequest, updateRequest } from '@/api/category'
import { parseTime } from '@/utils/ruoyi.js'
import { useRouter } from 'vue-router'

const { proxy } = getCurrentInstance()
const router=useRouter()
let flag = ref(false)
onMounted(() => {
  if (document.getElementById('searchContainer')) {
    flag.value = true
  }
})

const deptList = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const moreVisible = ref(false)
const title = ref('')
const deptOptions = ref([])
const isExpandAll = ref(true)
const refreshTable = ref(true)

const data = reactive({
  form: {},
  queryParams: {
    categoryName: undefined,
  },
  rules: {
    parentId: [{ required: true, message: '上级分类不能为空', trigger: 'blur' }],
    categoryName: [{ required: true, message: '分类名称不能为空', trigger: 'blur' }],
  },
})

const { queryParams, form, rules } = toRefs(data)

/** 查询分类列表 */
function getList () {
  loading.value = true
  getListPageAll().then(response => {
    const  tree = proxy.handleTree(response.data, 'id')
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
  closeMore()
}

/** 重置按钮操作 */
function resetQuery () {
  proxy.resetForm('queryRef')
  proxy.resetForm('queryMoreRef')
  handleQuery()
}

/** 新增按钮操作 */
function handleAdd (row) {
  router.push({ path: '/categoryAddOrEdit', query: { parentId: row.id > 0 ? row.id : '' } })
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

function openMore () {
  moreVisible.value = true
}

function closeMore () {
  moreVisible.value = false
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
