<template>
  <el-dialog
      v-model="visible"
      destroy-on-close
  >
    <div class="dashboard-container">
      <el-form ref="topFormRef" :model="form" label-width="90px">
        <el-row :gutter="20">
          <el-col :span="8">
<!--            动态rules，当tableData长度大于时，报价单号必填-->
            <el-form-item label="报价单号" prop="quotationNo" :required="true" :rules="[{ required: true, message: '请输入报价单号', trigger: 'blur' }]">
              <el-input v-model.trim="form.quotationNo" placeholder="请输入报价单号"/>
            </el-form-item>

          </el-col>
          <el-col :span="8">
            <el-form-item label="客户" prop="clientId" :required="true" :rules="[{ required: true, message: '请输入客户', trigger: 'blur' }]">
              <el-select v-model="form.clientId" placeholder="请选择客户" filterable clearable>
                <el-option v-for="item in clientList" :key="item.id" :label="item.clientName"
                           :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="报价日期" prop="quotationDate" :required="true" :rules="[{ required: true, message: '请选择报价日期', trigger: 'blur' }]">
              <!--              默认是当日-->
              <el-date-picker
                  v-model="form.quotationDate"
                  type="date"
                  value-format="YYYY-MM-DD"
                  placeholder="请选择报价日期"
              />

            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="table-panel">
        <div class="action-buttons" style="margin-bottom: 10px;">
          <el-button v-btnPreventRepeat type="primary"  @click=" selectorVisible = true">选择产品</el-button>
        </div>

        <el-form ref="formRef" :model="tableData">
          <el-table :data="tableData" style="width: 100%" height="485px">
            <el-table-column prop="name" label="产品名称" :show-overflow-tooltip="true"/>
            <el-table-column prop="clientStyleNo" label="客人款号" :show-overflow-tooltip="true"/>
            <el-table-column prop="styleNo" label="公司款号" :show-overflow-tooltip="true"/>
            <el-table-column prop="usdQuotation" label="美元报价*">
              <template #default="scope">
                <el-form-item
                    :prop="`${scope.$index}.usdQuotation`"
                    style="margin-bottom: 0;"
                    :rules="[
  { required: true, message: '请输入美元报价', trigger: 'blur' },
]"
                >
                  <el-input
                      v-model.number="scope.row.usdQuotation"
                      placeholder="请输入美元报价"
                      size="small"
                      type="number"
                  />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注">
              <template #default="scope">
                <el-form-item
                    :prop="`${scope.$index}.remark`"
                    style="margin-bottom: 0;"
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

      <el-dialog v-model="selectorVisible" title="选择产品" width="1100px" append-to-body>
        <div class="selector-panel">
          <el-form :model="queryParams" :inline="true" label-width="68px" class="search-input">
            <el-form-item label="产品名称" prop="name">
              <el-input
                  v-model.trim="queryParams.name"
                  placeholder="请输入产品名称"
                  clearable
                  style="width: 240px"
              />
            </el-form-item>
            <el-form-item label="样品类别" prop="sampleCategoryId">
              <el-tree-select
                  style="width: 240px"
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
              <el-input
                  v-model.trim="queryParams.styleNo"
                  placeholder="请输入公司款号"
                  clearable
                  style="width: 240px"
              />
            </el-form-item>
            <el-form-item label="客人款号" prop="clientStyleNo">
              <el-input
                  v-model.trim="queryParams.clientStyleNo"
                  placeholder="请输入客人款号"
                  clearable
                  style="width: 240px"
              />
            </el-form-item>
            <el-form-item label="客户名称" prop="clientName">
              <el-input
                  v-model.trim="queryParams.clientName"
                  placeholder="请输入客户名称"
                  clearable
                  style="width: 240px"
              />
            </el-form-item>
            <el-form-item label="工厂名称" prop="factoryName">
              <el-input
                  v-model.trim="queryParams.factoryName"
                  placeholder="请输入工厂名称"
                  clearable
                  style="width: 240px"
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
              />
            </el-form-item>
<!--&lt;!&ndash;            重置&ndash;&gt;-->
<!--            <el-form-item>-->
<!--              <el-button v-btnPreventRepeat icon="Refresh" @click="resetQuery">重置</el-button>-->
<!--            </el-form-item>-->
          </el-form>

          <div class="action-buttons">
            <el-button v-btnPreventRepeat size="small" @click="clearSelection">清空选择</el-button>
            <el-button v-btnPreventRepeat size="small" @click="selectAllFiltered">全选</el-button>
            <el-button v-btnPreventRepeat size="small" @click="reverseSelection">反选</el-button>
          </div>

          <div style="flex:1; min-height: 420px; border: 1px solid #e4e7ed; border-radius: 4px; overflow: hidden;">
            <div style="height: 400px">
              <el-auto-resizer>
                <template #default="{ height, width }">
                  <ElTableV2
                      :data="listData"
                      :columns="vtColumns as any"
                      :width="width"
                      :height="height"
                      fixed
                  />
                </template>
              </el-auto-resizer>
            </div>
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
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button  v-btnPreventRepeat @click="close">取消</el-button>
        <el-button  v-btnPreventRepeat type="primary" @click="submitForm">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>

</template>
<script lang="ts" setup name="SelectDialog">
import { ref,  computed, watch, nextTick, h, getCurrentInstance } from "vue";
import { ElMessage, ElCheckbox, ElTableV2, ElAutoResizer } from "element-plus";
import { parseTime } from '../../utils/ruoyi.js'
import dayjs from 'dayjs'
import { getListPageAll as getSampleCategoryListAll } from '@/api/category.js'
import {
  getListPageAll
} from '@/api/product.js'
import {
  addRequest,updateRequest
} from '@/api/quotation.js'
import {
  getListPageAll as getClientListAll
} from '@/api/client.js'

const { proxy } = getCurrentInstance()
//#region <弹窗相关>
const visible = ref(false);
// 开启弹窗
const open = async (row) => {
  visible.value = true;
  reset()
  await getList()
  if(row){
    // 同步form.value 与 列表属性 的属性
    Object.keys(form.value).forEach(key => {
      form.value[key] = row?.[key] || ''
    })
    // 找到allOptions 中 与productList 中id 相同的所有项目，将与productList的所有属性合并
    row?.productList?.map(item => {
      item.quotationId = item.id
      item.id = item.productId
      allOptions.value.find(opt => {
        if(opt.id === item.id){
          opt = Object.assign(opt, item)
          tableData.value.push(opt)
          return true
        }
      })
    })
  }

};
// 关闭弹窗
const close = () => {
  reset()
  visible.value = false;
};

//#endregion
//#region <form相关>
// 报价日期quotationDate	报价单号quotationNo
const topFormRef = ref()
const form = ref({
  // 默认是当日
  // 默认是当日 value-format="YYYY-MM-DD"
  id:'',
  quotationDate: dayjs().format('YYYY-MM-DD'),
  quotationNo: '',
  clientId: '',
})
/** 表单重置 */
function reset () {
  proxy?.resetForm('topFormRef')
  form.value ={
    id:'',
    quotationDate: dayjs().format('YYYY-MM-DD'),
    quotationNo: '',
    clientId: '',
  }
  // 清空表格数据
  tableData.value=[]
  selectorVisible.value = false
}
const clientList = ref([])

/** 获取客户列表 */
async function getClientList () {
  const res = await getClientListAll()
  clientList.value = res.data
}
getClientList()
//#endregion
// 原始数据
const allOptions = ref([]);
// 获取原始数据
/** 查询字典类型列表 */
async function getList () {
  const res = await getListPageAll()
  allOptions.value = res?.rows || res?.data || []
}
// 与产品列表一致的查询条件
const sampleCategoryList = ref([])
const dateRange = ref([])
const queryParams = ref({
  sampleCategoryId: null,
  name: '',
  styleNo: '',
  clientStyleNo: '',
  clientName: '',
  factoryName: '',
})

// 右侧表格的数据
const tableData = ref([]);

// 选择弹窗-虚拟表格列配置
const toggleSelection = (row) => {
  const index = tableData.value.findIndex(item => item.id === row.id)
  if (index === -1) {
    tableData.value.push(row)
  } else {
    tableData.value.splice(index, 1)
  }
}

const vtColumns = [
  {
    key: 'selection',
    dataKey: 'id',
    width: 55,
    fixed: 'left',
    cellRenderer: ({ rowData }) =>
        h(ElCheckbox, {
          modelValue: isAddedToTable(rowData.id),
          onChange: () => toggleSelection(rowData),
        }),
  },
  { title: '产品名称', key: 'name', dataKey: 'name', width: 180 },
  { title: '样品类别', key: 'sampleCategoryName', dataKey: 'sampleCategoryName', width: 140 },
  { title: '客人款号', key: 'clientStyleNo', dataKey: 'clientStyleNo', width: 180 },
  { title: '公司款号', key: 'styleNo', dataKey: 'styleNo', width: 180 },
  { title: '客户名称', key: 'clientName', dataKey: 'clientName', width: 180 },
  { title: '工厂名称', key: 'factoryName', dataKey: 'factoryName', width: 180 },
  { title: '入库时间', key: 'storageTime', dataKey: 'storageTime', width: 180 },
  { title: '工厂报价', key: 'factoryQuotation', dataKey: 'factoryQuotation', width: 140 },
  { title: '美元报价', key: 'usdQuotation', dataKey: 'usdQuotation', width: 140 },
  { title: '尺码', key: 'size', dataKey: 'size', width: 100 },
  { title: '面料种类', key: 'fabricCategoryName', dataKey: 'fabricCategoryName', width: 180 },
  { title: '面料成分', key: 'fabricComposition', dataKey: 'fabricComposition', width: 180 },
  { title: '面料克重', key: 'fabricWeight', dataKey: 'fabricWeight', width: 140 },
  { title: '面料价格', key: 'fabricPrice', dataKey: 'fabricPrice', width: 140 },
  { title: '面料供应商', key: 'fabricSupplierName', dataKey: 'fabricSupplierName', width: 180 },
  { title: '里布种类', key: 'liningCategory', dataKey: 'liningCategory', width: 180 },
  { title: '里布成分', key: 'liningIngredient', dataKey: 'liningIngredient', width: 180 },
  { title: '里布克重', key: 'liningWeightPer', dataKey: 'liningWeightPer', width: 180 },
  { title: '里布价格', key: 'liningPrice', dataKey: 'liningPrice', width: 180 },
  { title: '里布供应商', key: 'liningSupplierName', dataKey: 'liningSupplierName', width: 180 },
  { title: '备注', key: 'remark', dataKey: 'remark', width: 180 },
  {
    title: '创建时间', key: 'createTime', dataKey: 'createTime', width: 160,
    cellRenderer: ({ rowData }) => h('span', {}, parseTime(rowData.createTime)),
  },
]

// 表单引用
const formRef = ref();
const selectorVisible = ref(false);
watch(()=>selectorVisible.value, (newVal, oldVal) => {
  if(newVal){
    resetQuery()
  }
})
const getSampleCategoryList = async () => {
  await getSampleCategoryListAll().then(response => {
    sampleCategoryList.value = proxy.handleTree(response.data, 'id')
  })
}
getSampleCategoryList()

// 过滤函数
const includesIgnoreCase = (src, q) => {
  if (!q) return true
  const s = (src || '').toString().toLowerCase()
  return s.includes(q.toString().toLowerCase())
}

// 过滤后的列表数据
const listData = computed(() => {
  const list = allOptions.value
  const q = queryParams.value
  return list.filter(item => {
    if (q.sampleCategoryId && item.sampleCategoryId !== q.sampleCategoryId) return false
    if (!includesIgnoreCase(item.styleNo, q.styleNo)) return false
    if (!includesIgnoreCase(item.name, q.name)) return false
    if (!includesIgnoreCase(item.clientStyleNo, q.clientStyleNo)) return false
    if (!includesIgnoreCase(item.clientName, q.clientName)) return false
    if (!includesIgnoreCase(item.factoryName, q.factoryName)) return false
    if (dateRange.value && dateRange.value.length === 2) {
      const ct = item.createTime
      if (!ct) return false
      const t = dayjs(ct)
      const start = dayjs(`${dateRange.value[0]} 00:00:00`)
      const end = dayjs(`${dateRange.value[1]} 23:59:59`)
      if (t.isBefore(start) || t.isAfter(end)) return false
    }
    return true
  })
})

// 重置查询条件
function resetQuery () {
  dateRange.value = []
  queryParams.value = {
    sampleCategoryId: null,
    name: '',
    styleNo: '',
    clientStyleNo: '',
    clientName: '',
    factoryName: '',
  }
}

// 获取已添加到右侧表格的ID列表
const addedIds = computed(() => {
  return tableData.value.map(item => item.id);
});

// 检查是否已添加到右侧表格
const isAddedToTable = (id) => {
  return addedIds.value.includes(id);
};


// 选择变化：来自虚拟表格的勾选
const handleCheckChange = toggleSelection

// 保持选择计数实时更新（无需与树同步）
watch(tableData, () => {}, { deep: true })

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
  tableData.value = [];
};

// 全选当前搜索结果
const selectAllFiltered = () => {
  const allIds = listData.value.map(item => item.id);
  listData.value.forEach(item => {
    if (!isAddedToTable(item.id)) {
      tableData.value.push(item);
    }
  });
};

// 反向选择
const reverseSelection = () => {
  const allIds = listData.value.map(item => item.id);
  const currentAddedIds = addedIds.value.filter(id =>
      listData.value.some(item => item.id === id),
  );
  const newSelection = allIds.filter(id => !currentAddedIds.includes(id));
  tableData.value = tableData.value.filter(item =>
      !listData.value.some(listItem => listItem.id === item.id),
  );

  newSelection.forEach(id => {
    const item = allOptions.value.find(opt => opt.id === id);
    if (item) {
      tableData.value.push(item);
    }
  });
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
      productReqs:tableData.value.map(item => ({
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
    ElMessage.success(`成功提交 ${formData.productReqs.length} 条数据`);
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
// 对外暴露
defineExpose({
  open,
  close,
});
</script>



<style scoped lang="scss">
.dashboard-container {
  height: 100%;
  padding: 20px;
}

.selector-panel {
  padding: 20px;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  .search-input {
    margin-bottom: 15px;
  }

  .action-buttons {
    display: flex;
    gap: 8px;
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

.table-panel {
  padding: 20px;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;

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
</style>
