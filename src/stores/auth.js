// stores/auth.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null);
  const user = ref(null);
  const isAuthenticated = ref(false);
  const email = ref('');
  const isCodeSent = ref(false);
  const isLoading = ref(false);

  const router = useRouter();

  function setToken(newToken) {
    token.value = newToken;
    localStorage.setItem('token', newToken);
    isAuthenticated.value = true;
  }

  function clearToken() {
    token.value = null;
    localStorage.removeItem('token');
    isAuthenticated.value = false;
  }

  function setUser(userData) {
    user.value = userData;
  }

  async function logout() {
    // const response = await fetch('http://s0tka2.tw1.ru/api/users/logout', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    // });

    // if (!response.ok) {
    //   throw new Error(data.message || 'Ошибка выхода');
    // }

    clearToken();
    user.value = null;

    router.push({ name: 'login' }); // Редирект на /login
  }

  async function sendCode(emailAddress) {
    const res = await fetch('http://s0tka2.tw1.ru/api/users/send_code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailAddress }),
    });

    const data = await res.json();

    if (!res.ok || !data.ok) throw new Error(data.message || 'Ошибка при отправке кода');

    email.value = emailAddress;
    isCodeSent.value = true;
  }

  async function loginWithCode({ login, password, code }) {
    const res = await fetch('http://s0tka2.tw1.ru/api/users/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // credentials: 'include',
      body: JSON.stringify({ email: login, password, code }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Ошибка авторизации');

    if (data.token) setToken(data.token);

    await fetchUserData();
  }

  async function fetchUserData() {
    if (!token.value) throw new Error('Нет токена');

    isLoading.value = true;

    const res = await fetch('http://s0tka2.tw1.ru/api/users/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token.value}`,
      },
      // credentials: 'include',
    });

    if (!res.ok) {
      isLoading.value = false;
      throw new Error('Ошибка загрузки пользователя');
    }

    const data = await res.json();
    setUser(data);
    isAuthenticated.value = true;

    isLoading.value = false;

    router.push({ name: 'home' }); // Редирект на главную страницу
  }

  return {
    token,
    user,
    isAuthenticated,
    email,
    isCodeSent,
    setToken,
    clearToken,
    setUser,
    logout,
    sendCode,
    loginWithCode,
    fetchUserData,
    isLoading,
  };
});
