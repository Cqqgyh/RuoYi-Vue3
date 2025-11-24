<template>
  <el-dialog :title="title" v-model="visible" :width="width" append-to-body>
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="邮件标题" prop="subject">
        <el-input v-model.trim="form.subject" placeholder="请输入邮件标题" clearable/>
      </el-form-item>
      <el-form-item label="邮件正文" prop="content">
        <el-input v-model.trim="form.content" type="textarea" :rows="6" placeholder="请输入邮件正文"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button v-btnPreventRepeat @click="onCancel">取 消</el-button>
        <el-button v-btnPreventRepeat type="primary" :loading="submitLoading" @click="onSubmit">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="SendMail">
import { ref, reactive, computed, watch, getCurrentInstance } from 'vue'
import { sendMailRequest } from '@/api/quotation.js'

const { proxy } = getCurrentInstance()

const props = defineProps({
  recordId: { type: Number, default: undefined },
  title: { type: String, default: '发送邮件' },
  width: { type: String, default: '600px' },
})
const visible = ref()

const formRef = ref()
const submitLoading = ref(false)

const form = ref({
  recordId: '',
  subject: '',
  content: '',
})
const rules = ref({
  subject: [
    { required: true, message: '请输入邮件标题', trigger: 'blur' },
  ],
  content: [
    { required: true, message: '请输入邮件正文', trigger: 'blur' },
  ],
})
const resetForm = () => {
  form.value = { recordId: '', subject: '', content: '' }
  nextTick(() => {
    formRef.value.resetFields()
  })
}

function onCancel () {
  close()
}

const open = (row) => {
  visible.value = true
  resetForm()
  form.value.recordId = row.id
}
const close = () => {
  visible.value = false
  resetForm()
}

async function onSubmit () {
  console.log('form.value',form.value)
  try {
    await formRef.value.validate()
    submitLoading.value = true
    await sendMailRequest({ recordId: form.value.recordId, subject: form.value.subject, content: form.value.content })
    proxy.$modal.msgSuccess('发送成功')
    close()
  } catch (e) {
  } finally {
    submitLoading.value = false
  }
}

// 对完暴露
defineExpose({
  open,
  close,
})


</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
