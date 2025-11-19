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
        <el-form-item label="供应商编码" prop="supplierCode">
          <el-input
              v-model.trim="form.supplierCode"
              placeholder="请输入供应商编码"
              clearable
              maxlength="50"
              show-word-limit
              autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="供应商名称" prop="supplierName">
          <el-input
              v-model.trim="form.supplierName"
              placeholder="请输入供应商名称"
              clearable
              maxlength="100"
              show-word-limit
              autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="联系人" prop="contact">
          <el-input
              v-model.trim="form.contact"
              placeholder="请输入联系人"
              clearable
              maxlength="50"
              autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="电话" prop="telphone">
          <el-input
              v-model.trim="form.telphone"
              placeholder="请输入电话"
              type="tel"
              clearable
              maxlength="20"
              autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="传真" prop="fax">
          <el-input
              v-model.trim="form.fax"
              placeholder="请输入传真"
              clearable
              maxlength="20"
              autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="邮件" prop="email">
          <el-input
              v-model.trim="form.email"
              placeholder="请输入邮件"
              type="email"
              clearable
              maxlength="100"
              autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="微信号" prop="wxCode">
          <el-input
              v-model.trim="form.wxCode"
              placeholder="请输入微信号"
              clearable
              maxlength="50"
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

<script setup name="SupplierAddOrEdit">
import { getDetailRequest, addRequest, updateRequest } from '@/api/supplier.js'
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

const { form, rules } = toRefs(data)

const pageTitle = computed(() => route.query?.id ? '修改供应商' : '添加供应商')
const settingsStore = useSettingsStore()
settingsStore.title = pageTitle.value

function cancel () {
  router.back()
}

function reset () {
  form.value = {
    supplierCode: '',
    supplierName: '',
    contact: '',
    email: '',
    fax: '',
    telphone: '',
    wxCode: '',
  }
  formRef.value?.clearValidate()
}

async function initDetail () {
  const id = route.query?.id
  if (id) {
    const res = await getDetailRequest(id)
    form.value = {
      supplierCode: '',
      supplierName: '',
      contact: '',
      email: '',
      fax: '',
      telphone: '',
      wxCode: '',
      ...res.data,
    }
    formRef.value?.clearValidate()
    console.log(form.value)
  } else {
    reset()
  }
}

onMounted(() => {
  initDetail()
})

function submitForm () {
  formRef.value?.validate(async valid => {
    if (valid) {
      if (form.value.id != undefined) {
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
