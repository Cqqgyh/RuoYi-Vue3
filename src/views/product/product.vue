<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="客户编码" prop="clientCode">
        <el-input
            v-model.trim="queryParams.clientCode"
            placeholder="请输入客户编码"
            clearable
            style="width: 240px"
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="客户名称" prop="clientName">
        <el-input
            v-model.trim="queryParams.clientName"
            placeholder="请输入客客户名称"
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
            v-hasPermi="['system:product:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['system:product:remove']"
        >批量删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['system:product:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="typeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <!--        产品名称 name-->
      <!--        样品类别id	sampleCategoryId 下拉列表-->
      <!--        入库时间	storageTime-->
      <!--        客户	clientId  客户下拉列表-->
      <!--        工厂	factoryId 供应商下拉列表-->
      <!--        客人款号	clientStyleNo.-->
      <!--        公司款号	styleNo.-->
      <!--        工厂报价	factoryQuotation-->
      <!--        美元报价	usdQuotation/newestUsdQuotation-->
      <!--        尺码	size-->
      <!--        面料种类	fabricCategoryId	下拉列表-->
      <!--        面料成分	fabricComposition-->
      <!--        面料克重	fabricWeight-->
      <!--        面料价格	fabricPrice-->
      <!--        面料供应商	fabricSupplierId	供应商下拉列表-->
      <!--        里布种类	liningCategory-->
      <!--        里布成分	liningIngredient-->
      <!--        里布克重	liningWeightPer-->
      <!--        里布价格	liningPrice-->
      <!--        里布供应商	liningSupplierId	供应商下拉列表-->
      <!--        备注  remark-->
      <!--        照片  fileUrlList-->
      <el-table-column label="产品名称" align="center" prop="name" :show-overflow-tooltip="true"/>
      <el-table-column label="样品类别" align="center" prop="sampleCategoryId" :show-overflow-tooltip="true"/>
      <el-table-column label="入库时间" align="center" prop="storageTime" :show-overflow-tooltip="true"/>
      <el-table-column label="客户" align="center" prop="clientId" :show-overflow-tooltip="true"/>
      <el-table-column label="工厂" align="center" prop="factoryId" :show-overflow-tooltip="true"/>
      <el-table-column label="客人款号" align="center" prop="clientStyleNo" :show-overflow-tooltip="true"/>
      <el-table-column label="公司款号" align="center" prop="styleNo" :show-overflow-tooltip="true"/>
      <el-table-column label="工厂报价" align="center" prop="factoryQuotation" :show-overflow-tooltip="true"/>
      <el-table-column label="美元报价" align="center" prop="usdQuotation" :show-overflow-tooltip="true"/>
      <el-table-column label="尺码" align="center" prop="size" :show-overflow-tooltip="true"/>
      <el-table-column label="面料种类" align="center" prop="fabricCategoryId" :show-overflow-tooltip="true"/>
      <el-table-column label="面料成分" align="center" prop="fabricComposition" :show-overflow-tooltip="true"/>
      <el-table-column label="面料克重" align="center" prop="fabricWeight" :show-overflow-tooltip="true"/>
      <el-table-column label="面料价格" align="center" prop="fabricPrice" :show-overflow-tooltip="true"/>
      <el-table-column label="面料供应商" align="center" prop="fabricSupplierId" :show-overflow-tooltip="true"/>
      <el-table-column label="里布种类" align="center" prop="liningCategory" :show-overflow-tooltip="true"/>
      <el-table-column label="里布成分" align="center" prop="liningIngredient" :show-overflow-tooltip="true"/>
      <el-table-column label="里布克重" align="center" prop="liningWeightPer" :show-overflow-tooltip="true"/>
      <el-table-column label="里布价格" align="center" prop="liningPrice" :show-overflow-tooltip="true"/>
      <el-table-column label="里布供应商" align="center" prop="liningSupplierId" :show-overflow-tooltip="true"/>
      <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true"/>
      <el-table-column label="照片" align="center" prop="fileUrlList" :show-overflow-tooltip="true"/>
      <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['system:product:edit']">
            修改
          </el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                     v-hasPermi="['system:product:remove']">删除
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
    <el-dialog :title="title" v-model="open" width="900px" append-to-body>

      <el-form ref="dictRef" :model="form" :rules="rules" label-width="90px">





        <!--        产品名称 name-->
        <!--        样品类别id	sampleCategoryId 下拉列表-->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="产品名称" prop="name">
              <el-input v-model.trim="form.name" placeholder="请输入产品名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="样品类别" prop="sampleCategoryId">
              <el-select v-model="form.sampleCategoryId" placeholder="请选择样品类别" filterable clearable>
                <el-option v-for="item in sampleCategoryList" :key="item.value" :label="item.label"
                           :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!--        入库时间	storageTime-->
        <!--        客户	clientId  客户下拉列表-->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="入库时间" prop="storageTime">
              <el-date-picker style="width: 100%;" v-model="form.storageTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择入库时间"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户" prop="clientId">
              <el-select v-model="form.clientId" placeholder="请选择客户" filterable clearable>
                <el-option v-for="item in clientList" :key="item.id" :label="item.clientName"
                           :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!--        工厂	factoryId 供应商下拉列表-->
        <!--        客人款号	clientStyleNo.-->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="工厂" prop="factoryId">
              <el-select v-model="form.factoryId" placeholder="请选择供应商" filterable clearable>
                <el-option v-for="item in supplierList" :key="item.id" :label="item.supplierName"
                           :value="item.id"/>
              </el-select>
            </el-form-item>

          </el-col>
          <el-col :span="12">
            <el-form-item label="客人款号" prop="clientStyleNo">
              <el-input v-model.trim="form.clientStyleNo" placeholder="请输入客人款号"/>
            </el-form-item>
          </el-col>
        </el-row>
        <!--        公司款号	styleNo.-->
        <!--        工厂报价	factoryQuotation-->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="公司款号" prop="styleNo">
              <el-input v-model.trim="form.styleNo" placeholder="请输入公司款号"/>
            </el-form-item>

          </el-col>
          <el-col :span="12">
            <el-form-item label="工厂报价" prop="factoryQuotation">
              <el-input v-model.trim="form.factoryQuotation" placeholder="请输入工厂报价"/>
            </el-form-item>
          </el-col>
        </el-row>
        <!--        美元报价	usdQuotation/newestUsdQuotation-->
        <!--        尺码	size-->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="美元报价" prop="usdQuotation">
              <el-input v-model.trim="form.usdQuotation" placeholder="请输入美元报价"/>
            </el-form-item>

          </el-col>
          <el-col :span="12">
            <el-form-item label="尺码" prop="size">
              <el-input v-model.trim="form.size" placeholder="请输入尺码"/>
            </el-form-item>
          </el-col>
        </el-row>
        <!--        面料种类	fabricCategoryId	下拉列表-->
        <!--        面料成分	fabricComposition-->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="面料种类" prop="fabricCategoryId">
              <el-select v-model="form.fabricCategoryId" placeholder="请选择面料种类" filterable clearable>
                <el-option v-for="item in fabricCategoryList" :key="item.fabricCategoryId"
                           :label="item.label"
                           :value="item.value"/>
              </el-select>
            </el-form-item>

          </el-col>
          <el-col :span="12">
            <el-form-item label="面料成分" prop="fabricComposition">
              <el-input v-model.trim="form.fabricComposition" placeholder="请输入面料成分"/>
            </el-form-item>
          </el-col>
        </el-row>
        <!--        面料克重	fabricWeight-->
        <!--        面料价格	fabricPrice-->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="面料克重" prop="fabricWeight">
              <el-input v-model.trim="form.fabricWeight" placeholder="请输入面料克重"/>
            </el-form-item>

          </el-col>
          <el-col :span="12">
            <el-form-item label="面料价格" prop="fabricPrice">
              <el-input v-model.trim="form.fabricPrice" placeholder="请输入面料价格"/>
            </el-form-item>
          </el-col>
        </el-row>
        <!--        面料供应商	fabricSupplierId	供应商下拉列表-->
        <!--        里布种类	liningCategory-->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="面料供应商" prop="fabricSupplierId">
              <el-select v-model="form.fabricSupplierId" placeholder="请选择面料供应商" filterable clearable>
                <el-option v-for="item in supplierList" :key="item.id" :label="item.supplierName"
                           :value="item.id"/>
              </el-select>
            </el-form-item>

          </el-col>
          <el-col :span="12">
            <el-form-item label="里布种类" prop="liningCategory">
              <el-input v-model.trim="form.liningCategory" placeholder="请输入里布种类"/>
            </el-form-item>
          </el-col>
        </el-row>
        <!--        里布成分	liningIngredient-->
        <!--        里布克重	liningWeightPer-->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="里布成分" prop="liningIngredient">
              <el-input v-model.trim="form.liningIngredient" placeholder="请输入里布成分"/>
            </el-form-item>

          </el-col>
          <el-col :span="12">
            <el-form-item label="里布克重" prop="liningWeightPer">
              <el-input v-model.trim="form.liningWeightPer" placeholder="请输入里布克重"/>
            </el-form-item>
          </el-col>
        </el-row>
        <!--        里布价格	liningPrice-->
        <!--        里布供应商	liningSupplierId	供应商下拉列表-->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="里布价格" prop="liningPrice">
              <el-input v-model.trim="form.liningPrice" placeholder="请输入里布价格"/>
            </el-form-item>

          </el-col>
          <el-col :span="12">
            <el-form-item label="里布供应商" prop="liningSupplierId">
              <el-select v-model="form.liningSupplierId" placeholder="请选择里布供应商" filterable clearable>
                <el-option v-for="item in supplierList" :key="item.id" :label="item.supplierName"
                           :value="item.liningSupplierId"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!--        照片  fileUrlList-->
        <!--        备注  remark-->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="照片" prop="fileUrlList">
             <image-upload v-model="form.fileUrlList" :limit="10" :fileSize="10"></image-upload>

<!--              <el-upload-->
<!--                  class="avatar-uploader"-->
<!--                  action="#"-->
<!--                  :show-file-list="true"-->
<!--                  list-type="picture-card"-->
<!--                  :on-success="handleAvatarSuccess"-->
<!--                  :file-list="form.fileUrlList"-->
<!--              >-->
<!--                <el-button size="small" type="primary">点击上传</el-button>-->
<!--              </el-upload>-->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" prop="remark">
              <el-input v-model.trim="form.remark" type="textarea"  placeholder="请输入备注"/>
            </el-form-item>

          </el-col>

        </el-row>


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

<script setup name="Product">

import { getListPage, getDetailRequest, addRequest, updateRequest, delRequest } from '@/api/product.js'
import { getListPageAll  as getClientListAll } from '@/api/client.js'
import { getListPageAll as getSupplierListAll } from '@/api/supplier.js'
import ImageUpload from '@/components/ImageUpload/index.vue'

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
  rules: {},
})

const { queryParams, form, rules } = toRefs(data)
//#region <供应商、客户>
const supplierList = ref([])
const clientList = ref([])
/** 获取客户列表 */
async function getClientList () {
 const res = await getClientListAll()
  clientList.value = res.data
}
async function getSupplierList () {
  const res = await getSupplierListAll()
  supplierList.value = res.data
}
getClientList()
getSupplierList()
//#endregion
//#region <样品类别、面料种类>
const { fabric_category : fabricCategoryList, sample_category : sampleCategoryList } = proxy.useDictForCode("fabric_category", "sample_category")
console.log('fabricCategoryList',fabricCategoryList)
console.log('sampleCategoryList',sampleCategoryList)
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

/** 取消按钮 */
function cancel () {
  open.value = false
  reset()
}

/** 表单重置 */
function reset () {
  form.value = {
    /* 客户id
    */
    clientId: '',
    /**
     * 客人款号
     */
    clientStyleNo: '',
    /**
     * 面料种类
     */
    fabricCategoryId: '',
    /**
     * 面料成分
     */
    fabricComposition: '',
    /**
     * 面料价格
     */
    fabricPrice: '',
    /**
     * 面料供应商id
     */
    fabricSupplierId: '',
    /**
     * 面料克重
     */
    fabricWeight: '',
    /**
     * 工厂id
     */
    factoryId: '',
    /**
     * 工厂报价
     */
    factoryQuotation: '',
    /**
     * 附件列表-附件url
     */
    fileUrlList: [],
    /**
     * 主键
     */
    id: '',
    /**
     * 是否可以展示给客户：是、否
     */
    isShowFlag: '',
    /**
     * 里布种类
     */
    liningCategory: '',
    /**
     * 里布成分
     */
    liningIngredient: '',
    /**
     * 里布价格
     */
    liningPrice: '',
    /**
     * 里布供应商id
     */
    liningSupplierId: '',
    /**
     * 里布克重
     */
    liningWeightPer: '',
    /**
     * 产品名称
     */
    name: '',
    /**
     * 最新美元报价-多次报价取最新
     */
    newestUsdQuotation: '',

    /**
     * 备注
     */
    remark: '',
    /**
     * 样品类别id-字典取
     */
    sampleCategoryId: '',
    /**
     * 尺码
     */
    size: '',
    /**
     * 入库时间
     */
    storageTime: '',
    /**
     * 公司款号
     */
    styleNo: '',
    /**
     * 美元报价
     */
    usdQuotation: '',
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
  proxy.resetForm('queryRef')
  handleQuery()
}

/** 新增按钮操作 */
function handleAdd () {
  reset()
  open.value = true
  title.value = '添加客户'
}

/** 多选框选中数据 */
function handleSelectionChange (selection) {
  ids.value = selection.map(item => item.id)
  single.value = selection.length != 1
  multiple.value = !selection.length
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
  const ids = row.id || ids.value
  proxy.$modal.confirm('是否确认删除？').then(function () {
    return delRequest(ids)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess('删除成功')
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport () {
  proxy.download('/system/product/export', {
    ...queryParams.value,
  }, `产品管理_${new Date().getTime()}.xlsx`)
}

getList()
</script>
