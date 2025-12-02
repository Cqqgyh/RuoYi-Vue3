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
        <el-form-item label="邮件标题" prop="subject">
          <el-input v-model.trim="form.subject" placeholder="请输入邮件标题" clearable maxlength="255" />
        </el-form-item>
        <el-form-item label="邮件正文" prop="content">
          <el-input v-model.trim="form.content" type="textarea" :rows="6" placeholder="请输入邮件正文" />
        </el-form-item>
      </el-form>
    </el-card>
    <van-action-bar class="mobile-actions">
      <el-button v-btnPreventRepeat style="width: 100px;" round size="large" @click="cancel">返 回</el-button>
      <el-button v-btnPreventRepeat round type="primary" size="large" :loading="submitLoading" @click="submitForm">确 定</el-button>
    </van-action-bar>
  </div>
</template>

<script setup name="SendMail">
import { ref, reactive, toRefs, computed, onMounted, getCurrentInstance } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ActionBar as VanActionBar } from 'vant'
import useSettingsStore from '@/store/modules/settings.js'
import { sendMailRequest } from '@/api/quotation.js'

const { proxy } = getCurrentInstance()
const router = useRouter()
const route = useRoute()

const formRef = ref(null)
const submitLoading = ref(false)

const data = reactive({
  form: {
    recordId: '',
    subject: '',
    content: '',
  },
  rules: {
    subject: [{ required: true, message: '请输入邮件标题', trigger: 'blur' }],
    content: [{ required: true, message: '请输入邮件正文', trigger: 'blur' }],
  },
})

const { form, rules } = toRefs(data)

const pageTitle = computed(() => '发送邮件')
const settingsStore = useSettingsStore()
settingsStore.title = pageTitle.value

function cancel () {
  router.back()
}

function reset () {
  form.value = { recordId: '', subject: '', content: '' }
  formRef.value?.clearValidate()
}

function initRecordId () {
  const id = route.query?.id ?? route.params?.id ?? route.query?.recordId ?? route.params?.recordId
  form.value.recordId = Number(id) || ''
}

onMounted(() => {
  reset()
  initRecordId()
})

async function submitForm () {
  console.log('form.value',form.value)
  try {
    await proxy.$refs['formRef'].validate()
    submitLoading.value = true
    await sendMailRequest({ recordId: form.value.recordId, subject: form.value.subject, content: form.value.content })
    proxy.$modal.msgSuccess('发送成功')
    router.back()
  } catch (e) {
  } finally {
    submitLoading.value = false
  }
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
