<template>
  <div class="app-container mobile-container">
    <el-card class="mobile-card" shadow="never">
      <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-position="top"
          size="large"
          class="mobile-form"
          scroll-to-error
          :scroll-into-view-options='{
            block: "center",
            behavior: "smooth",
          }'
      >
        <el-form-item label="上级分类" prop="parentId">
          <el-tree-select
              v-model="form.parentId"
              :data="sampleCategoryList"
              :props="{ value: 'id', label: 'categoryName', children: 'children' }"
              value-key="id"
              placeholder="选择上级分类"
              check-strictly
          />
        </el-form-item>
        <el-form-item label="分类名称" prop="categoryName">
          <el-input
              v-model.trim="form.categoryName"
              placeholder="请输入分类名称"
              clearable
              maxlength="100"
              show-word-limit
              autocomplete="off"
          />
        </el-form-item>
      </el-form>
    </el-card>
    <van-action-bar class="mobile-actions">
      <el-button v-btnPreventRepeat style="width: 100px;" round size="large" @click="cancel">返 回</el-button>
      <el-button v-btnPreventRepeat round type="primary" size="large" @click="submitForm">确 定</el-button>
    </van-action-bar>
  </div>
</template>

<script setup name="CategoryAddOrEdit">
import { getDetailRequest, addRequest, updateRequest, getListPageAll } from '@/api/category.js'
import { useRouter, useRoute } from 'vue-router'
import { ActionBar as VanActionBar } from 'vant'
import useSettingsStore from '@/store/modules/settings.js'

const { proxy } = getCurrentInstance()
const router = useRouter()
const route = useRoute()
const formRef = ref(null)

const data = reactive({
  form: {},
  rules: {
    parentId: [{ required: true, message: '请选择上级分类', trigger: 'change' }],
    categoryName: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
  },
})

const { form, rules } = toRefs(data)

const pageTitle = computed(() => route.query?.id ? '修改样品分类' : '添加样品分类')
const settingsStore = useSettingsStore()
settingsStore.title = pageTitle.value

function cancel () {
  router.back()
}
const sampleCategoryList = ref([])
const getSampleCategoryList = async () => {
  await getListPageAll().then(response => {
    sampleCategoryList.value = proxy.handleTree(response.data, 'id')
  })
}
getSampleCategoryList()
function reset () {
  form.value = {
    id: undefined,
    categoryName: undefined,
    parentId: undefined,
  }
  formRef.value?.clearValidate()
}

async function initDetail () {
  const id = route.query?.id
  if (id) {
    const res = await getDetailRequest(id)
    form.value = {
      id: undefined,
      categoryName: undefined,
      parentId: undefined,
      ...res.data,
    }
    formRef.value?.clearValidate()
    console.log(form.value)
  } else {
    reset()
    if(route.query?.parentId) {
      console.log('route.query?.parentId',route.query?.parentId)
      form.value.parentId = Number(route.query?.parentId)
    }
  }
}

onMounted(() => {
  initDetail()
})

function submitForm () {
  formRef.value?.validate(async valid => {
    if (valid) {
      if (form.value.id) {
        await updateRequest(form.value).then(response => {
          proxy.$modal.msgSuccess('修改成功')
          router.back()
        })
      } else {
        await addRequest(form.value).then(response => {
          proxy.$modal.msgSuccess('新增成功')
          router.back()
        })
      }
    }
  })
}

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
</style>
