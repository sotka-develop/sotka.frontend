<template>
  <div class="form-layout">
    <form class="form" @submit.prevent="handleFormSubmit">
      <!-- Форма для ввода email -->
      <div v-if="!isCodeSent">
        <label for="email">Email</label>
        <br />
        <input id="email" name="email" type="text" placeholder="Введите email" v-model="email" />
        <br />
        <br />
        <button type="submit">Отправить код</button>
      </div>

      <!-- Форма для ввода пароля и кода -->
      <div v-else>
        <label for="email">Email</label>
        <br />
        <input id="email" name="email" type="text" v-model="email" :readonly="true" />
        <br />
        <br />
        <label for="password">Пароль</label>
        <br />
        <input id="password" name="password" type="password" placeholder="Введите пароль" v-model="password" />
        <br />
        <br />
        <label for="code">Код</label>
        <br />
        <input id="code" name="code" type="text" placeholder="Введите код из письма" v-model="code" />
        <br />
        <br />
        <button type="submit">Войти</button>
      </div>

      <!-- <button type="button" @click="meMethod">me</button> -->
    </form>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { useAuthStore } from '@/stores/auth';
  import { useRoute, useRouter } from 'vue-router';

  const route = useRoute();
  const router = useRouter();

  const auth = useAuthStore();

  const email = ref('');
  const password = ref('');
  const code = ref('');

  const isCodeSent = ref(auth.isCodeSent);

  // Обработка отправки кода на email
  async function handleSendCode() {
    try {
      await auth.sendCode(email.value);
      isCodeSent.value = true;
      console.log('Код отправлен на почту!');
    } catch (err) {
      console.error('Ошибка при отправке кода:', err);
    }
  }

  // Обработка логина с кодом
  async function handleLogin() {
    try {
      await auth.loginWithCode({
        login: email.value,
        password: password.value,
        code: code.value,
      });
      console.log('Успешный вход!');

      const redirect = route.query.redirect || '/main';
      router.replace(redirect);
    } catch (err) {
      console.error('Ошибка входа:', err);
    }
  }

  async function handleFormSubmit() {
    if (!isCodeSent.value) {
      await handleSendCode();
    } else {
      await handleLogin();
    }
  }

  async function meMethod() {
    try {
      await auth.fetchUserData();

      console.log('me success');
    } catch (err) {
      console.error('me error', err);
    }
  }
</script>

<style lang="scss" scoped>
  .form-layout {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
  }
</style>
