<template>
  <div class="login-view">
    <FormAuth title="Добро пожаловать!" :fields="formFields" :actions="formActions" v-model="form" @submit="handleSubmit" />
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

  const isCodeSent = ref(false); // код отправлен, показать вторую форму
  const isPending = ref(false); // ожидаем ответ от сервера

  const required = (v) => !!v || 'Поле обязательно';
  const emailRule = (v) => /.+@.+\..+/.test(v) || 'Введите корректный email';

  const formFields = computed(() =>
    isCodeSent.value
      ? [
          { name: 'email', placeholder: 'Email', readonly: true, rules: [required, emailRule] },
          { name: 'password', placeholder: 'Пароль', type: 'password', rules: [required] },
          { name: 'code', placeholder: 'Код', rules: [required] },
        ]
      : [{ name: 'email', placeholder: 'Email', rules: [required, emailRule] }]
  );

  const formActions = computed(() =>
    isCodeSent.value
      ? [{ name: 'login', text: 'Войти', type: 'submit', loading: isPending.value }]
      : [{ name: 'send_code', text: 'Отправить код', type: 'submit', loading: isPending.value }]
  );

  async function handleSubmit(formData) {
    if (isPending.value) return;

    if (isCodeSent.value) {
      try {
        isPending.value = true;

        await auth.loginWithCode({
          login: formData.email,
          password: formData.password,
          code: formData.code,
        });
        const redirect = route.query.redirect || '/main';
        router.replace(redirect);
      } catch (err) {
        console.error('Ошибка входа:', err);
      } finally {
        isPending.value = false;
      }
    } else {
      try {
        isPending.value = true;

        await auth.sendCode(formData.email);
        isCodeSent.value = true;
      } catch (err) {
        console.error('Ошибка отправки кода:', err);
      } finally {
        isPending.value = false;
      }
    }
  }
</script>
