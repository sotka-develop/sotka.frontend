// stores/auth.js
import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { toast } from 'vue3-toastify';
import Toast from '@/components/toast/Toast.vue';
import router from '../router';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null);
  const user = ref(null);
  const isAuthenticated = ref(false);
  const isLoading = ref(true);
  const email = ref('');
  const isCodeSent = ref(false);
  const showConsentCheckboxes = ref(false);

  let sessionIntervalId = null;

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

  function setUser(data) {
    user.value = data;
  }

  async function logout() {
    // TODO добавить api/client/logout
    clearToken();
    user.value = null;
  }

  async function fetchUserData() {
    if (!token.value) throw new Error('Нет токена');
    isLoading.value = true;

    const res = await fetch(`${baseUrl}/client/get_current_user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token.value}`,
      },
    });

    if (!res.ok) {
      isLoading.value = false;
      throw new Error('Ошибка загрузки пользователя');
    }

    const data = await res.json();
    setUser(data);
    isAuthenticated.value = true;
    isLoading.value = false;
  }

  async function checkSession() {
    if (!token.value) return;

    try {
      const res = await fetch(`${baseUrl}/general/session`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token.value}`,
        },
      });

      const data = await res.json();

      if (!res.ok || !data.payload || data?.error?.has_error) {
        await logout();

        router.replace({ name: 'login' });

        setTimeout(() => {
          toast(Toast, {
            containerId: 'global',
            type: 'error',
            expandCustomProps: true,
            contentProps: {
              title:
                'Одной учетной записью может пользоваться только один человек. Одновременное использование на нескольких устройствах запрещено. При попытке повторного нарушения - будут введены ограничения вплоть до прекращения работы учетной записи',
            },
            autoClose: false,
            closeOnClick: false,
            draggable: true,
            position: toast.POSITION.BOTTOM_RIGHT,
            transition: 'slide',
          });
        }, 500);
      }
    } catch (e) {
      await logout();

      router.replace({ name: 'login' });

      setTimeout(() => {
        toast(Toast, {
          containerId: 'global',
          type: 'error',
          expandCustomProps: true,
          contentProps: {
            title: 'Сервер недоступен',
          },
          autoClose: false,
          closeOnClick: false,
          draggable: true,
          position: toast.POSITION.BOTTOM_RIGHT,
          transition: 'slide',
        });
      }, 500);
    }
  }

  function startSessionChecker() {
    stopSessionChecker();

    if (!token.value) return;

    sessionIntervalId = setInterval(() => {
      checkSession();
    }, 30000);
  }

  function stopSessionChecker() {
    if (sessionIntervalId) {
      clearInterval(sessionIntervalId);
      sessionIntervalId = null;
    }
  }

  watch(
    token,
    (newVal) => {
      if (newVal) startSessionChecker();
      else stopSessionChecker();
    },
    { immediate: true }
  );

  async function sendCode(emailAddress) {
    const url = new URL(`${baseUrl}/general/auth/send_code`);
    url.searchParams.append('email', emailAddress);

    const res = await fetch(url.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

    const data = await res.json();
    if (!res.ok || !data?.payload?.ok) {
      const warning = data?.warning?.warning;

      const message = warning || data?.error?.error_data?.['exception.detail'] || 'Ошибка при отправке кода';

      toast(Toast, {
        type: warning ? 'warning' : 'error',
        expandCustomProps: true,
        contentProps: {
          title: message,
        },
        autoClose: false,
        closeOnClick: false,
        draggable: true,
        position: toast.POSITION.BOTTOM_RIGHT,
        transition: 'slide',
      });

      throw new Error(message);
    }

    if (data?.payload?.code_sended_to) {
      const code_sended_to = data?.payload?.code_sended_to;

      let message = '';

      if (code_sended_to === 'tg') {
        message = 'На ваш Telegram отправлен код';
      } else if (code_sended_to === 'email') {
        message = 'На ваш электроный адрес отправлен пароль';
      }

      if (message) {
        toast(Toast, {
          type: 'success',
          expandCustomProps: true,
          contentProps: {
            title: message,
          },
          autoClose: false,
          closeOnClick: false,
          draggable: true,
          position: toast.POSITION.BOTTOM_RIGHT,
          transition: 'slide',
        });
      }
    }

    showConsentCheckboxes.value = data.payload.show_consent_checkboxes;

    email.value = emailAddress;
    isCodeSent.value = true;
  }

  async function loginWithCode({ login, password, code }) {
    const res = await fetch(`${baseUrl}/general/auth/register_or_authenticate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: login, password, code }),
    });

    const data = await res.json();

    if (!res.ok) {
      const message = data?.error?.error_data?.['exception.detail'] || 'Ошибка авторизации';

      toast(Toast, {
        type: 'error',
        expandCustomProps: true,
        contentProps: {
          title: message,
        },
        autoClose: false,
        closeOnClick: false,
        draggable: true,
        position: toast.POSITION.BOTTOM_RIGHT,
        transition: 'slide',
      });

      throw new Error(message);
    }

    if (data?.payload?.token) setToken(data.payload.token);

    await fetchUserData();
  }

  return {
    token,
    user,
    isAuthenticated,
    isLoading,
    email,
    isCodeSent,
    setToken,
    clearToken,
    setUser,
    logout,
    sendCode,
    loginWithCode,
    fetchUserData,
    showConsentCheckboxes,
    checkSession,
  };
});
