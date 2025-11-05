<template>
  <el-dialog
      v-model="visible"
      destroy-on-close
  >
    <div class="dashboard-container">
      <el-form ref="topFormRef" :model="form" label-width="90px">
        <el-row :gutter="20">
          <el-col :span="12">
<!--            动态rules，当tableData长度大于时，报价单号必填-->
            <el-form-item label="报价单号" prop="quotationNo" :required="tableData.length > 1" :rules="tableData.length > 1 ? [{ required: true, message: '请输入报价单号', trigger: 'blur' }] : []">
              <el-input v-model.trim="form.quotationNo" placeholder="请输入报价单号"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报价日期" prop="quotationDate">
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
      <splitpanes>
        <pane>
          <splitpanes>
            <!-- 左侧选择器区域 -->
            <pane size="30">
              <div class="selector-panel">

                <!-- 搜索输入框 -->
                <el-input
                    v-model="searchQuery"
                    placeholder="搜索姓名、部门或邮箱..."
                    prefix-icon="Search"
                    clearable
                    class="search-input"
                />

                <!-- 操作按钮组 -->
                <div class="action-buttons">
                  <el-button size="small" @click="clearSelection">清空选择</el-button>
                  <el-button size="small" @click="selectAllFiltered">全选</el-button>
                  <el-button size="small" @click="reverseSelection">反选</el-button>
                </div>

                <!-- 虚拟化列表控件 -->
                <div class="tree-container">
                  <el-tree-v2
                      ref="treeRef"
                      :data="listData"
                      :props="{ label: 'name' }"
                      :show-checkbox="true"
                      :height="400"
                      :check-strictly="false"
                      @check="handleCheckChange"
                      :render-content="renderContent"
                      class="data-tree"
                      :default-checked-keys="addedIds"
                  >
                    <template #empty>
                      <el-empty description="没有找到匹配的数据" />
                    </template>
                  </el-tree-v2>
                </div>

                <!-- 搜索结果统计 -->
                <div class="search-stats">
                  共找到 {{ listData.length }} 条数据，
                  已选择 {{ selectedCount }} 条
                </div>
              </div>
            </pane>

            <!-- 右侧表格区域 -->
            <pane class="ml8">
              <div class="table-panel">

                <!-- 表格 -->
                <el-form ref="formRef" :model="tableData">
                  <el-table :data="tableData" style="width: 100%" height="485px">
                    <!-- 姓名列 -->
                    <el-table-column prop="name" label="产品名称" />
                    <!-- 客户 -->
                    <el-table-column prop="clientId" label="客户*"
                    >
                      <template #default="scope">
                        <el-form-item
                            :prop="`${scope.$index}.clientId`"
                            style="margin-bottom: 0;width: 100%"

                            :rules="[
  { required: true, message: '请选择客户', trigger: 'blur' },
]"
                        >
                          <el-select
                              v-model="scope.row.clientId"
                              placeholder="请选择客户"
                              size="small"
                              style="width: 100%"
                              disabled
                          >
                            <el-option
                                v-for="option in clientOptions"
                                :key="option.id"
                                :label="option.clientName"
                                :value="option.id"
                            />
                          </el-select>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <!-- 美元报价 -->
                    <el-table-column prop="usdQuotation" label="美元报价*"
                    >
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

                    <!-- 备注） -->
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


                    <!-- 操作列 -->
                    <el-table-column label="操作" width="80">
                      <template #default="scope">
                        <el-button
                            size="small"
                            type="danger"
                            @click="deleteRow(scope.row)"
                        >
                          删除
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-form>

              </div>
            </pane>
          </splitpanes>
        </pane>
      </splitpanes>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submitForm">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>

</template>
<script lang="ts" setup name="SelectDialog">
import { ref,  computed, watch, nextTick, h } from "vue";
import { ElMessage} from "element-plus";
import {
  getListPageAll,addRequest
} from '@/api/product.js'

const { proxy } = getCurrentInstance()
//#region <弹窗相关>
const visible = ref(false);
// 开启弹窗
const open = () => {
  visible.value = true;
  reset()
  getList()
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
  quotationDate: '',
  quotationNo: '',
})
/** 表单重置 */
function reset () {
  form.value ={
    quotationDate: '',
        quotationNo: '',
  }
  proxy?.resetForm('dictRef')
}
//#endregion
// 原始数据
const allOptions = ref([
  {
    "createBy": "consequat cillum velit anim",
    "createTime": "2025-11-01 01:18:29",
    "updateBy": "2025-04-15",
    "updateTime": "2025-11-01 01:18:29",
    "remark": "in adipisicing laboris do",
    "id": 1,
    "delFlag": "0",
    "name": "仪秀英",
    "sampleCategoryId": 30,
    "sampleCategoryName": "分类1",
    "storageTime": "1974-03-31",
    "clientId": 4,
    "clientName": "禚一全",
    "factoryId": 1,
    "factoryName": "印子欣",
    "clientStyleNo": "clientStyleNo",
    "styleNo": "styleNo",
    "factoryQuotation": 92,
    "usdQuotation": 8,
    "newestUsdQuotation": 84,
    "size": 21,
    "fabricCategoryId": 33,
    "fabricCategoryName": "面料种类1",
    "fabricComposition": "laboris in tempor irure cillum",
    "fabricWeight": 25,
    "fabricPrice": 34.89,
    "fabricSupplierId": 2,
    "fabricSupplierName": "功鑫",
    "liningCategory": "pariatur Duis",
    "liningIngredient": "tempor",
    "liningWeightPer": 35,
    "liningPrice": 87.69,
    "liningSupplierId": 4,
    "liningSupplierName": "宛安琪",
    "isShowFlag": "1",
    "isShowFlagStr": "是",
    "registrar": 1,
    "registrarName": "admin",
    "fileUrlList": null,
    "qrCodeUrl": null,
    "quotationRecordList": null
  },
  {
    "createBy": "consequat cillum velit anim",
    "createTime": "2025-11-01 01:18:29",
    "updateBy": "2025-04-15",
    "updateTime": "2025-11-01 01:18:29",
    "remark": "in adipisicing laboris do",
    "id": 2,
    "delFlag": "0",
    "name": "仪秀英2",
    "sampleCategoryId": 30,
    "sampleCategoryName": "分类1",
    "storageTime": "1974-03-31",
    "clientId": 4,
    "clientName": "禚一全",
    "factoryId": 1,
    "factoryName": "印子欣",
    "clientStyleNo": "clientStyleNo",
    "styleNo": "styleNo",
    "factoryQuotation": 92,
    "usdQuotation": 8,
    "newestUsdQuotation": 84,
    "size": 21,
    "fabricCategoryId": 33,
    "fabricCategoryName": "面料种类1",
    "fabricComposition": "laboris in tempor irure cillum",
    "fabricWeight": 25,
    "fabricPrice": 34.89,
    "fabricSupplierId": 2,
    "fabricSupplierName": "功鑫",
    "liningCategory": "pariatur Duis",
    "liningIngredient": "tempor",
    "liningWeightPer": 35,
    "liningPrice": 87.69,
    "liningSupplierId": 4,
    "liningSupplierName": "宛安琪",
    "isShowFlag": "1",
    "isShowFlagStr": "是",
    "registrar": 1,
    "registrarName": "admin",
    "fileUrlList": null,
    "qrCodeUrl": null,
    "quotationRecordList": null
  },
]);
// 获取原始数据
/** 查询字典类型列表 */
async function getList () {
  const res = await getListPageAll()
  allOptions.value = res.data
}
// 搜索关键词
const searchQuery = ref("");

// 右侧表格的数据
const tableData = ref([]);

// 树形组件引用
const treeRef = ref();

// 表单引用
const formRef = ref();

// 将数据转换为单层列表结构
const listData = computed(() => {
  if (!searchQuery.value) {
    return allOptions.value;
  }

  return allOptions.value.filter(item =>
      item.name.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

// 获取已添加到右侧表格的ID列表
const addedIds = computed(() => {
  return tableData.value.map(item => item.id);
});

// 检查是否已添加到右侧表格
const isAddedToTable = (id) => {
  return addedIds.value.includes(id);
};


// 实时同步：当左侧选择状态变化时，更新右侧表格
const handleCheckChange = (data, checked) => {
  console.log("treeRef", treeRef.value.getCurrentNode());
  console.log("handleCheckChange---data", data);
  console.log("handleCheckChange", checked);
  // tableData.value = [...checked.checkedNodes]
  if (!isAddedToTable(data.id)) {
    // 选中且未添加到右侧，则添加
    tableData.value.push(data);
  } else {
    // 取消选中且已添加到右侧，则删除
    const index = tableData.value.findIndex(item => item.id === data.id);
    if (index !== -1) {
      tableData.value.splice(index, 1);
    }
  }
};

// 实时同步：当右侧表格数据变化时，更新左侧选择状态
watch(tableData, (newTableData) => {
  const newAddedIds = newTableData.map(item => item.id);
  if (treeRef.value) {
    // 使用 nextTick 确保 DOM 更新后再设置选中状态
    nextTick(() => {
      treeRef.value.setCheckedKeys(newAddedIds);
    });
  }
}, { deep: true });

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

// 客户选项
const clientOptions = ref([
  {
    "createBy": "",
    "createTime": "2025-11-04 09:45:14",
    "updateBy": "",
    "updateTime": null,
    "remark": null,
    "id": 106,
    "delFlag": "0",
    "productId": null,
    "clientCode": "11",
    "clientName": "2",
    "country": "3",
    "contact": "4",
    "telphone": "13054729089",
    "fax": "5",
    "email": "2524028821@qq.com",
  },
  {
    "createBy": "",
    "createTime": "2025-11-02 21:31:07",
    "updateBy": "",
    "updateTime": null,
    "remark": null,
    "id": 101,
    "delFlag": "0",
    "productId": null,
    "clientCode": "客户编码95",
    "clientName": "客户名称95",
    "country": null,
    "contact": "联系人95",
    "telphone": "957777777777",
    "fax": "传真95",
    "email": "email95@example.com",
  },
  {
    "createBy": "",
    "createTime": "2025-11-02 21:31:07",
    "updateBy": "",
    "updateTime": null,
    "remark": null,
    "id": 104,
    "delFlag": "0",
    "productId": null,
    "clientCode": "客户编码97",
    "clientName": "客户名称97",
    "country": null,
    "contact": "联系人97",
    "telphone": "977777777777",
    "fax": "传真97",
    "email": "email97@example.com",
  },
  {
    "createBy": "",
    "createTime": "2025-11-02 21:31:07",
    "updateBy": "",
    "updateTime": null,
    "remark": null,
    "id": 103,
    "delFlag": "0",
    "productId": null,
    "clientCode": "客户编码96",
    "clientName": "客户名称96",
    "country": null,
    "contact": "联系人96",
    "telphone": "967777777777",
    "fax": "传真96",
    "email": "email96@example.com",
  },
  {
    "createBy": "",
    "createTime": "2025-11-02 21:31:07",
    "updateBy": "",
    "updateTime": null,
    "remark": null,
    "id": 99,
    "delFlag": "0",
    "productId": null,
    "clientCode": "客户编码98",
    "clientName": "客户名称98",
    "country": null,
    "contact": "联系人98",
    "telphone": "987777777777",
    "fax": "传真98",
    "email": "email98@example.com",
  },
  {
    "createBy": "",
    "createTime": "2025-11-02 21:31:07",
    "updateBy": "",
    "updateTime": null,
    "remark": null,
    "id": 102,
    "delFlag": "0",
    "productId": null,
    "clientCode": "客户编码94",
    "clientName": "客户名称94",
    "country": null,
    "contact": "联系人94",
    "telphone": "947777777777",
    "fax": "传真94",
    "email": "email94@example.com",
  },
  {
    "createBy": "",
    "createTime": "2025-11-02 21:31:07",
    "updateBy": "",
    "updateTime": null,
    "remark": null,
    "id": 105,
    "delFlag": "0",
    "productId": null,
    "clientCode": "客户编码100",
    "clientName": "客户名称100",
    "country": null,
    "contact": "联系人100",
    "telphone": "1007777777777",
    "fax": "传真100",
    "email": "email100@example.com",
  },
  {
    "createBy": "",
    "createTime": "2025-11-02 21:31:07",
    "updateBy": "",
    "updateTime": null,
    "remark": null,
    "id": 100,
    "delFlag": "0",
    "productId": null,
    "clientCode": "客户编码99",
    "clientName": "客户名称99",
    "country": null,
    "contact": "联系人99",
    "telphone": "997777777777",
    "fax": "传真99",
    "email": "email99@example.com",
  },
  {
    "createBy": "",
    "createTime": "2025-11-02 21:31:06",
    "updateBy": "",
    "updateTime": null,
    "remark": null,
    "id": 60,
    "delFlag": "0",
    "productId": null,
    "clientCode": "客户编码56",
    "clientName": "客户名称56",
    "country": null,
    "contact": "联系人56",
    "telphone": "567777777777",
    "fax": "传真56",
    "email": "email56@example.com",
  },
  {
    "createBy": "",
    "createTime": "2025-11-02 21:31:06",
    "updateBy": "",
    "updateTime": null,
    "remark": null,
    "id": 59,
    "delFlag": "0",
    "productId": null,
    "clientCode": "客户编码54",
    "clientName": "客户名称54",
    "country": null,
    "contact": "联系人54",
    "telphone": "547777777777",
    "fax": "传真54",
    "email": "email54@example.com",
  },
]);

// 清空选择
const clearSelection = () => {
  if (treeRef.value) {
    treeRef.value.setCheckedKeys([]);
  }
  tableData.value = [];
};

// 全选当前搜索结果
const selectAllFiltered = () => {
  const allIds = listData.value.map(item => item.id);
  if (treeRef.value) {
    treeRef.value.setCheckedKeys(allIds);
  }

  // 添加所有未添加的数据
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

  if (treeRef.value) {
    treeRef.value.setCheckedKeys(newSelection);
  }

  // 移除当前已添加的，添加未添加的
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

// 自定义节点内容
const renderContent = ({ node, data }) => {
  return h("div", {
    class: "employee-node",
  }, [
    h("span", { class: "employee-name" }, data.name),
  ]);
};

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
    const formData = {
      ...form.value,
      productReqs:tableData.value.map(item => ({
        id: item.id,
        quotationDate: item.quotationDate,
        clientId: item.clientId,
        usdQuotation: item.usdQuotation,
        remark: item.remark,
      }))
    }

    console.log("提交的表单数据：", formData);
    await addRequest(formData);
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
      listData.value.some(item => item.id === id),
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
