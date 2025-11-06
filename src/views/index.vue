<template>
  <div class="welcome-container">
    <div class="welcome-content">
      <h1 class="welcome-title">欢迎使用本系统</h1>
      <p class="welcome-desc">高效、优雅、现代化的后台管理平台</p>
    </div>
  </div>
</template>

<script setup>
// ... existing code ...
</script>

<style scoped>
.welcome-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%);
  animation: fadeIn 1.5s;
}

.welcome-content {
  background: rgba(255,255,255,0.85);
  padding: 48px 64px;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(44,62,80,0.15);
  text-align: center;
}

.welcome-title {
  font-size: 2.8rem;
  font-weight: bold;
  color: #2d3a4b;
  margin-bottom: 16px;
  letter-spacing: 2px;
}

.welcome-desc {
  font-size: 1.4rem;
  color: #4e5d6c;
  margin-bottom: 0;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(40px);}
  to { opacity: 1; transform: translateY(0);}
}
</style>
