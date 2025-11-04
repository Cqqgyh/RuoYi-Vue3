<script lang="ts" setup name="Dashboard">
import { ref, reactive, computed, watch, nextTick, h } from "vue";
import { ElMessage, ElMessageBox, type TreeNode } from "element-plus";
import type { TreeNodeData } from "element-plus/es/components/tree-v2/src/types";

// 原始数据
const allOptions = ref([
  { id: 1, name: "张三", age: 25, email: "zhangsan@example.com", department: "技术部" },
  { id: 2, name: "李四", age: 30, email: "lisi@example.com", department: "产品部" },
  { id: 3, name: "王五", age: 28, email: "wangwu@example.com", department: "设计部" },
  { id: 4, name: "赵六", age: 32, email: "zhaoliu@example.com", department: "市场部" },
  { id: 5, name: "钱七", age: 26, email: "qianqi@example.com", department: "技术部" },
  { id: 6, name: "孙八", age: 29, email: "sunba@example.com", department: "运营部" },
]);

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
    item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    item.department.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    item.email.toLowerCase().includes(searchQuery.value.toLowerCase()),
  );
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
  ElMessageBox.confirm(
    `确定要删除 ${row.name} 吗？`,
    "提示",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    },
  ).then(() => {
    const index = tableData.value.findIndex(item => item.id === row.id);
    if (index !== -1) {
      tableData.value.splice(index, 1);
      ElMessage.success("删除成功");
    }
  }).catch(() => {
    ElMessage.info("已取消删除");
  });
};

// 部门选项
const departmentOptions = [
  { label: "技术部", value: "技术部" },
  { label: "产品部", value: "产品部" },
  { label: "设计部", value: "设计部" },
  { label: "市场部", value: "市场部" },
  { label: "运营部", value: "运营部" },
];

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
  const isAdded = isAddedToTable(data.id);
  return h("div", {
    class: "employee-node",
  }, [
    h("span", { class: "employee-name" }, data.name),
    h("span", { class: "employee-info" }, `${data.age}岁`),
    h("span", { class: "employee-info" }, data.email),
    h("span", { class: "employee-dept" }, data.department),
    isAdded ? h("el-tag", {
      type: "success",
      size: "small",
      style: { marginLeft: "8px" },
    }, "已添加") : null,
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
    await formRef.value.validate();

    // 收集表单数据
    const formData = tableData.value.map(item => ({
      id: item.id,
      name: item.name,
      age: item.age,
      email: item.email,
      department: item.department,
    }));

    console.log("提交的表单数据：", formData);
    ElMessage.success(`成功提交 ${formData.length} 条数据`);

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
</script>

<template>
  <div class="dashboard-container">
    <splitpanes>
      <pane>
        <splitpanes>
          <!-- 左侧选择器区域 -->
          <pane size="30">
            <div class="selector-panel">
              <h3 class="panel-title">数据选择器</h3>

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
              <h3 class="panel-title">数据表格（直接编辑）</h3>

              <!-- 表格 -->
              <el-form ref="formRef" :model="tableData">
                <el-table :data="tableData" style="width: 100%">
                  <!-- 姓名列 -->
                  <el-table-column prop="name" label="姓名">
                    <template #default="scope">
                      <el-input
                        v-model="scope.row.name"
                        placeholder="请输入姓名"
                        size="small"
                      />
                    </template>
                  </el-table-column>

                  <!-- 年龄列 -->
                  <el-table-column prop="age" label="年龄">
                    <template #default="scope">
                      <el-input
                        v-model.number="scope.row.age"
                        placeholder="年龄"
                        size="small"
                        type="number"
                      />
                    </template>
                  </el-table-column>

                  <!-- 邮箱列（必填校验） -->
                  <el-table-column prop="email" label="邮箱*">
                    <template #default="scope">
                      <el-form-item
                        :prop="`${scope.$index}.email`"
                        :rules="[
  { required: true, message: '请输入邮箱地址', trigger: 'blur' },
  { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
]"
                        style="margin-bottom: 0;"
                      >
                        <el-input
                          v-model="scope.row.email"
                          placeholder="请输入邮箱"
                          size="small"
                        />
                      </el-form-item>
                    </template>
                  </el-table-column>

                  <!-- 部门列 -->
                  <el-table-column prop="department" label="部门">
                    <template #default="scope">
                      <el-select
                        v-model="scope.row.department"
                        placeholder="请选择部门"
                        size="small"
                        style="width: 100%"
                      >
                        <el-option
                          v-for="option in departmentOptions"
                          :key="option.value"
                          :label="option.label"
                          :value="option.value"
                        />
                      </el-select>
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

              <!-- 提交按钮 -->
              <div class="submit-section">
                <el-button
                  type="primary"
                  size="large"
                  @click="submitForm"
                  :disabled="tableData.length === 0"
                >
                  提交数据 ({{ tableData.length }})
                </el-button>
              </div>

              <!-- 空状态 -->
              <el-empty v-if="tableData.length === 0" description="暂无数据，请从左侧选择器添加数据" />
            </div>
          </pane>
        </splitpanes>
      </pane>
    </splitpanes>
  </div>
</template>

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

  .panel-title {
    margin-bottom: 20px;
    color: #333;
    font-size: 18px;
    font-weight: bold;
  }

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
      .cell{
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

  .submit-section {
    margin-top: 20px;
    text-align: center;
    padding-top: 20px;
    border-top: 1px solid #e4e7ed;

    .el-button {
      min-width: 120px;
    }
  }
}

.ml8 {
  margin-left: 8px;
}
</style>
