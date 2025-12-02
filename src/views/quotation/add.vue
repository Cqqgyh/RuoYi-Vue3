<template>
  <div class="app-container mobile-container">
    <el-card class="mobile-card" shadow="never">
      <el-form
          ref="topFormRef"
          :model="form"
          :label-width="'0'"
          label-position="top"
          size="large"
          class="mobile-form"
          scroll-to-error
          :scroll-into-view-options="{ block: 'center', behavior: 'smooth' }"
      >
        <el-row :gutter="20">
          <el-col :span="8" :xs="24" :sm="12" :md="8">
            <!--            动态rules，当tableData长度大于时，报价单号必填-->
            <el-form-item label="报价单号" prop="quotationNo" :required="true"
                          :rules="[{ required: true, message: '请输入报价单号', trigger: 'blur' }]">
              <el-input v-model.trim="form.quotationNo" placeholder="请输入报价单号" maxlength="255"/>
            </el-form-item>

          </el-col>
          <el-col :span="8" :xs="24" :sm="12" :md="8">
            <el-form-item label="客户" prop="clientId" :required="true"
                          :rules="[{ required: true, message: '请输入客户', trigger: 'blur' }]">
              <el-select v-model="form.clientId" placeholder="请选择客户" filterable clearable>
                <el-option v-for="item in clientList" :key="item.id" :label="item.clientName"
                           :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" :xs="24" :sm="12" :md="8">
            <el-form-item label="报价日期" prop="quotationDate" :required="true"
                          :rules="[{ required: true, message: '请选择报价日期', trigger: 'blur' }]">
              <!--              默认是当日-->
              <el-date-picker
                  v-model="form.quotationDate"
                  type="date"
                  value-format="YYYY-MM-DD"
                  placeholder="请选择报价日期"
                  style="width: 100%;"
              />

            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="table-panel" :class="{ mobile: isMobile }">
        <div class="action-buttons" style="margin-bottom: 10px;">
          <el-button v-btnPreventRepeat type="primary" size="small" @click="selectorVisible = true">选择产品</el-button>
        </div>

        <el-form ref="formRef" :model="tableData">
          <el-table :data="tableData" style="width: 100%" :height="485">
            <el-table-column prop="name" label="产品名称" width="150" :show-overflow-tooltip="true"/>
            <el-table-column prop="clientStyleNo" label="客人款号" width="150" :show-overflow-tooltip="true"/>
            <el-table-column prop="styleNo" label="公司款号" width="150" :show-overflow-tooltip="true"/>
            <el-table-column prop="usdQuotation" label="美元报价*" align="center" width="170">
              <template #default="scope">
                <el-form-item
                    :prop="`${scope.$index}.usdQuotation`"
                    style="margin-bottom: 0;"
                    width="150"
                    :rules="[
  { required: true, message: '请输入美元报价', trigger: 'blur' },
]"
                >
                  <el-input-number
                      v-model.number="scope.row.usdQuotation"
                      placeholder="请输入美元报价"
                      size="small"
                      :precision="2"
                      :max="9999999999999999"
                      style="width: 100%;"
                  />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" width="150">
              <template #default="scope">
                <el-form-item
                    :prop="`${scope.$index}.remark`"
                    style="margin-bottom: 0;"
                    width="150"
                >
                  <el-input
                      v-model="scope.row.remark"
                      placeholder="请输入备注"
                      size="small"
                      type="textarea"
                  />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80">
              <template #default="scope">
                <el-button v-btnPreventRepeat size="small" type="danger" @click="deleteRow(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </div>

      <el-dialog v-model="selectorVisible" title="选择产品" :width="isMobile ? '100%' : '1000px'" :fullscreen="isMobile"
                 :top="isMobile ? '0' : '15vh'" append-to-body :class="{ 'mobile-dialog': isMobile }">
        <div class="selector-panel">
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
<!--                    <el-button v-btnPreventRepeat type="primary" icon="Search" size="small" @click="handleQuery"></el-button>-->
                    <el-button v-btnPreventRepeat icon="Refresh" size="small" @click="resetQuery"></el-button>
                    <el-button v-btnPreventRepeat link icon="MoreFilled" size="small" @click="openMore"></el-button>
                  </div>
                </div>
              </el-form-item>
            </el-form>
          </div>

          <el-drawer v-model="moreVisible" title="更多筛选" direction="rtl" size="80%">
            <el-form :model="queryParams" ref="queryMoreRef" :inline="false" label-position="top" class="h5-filter-more">
              <el-form-item label="产品名称" prop="name">
                <el-input v-model.trim="queryParams.name" placeholder="请输入产品名称" clearable @keyup.enter="handleQuery"/>
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
              </el-form-item>
              <el-form-item label="公司款号" prop="styleNo">
                <el-input v-model.trim="queryParams.styleNo" placeholder="请输入公司款号" clearable @keyup.enter="handleQuery"/>
              </el-form-item>
              <el-form-item label="客人款号" prop="clientStyleNo">
                <el-input v-model.trim="queryParams.clientStyleNo" placeholder="请输入客人款号" clearable @keyup.enter="handleQuery"/>
              </el-form-item>
              <el-form-item label="客户名称" prop="clientName">
                <el-input v-model.trim="queryParams.clientName" placeholder="请输入客户名称" clearable @keyup.enter="handleQuery"/>
              </el-form-item>
              <el-form-item label="工厂名称" prop="factoryName">
                <el-input v-model.trim="queryParams.factoryName" placeholder="请输入工厂名称" clearable @keyup.enter="handleQuery"/>
              </el-form-item>
            </el-form>
            <div class="h5-drawer-actions">
              <el-button v-btnPreventRepeat type="primary" icon="Search" @click="handleQuery">搜索</el-button>
              <el-button v-btnPreventRepeat icon="Refresh" @click="resetQuery">重置</el-button>
            </div>
          </el-drawer>

          <div class="action-buttons">
            <el-button v-btnPreventRepeat size="small" @click="clearSelection">清空选择</el-button>
            <el-button v-btnPreventRepeat size="small" @click="selectAllFiltered">全选</el-button>
            <el-button v-btnPreventRepeat size="small" @click="reverseSelection">反选</el-button>
          </div>

          <div class="vt-wrapper"
               style="flex:1; min-height: 320px; border: 1px solid #e4e7ed; border-radius: 4px; overflow: hidden;">
            <el-table
                ref="selectorTableRef"
                :data="listData"
                style="width: 100%"
                :height="isMobile ? '60vh' : 400"
                border
                row-key="id"
                :reserve-selection="true"
                @selection-change="onSelectionChange"
            >
              <el-table-column type="selection" width="55" fixed="left"/>
              <el-table-column label="产品名称" prop="name" :show-overflow-tooltip="true" width="180px"/>
              <el-table-column label="样品类别" prop="sampleCategoryName" :show-overflow-tooltip="true"/>
              <el-table-column label="客人款号" prop="clientStyleNo" :show-overflow-tooltip="true"
                               width="180px"/>
              <el-table-column label="公司款号" prop="styleNo" :show-overflow-tooltip="true" width="180px"/>
              <el-table-column label="客户名称" prop="clientName" :show-overflow-tooltip="true" width="180px"/>
              <el-table-column label="工厂名称" prop="factoryName" :show-overflow-tooltip="true" width="180px"/>
              <el-table-column label="入库时间" prop="storageTime" :show-overflow-tooltip="true" width="180px"/>
              <el-table-column label="工厂报价" prop="factoryQuotation" :show-overflow-tooltip="true"/>
              <el-table-column label="美元报价" prop="usdQuotation" :show-overflow-tooltip="true"/>
              <el-table-column label="尺码" prop="size" :show-overflow-tooltip="true"/>
              <el-table-column label="面料种类" prop="fabricCategoryName" :show-overflow-tooltip="true"
                               width="180px"/>
              <el-table-column label="面料成分" prop="fabricComposition" :show-overflow-tooltip="true"
                               width="180px"/>
              <el-table-column label="面料克重" prop="fabricWeight" :show-overflow-tooltip="true" width="180px"/>
              <el-table-column label="面料价格" prop="fabricPrice" :show-overflow-tooltip="true" width="180px"/>
              <el-table-column label="面料供应商" prop="fabricSupplierName" :show-overflow-tooltip="true"
                               width="180px"/>
              <el-table-column label="里布种类" prop="liningCategory" :show-overflow-tooltip="true"
                               width="180px"/>
              <el-table-column label="里布成分" prop="liningIngredient" :show-overflow-tooltip="true"
                               width="180px"/>
              <el-table-column label="里布克重" prop="liningWeightPer" :show-overflow-tooltip="true"
                               width="180px"/>
              <el-table-column label="里布价格" prop="liningPrice" :show-overflow-tooltip="true" width="180px"/>
              <el-table-column label="里布供应商" prop="liningSupplierName" :show-overflow-tooltip="true"
                               width="180px"/>
              <el-table-column label="备注" prop="remark" :show-overflow-tooltip="true" width="180px"/>
              <el-table-column label="创建时间" prop="createTime" width="160">
                <template #default="scope">
                  <span>{{ parseTime(scope.row.createTime) }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <div class="search-stats">
            共 {{ allOptions.length }} 条数据，
            按当前搜索共找到 {{ listData.length }} 条数据，
            已选择 {{ selectedCount }} 条
          </div>
        </div>
        <template #footer>
          <el-button v-btnPreventRepeat @click="selectorVisible = false">完成</el-button>
        </template>
      </el-dialog>
    </el-card>
    <van-action-bar class="mobile-actions">
      <el-button v-btnPreventRepeat style="width: 100px;" round size="large" @click="close">返 回</el-button>
      <el-button v-btnPreventRepeat round type="primary" size="large" @click="submitForm">确 定</el-button>
    </van-action-bar>
  </div>

</template>
<script lang="ts" setup name="SelectDialog">
import {ref, computed, watch, nextTick, h, getCurrentInstance, onMounted, onBeforeUnmount, reactive, toRefs} from "vue";
import {ElMessage} from "element-plus";
import {ActionBar as VanActionBar} from 'vant'
import useSettingsStore from '@/store/modules/settings.js'
import {parseTime} from '../../utils/ruoyi.js'
import dayjs from 'dayjs'
import {
  getListPageAll
} from '@/api/product.js'
import {
  addRequest, updateRequest, getDetailRequest
} from '@/api/quotation.js'
import {
  getListPageAll as getClientListAll
} from '@/api/client.js'
import {useRoute, useRouter} from "vue-router";
import { getListPageAll as getSampleCategoryListAll } from '@/api/category.js'

const {proxy} = getCurrentInstance()
const route = useRoute()
const router = useRouter()
//#region <弹窗相关>

// 开启弹窗
const open = async (id) => {
  reset()
  await getList()
  if (!id) {
    return
  }
  const res = await getDetailRequest(id)
  const row = res.data
  if (row) {
    // 同步form.value 与 列表属性 的属性
    Object.keys(form.value).forEach(key => {
      form.value[key] = row?.[key] || ''
    })
    // 找到allOptions 中 与productList 中id 相同的所有项目，将与productList的所有属性合并
    row?.productList?.map(item => {
      item.quotationId = item.id
      item.id = item.productId
      allOptions.value.find(opt => {
        if (opt.id === item.id) {
          opt = Object.assign(opt, item)
          tableData.value.push(opt)
          return true
        }
      })
    })
  }

};
// 开启弹窗时，获取原始数据
const handleResize = () => {
  isMobile.value = window.innerWidth <= 768
}
onMounted(() => {
  open(route.query.id)
  handleResize()
  window.addEventListener('resize', handleResize)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
// 关闭弹窗
const close = () => {
  router.back()
};

//#endregion
//#region <form相关>
// 报价日期quotationDate	报价单号quotationNo
const topFormRef = ref()
const form = ref({
  // 默认是当日
  // 默认是当日 value-format="YYYY-MM-DD"
  id: '',
  quotationDate: dayjs().format('YYYY-MM-DD'),
  quotationNo: '',
  clientId: '',
})

/** 表单重置 */
function reset() {
  proxy?.resetForm('topFormRef')
  form.value = {
    id: '',
    quotationDate: dayjs().format('YYYY-MM-DD'),
    quotationNo: '',
    clientId: '',
  }
  // 清空表格数据
  tableData.value = []
  selectorVisible.value = false
}

const clientList = ref([])

/** 获取客户列表 */
async function getClientList() {
  const res = await getClientListAll()
  clientList.value = res.data
}

getClientList()
//#endregion
// 原始数据
const allOptions = ref([]);

// 获取原始数据
/** 查询字典类型列表 */
async function getList() {
  const res = await getListPageAll()
  allOptions.value = res?.rows || res?.data || []
}

const showSearch = ref(true)
const moreVisible = ref(false)
const queryRef = ref()
const queryMoreRef = ref()
const dateRange = ref<string[]>([])
const sampleCategoryList = ref<any[]>([])
const data = reactive({
  queryParams: {
    name: '',
    sampleCategoryId: '',
    styleNo: '',
    clientStyleNo: '',
    clientName: '',
    factoryName: '',
  },
})
const { queryParams } = toRefs(data)

const getSampleCategoryList = async () => {
  await getSampleCategoryListAll().then(response => {
    sampleCategoryList.value = proxy.handleTree(response.data, 'id')
  })
}
getSampleCategoryList()

function openMore() {
  moreVisible.value = true
}

function closeMore() {
  moreVisible.value = false
}

function handleQuery() {
  closeMore()
}

function resetQuery() {
  dateRange.value = []
  proxy.resetForm('queryRef')
  proxy.resetForm('queryMoreRef')
  handleQuery()
}

// 右侧表格的数据
const tableData = ref([]);

// 选择表格引用与联动逻辑（改为常规表格）
const selectorTableRef = ref()
const onSelectionChange = (selectedRows) => {
  const selectedSet = new Set(selectedRows.map(r => r.id))
  listData.value.forEach(row => {
    const idx = tableData.value.findIndex(item => item.id === row.id)
    if (selectedSet.has(row.id)) {
      if (idx === -1) tableData.value.push(row)
    } else {
      if (idx !== -1) tableData.value.splice(idx, 1)
    }
  })
}

// 表单引用
const formRef = ref();
const selectorVisible = ref(false);
const isMobile = ref(false);

// 将数据转换为单层列表结构
const listData = computed(() => {
  let result = allOptions.value
  const qp = queryParams.value

  if (qp.name) {
    const kw = qp.name.toLowerCase()
    result = result.filter(item => (item.name || '').toLowerCase().includes(kw))
  }
  if (qp.sampleCategoryId) {
    result = result.filter(item => String(item.sampleCategoryId || '') === String(qp.sampleCategoryId))
  }
  if (qp.styleNo) {
    const kw = qp.styleNo.toLowerCase()
    result = result.filter(item => (item.styleNo || '').toLowerCase().includes(kw))
  }
  if (qp.clientStyleNo) {
    const kw = qp.clientStyleNo.toLowerCase()
    result = result.filter(item => (item.clientStyleNo || '').toLowerCase().includes(kw))
  }
  if (qp.clientName) {
    const kw = qp.clientName.toLowerCase()
    result = result.filter(item => (item.clientName || '').toLowerCase().includes(kw))
  }
  if (qp.factoryName) {
    const kw = qp.factoryName.toLowerCase()
    result = result.filter(item => (item.factoryName || '').toLowerCase().includes(kw))
  }
  const [start, end] = dateRange.value || []
  if (start || end) {
    const s = start ? dayjs(start, 'YYYY-MM-DD').startOf('day') : null
    const e = end ? dayjs(end, 'YYYY-MM-DD').endOf('day') : null
    result = result.filter(item => {
      const ct = dayjs(item.createTime)
      if (s && !ct.isAfter(s) && !ct.isSame(s)) return false
      if (e && !ct.isBefore(e) && !ct.isSame(e)) return false
      return true
    })
  }
  return result
});

// 获取已添加到右侧表格的ID列表
const addedIds = computed(() => {
  return tableData.value.map(item => item.id);
});

// 检查是否已添加到右侧表格
const isAddedToTable = (id) => {
  return addedIds.value.includes(id);
};


// 选择变化：改为常规表格由 selection-change 管理
const handleCheckChange = () => {
}

// 保持选择计数实时更新（无需与树同步）
watch(tableData, () => {
}, {deep: true})

watch(selectorVisible, (v) => {
  if (v) {
    nextTick(() => syncSelectionWithTableData())
  }
})
watch(listData, () => {
  nextTick(() => syncSelectionWithTableData())
})

function syncSelectionWithTableData() {
  if (!selectorTableRef.value) return
  listData.value.forEach(row => {
    selectorTableRef.value.toggleRowSelection(row, isAddedToTable(row.id))
  })
}

// 删除行
const deleteRow = (row) => {
  // ElMessageBox.confirm(
  //     `确定要删除 ${row.name} 吗？`,
  //     "提示",
  //     {
  //       confirmButtonText: "确定",
  //       cancelButtonText: "取消",
  //       type: "warning",
  //     },
  // ).then(() => {
  //   const index = tableData.value.findIndex(item => item.id === row.id);
  //   if (index !== -1) {
  //     tableData.value.splice(index, 1);
  //     ElMessage.success("删除成功");
  //   }
  // }).catch(() => {
  //   ElMessage.info("已取消删除");
  // });
  const index = tableData.value.findIndex(item => item.id === row.id);
  if (index !== -1) {
    tableData.value.splice(index, 1);
  }
};


// 清空选择
const clearSelection = () => {
  selectorTableRef.value?.clearSelection()
  tableData.value = []
};

// 全选当前搜索结果
const selectAllFiltered = () => {
  listData.value.forEach(row => {
    selectorTableRef.value?.toggleRowSelection(row, true)
  })
};

// 反向选择
const reverseSelection = () => {
  listData.value.forEach(row => {
    const selected = isAddedToTable(row.id)
    selectorTableRef.value?.toggleRowSelection(row, !selected)
  })
};

// 自定义节点内容（已改为虚拟表格，不再使用树）
const emit = defineEmits(["refresh"]);
// 提交表单数据
const submitForm = async () => {
  if (tableData.value.length === 0) {
    ElMessage.warning("请先添加数据");
    return;
  }

  try {
    // 使用表单验证
    await topFormRef.value.validate();
    await formRef.value.validate();
    //

    // 收集表单数据
    // 报价日期quotationDate	客户clientId  美元报价usdQuotation 备注remark
    console.log(tableData.value)
    const formData = {
      ...form.value,
      productReqs: tableData.value.map(item => ({
        productId: item.id,
        id: item.quotationId,
        clientStyleNo: item.clientStyleNo,
        styleNo: item.styleNo,
        usdQuotation: item.usdQuotation,
        remark: item.remark,
      }))
    }

    console.log("提交的表单数据：", formData);
    // id存在则更新，不存在则新增
    if (formData.id) {
      await updateRequest(formData);
    } else {
      await addRequest(formData);
    }
    // 刷新父组件数据
    emit("refresh");
    ElMessage.success(`操作提交`);
    // 关闭弹窗
    close();

    // 这里可以调用API提交数据
    // await submitData(formData)
  } catch (error) {
    // 表单验证失败，不显示弹窗，让用户看到具体的验证错误信息
    console.log("表单验证失败:", error);
  }
};

// 获取已选择的数量
const selectedCount = computed(() => {
  return addedIds.value.filter(id =>
      allOptions.value.some(item => item.id === id),
  ).length;
});
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
  margin: 0 auto;
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

.dashboard-container {
  height: 100%;
  padding: 20px;
}

.dashboard-container.mobile {
  padding: 12px;
}

.selector-panel {
  padding: 20px 0;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  .search-input {
    margin-bottom: 15px;
  }

  .action-buttons {
    display: flex;
    //gap: 8px;
    margin-bottom: 15px;

    .el-button {
      flex: 1;
    }
  }

  .tree-container {
    flex: 1;
    margin-bottom: 15px;
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    overflow: hidden;
  }

  .data-tree {
    // 树形组件样式
    :deep(.el-tree-node__content) {
      height: auto;
      padding: 4px 0;
    }
  }

  .employee-node {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 2px 0;
    font-size: 12px;

    .employee-name {
      font-weight: 500;
      color: #303133;
      min-width: 60px;
    }

    .employee-info {
      color: #606266;
      margin-left: 8px;
      font-size: 11px;
    }

    .employee-dept {
      color: #409eff;
      margin-left: 8px;
      font-size: 11px;
      background-color: #ecf5ff;
      padding: 1px 4px;
      border-radius: 2px;
    }
  }

  .search-stats {
    font-size: 12px;
    color: #666;
    margin-bottom: 10px;
    text-align: center;
  }
}

.h5-filter-bar {
  padding: 10px 12px;
  background: var(--el-fill-color-light);
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  margin-bottom: 12px;
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

.table-panel {
  padding: 0;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  &.mobile {
    padding: 0;
  }

  .panel-title {
    margin-bottom: 20px;
    color: #333;
    font-size: 18px;
    font-weight: bold;
  }

  // 表格编辑状态样式
  :deep(.el-table) {
    .el-input {
      width: 100%;
    }

    .el-select {
      width: 100%;
    }

    // 所有行都显示为编辑状态
    .el-table__row {
      background-color: #f0f9ff;

      .cell {
        height: 50px;
        //  居中
        display: flex;
        align-items: center;
      }
    }

    // 邮箱列的表单项样式
    .el-form-item {
      margin-bottom: 0;

      .el-form-item__error {
        position: absolute;
        top: 100%;
        left: 0;
        font-size: 10px;
        line-height: 1;
        padding-top: 2px;
      }
    }
  }

}

.ml8 {
  margin-left: 8px;
}

@media (max-width: 768px) {
  .selector-panel {
    padding: 12px 0;

    .action-buttons {
      flex-wrap: wrap;

      .el-button {
        flex: 1 1 30%;
      }
    }
  }
  :deep(.el-dialog.mobile-dialog) {
    display: flex;
    flex-direction: column;
  }
  :deep(.el-dialog.mobile-dialog .el-dialog__body) {
    flex: 1;
    overflow: auto;
    padding: 0;
  }
  :deep(.el-dialog.mobile-dialog .el-dialog__footer) {
    position: sticky;
    bottom: 0;
    background: #fff;
    padding: 12px;
    border-top: 1px solid #ebeef5;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }

  .mobile-dialog .vt-wrapper {
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }
}
</style>
const settingsStore = useSettingsStore()
const pageTitle = computed(() => route.query?.id ? '修改报价' : '添加报价')
settingsStore.title = pageTitle.value
