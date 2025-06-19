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
  //   isCodeSent.value
  //     ? [
  //         { name: 'email', type: 'text', placeholder: 'Email', readonly: true, rules: [required, emailRule] },
  //         { name: 'password', type: 'text', placeholder: 'Пароль', type: 'password', rules: [required] },
  //         { name: 'code', type: 'text', placeholder: 'Код', rules: [required] },
  //         {
  //           name: 'checkbox1',
  //           type: 'checkbox',
  //           label:
  //             'Я даю согласие на обработку моих персональных данных, указанных в этой веб-форме. А также тех данных, которые будут указаны мной в личном кабинете после регистрации, включая поручения обработки другим лицам, на условиях, изложенных в <a href="https://s0tka.ru/privacy" target="_blank">«Правила защиты информации о пользователях»</a>, с которой я ознакомился.',
  //           rules: [required],
  //         },
  //         {
  //           name: 'checkbox2',
  //           type: 'checkbox',
  //           label: 'Я согласен с <a href="https://s0tka.ru/terms" target="_blank">Правилами пользования Сайтом</a>.',
  //           rules: [required],
  //         },
  //         {
  //           name: 'checkbox3',
  //           type: 'checkbox',
  //           label: 'Я ознакомлен, принимаю <a href="https://s0tka.ru/licence" target="_blank">Лицензионное соглашение</a>.',
  //           rules: [required],
  //         },
  //         {
  //           name: 'checkbox4',
  //           type: 'checkbox',
  //           label:
  //             'Я согласен на получение информационных и маркетинговых рассылок (вы в любой момент можете отказаться от получения писем в личном кабинете)',
  //         },
  //       ]
  //     : [{ name: 'email', type: 'text', placeholder: 'Email', rules: [required, emailRule] }]
  // );

  const formFields = computed(() => {
    if (!isCodeSent.value) {
      return [{ name: 'email', type: 'text', placeholder: 'Email', rules: [required, emailRule] }];
    }

    const baseFields = [
      { name: 'email', type: 'text', placeholder: 'Email', readonly: true, rules: [required, emailRule] },
      { name: 'password', type: 'password', placeholder: 'Пароль', rules: [required] },
      { name: 'code', type: 'text', placeholder: 'Код', rules: [required] },
    ];

    if (!auth.showConsentCheckboxes) {
      return baseFields;
    }

    const consentCheckboxes = [
      {
        name: 'checkbox1',
        type: 'checkbox',
        label:
          'Я даю согласие на обработку моих персональных данных, указанных в этой веб-форме. А также тех данных, которые будут указаны мной в личном кабинете после регистрации, включая поручения обработки другим лицам, на условиях, изложенных в <a href="https://s0tka.ru/privacy" target="_blank">«Правила защиты информации о пользователях»</a>, с которой я ознакомился.',
        rules: [required],
      },
      {
        name: 'checkbox2',
        type: 'checkbox',
        label: 'Я согласен с <a href="https://s0tka.ru/terms" target="_blank">Правилами пользования Сайтом</a>.',
        rules: [required],
      },
      {
        name: 'checkbox3',
        type: 'checkbox',
        label: 'Я ознакомлен, принимаю <a href="https://s0tka.ru/licence" target="_blank">Лицензионное соглашение</a>.',
        rules: [required],
      },
      {
        name: 'checkbox4',
        type: 'checkbox',
        label:
          'Я согласен на получение информационных и маркетинговых рассылок (вы в любой момент можете отказаться от получения писем в личном кабинете)',
      },
    ];

    return [...baseFields, ...consentCheckboxes];
  });

  const formActions = computed(() =>
    isCodeSent.value
      ? [{ name: 'login', type: 'text', text: 'Войти', type: 'submit', loading: isPending.value }]
      : [{ name: 'send_code', type: 'text', text: 'Отправить код', type: 'submit', loading: isPending.value }]
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
        const redirect = route.query.redirect || '/';
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
