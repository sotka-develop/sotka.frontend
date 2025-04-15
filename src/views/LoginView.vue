<template>
  <div class="login-view">
    <FormAuth
      :title="isCodeSent ? 'Ввод кода' : 'Авторизация'"
      :fields="formFields"
      :actions="formActions"
      v-model="form"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup>
  import { ref, computed } from 'vue';
  import { useAuthStore } from '@/stores/auth';
  import { useRoute, useRouter } from 'vue-router';
  import FormAuth from '@/components/formAuth/FormAuth.vue';

  const route = useRoute();
  const router = useRouter();
  const auth = useAuthStore();

  const form = ref({
    email: '',
    password: '',
    code: '',
  });

  const isCodeSent = ref(false);

  const formFields = computed(() =>
    isCodeSent.value
      ? [
          { name: 'email', placeholder: 'Email', readonly: true },
          { name: 'password', placeholder: 'Пароль', type: 'password' },
          { name: 'code', placeholder: 'Код' },
        ]
      : [{ name: 'email', placeholder: 'Email' }]
  );

  const formActions = computed(() =>
    isCodeSent.value ? [{ name: 'login', text: 'Войти', type: 'submit' }] : [{ name: 'send_code', text: 'Отправить код', type: 'submit' }]
  );

  async function handleSubmit(formData) {
    if (isCodeSent.value) {
      try {
        await auth.loginWithCode({
          login: formData.email,
          password: formData.password,
          code: formData.code,
        });
        const redirect = route.query.redirect || '/main';
        router.replace(redirect);
      } catch (err) {
        console.error('Ошибка входа:', err);
      }
    } else {
      try {
        await auth.sendCode(formData.email);
        isCodeSent.value = true;
      } catch (err) {
        console.error('Ошибка отправки кода:', err);
      }
    }
  }
</script>
