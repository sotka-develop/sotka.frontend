<template>
  <header class="header header--fixed" ref="headerRef">
    <div class="header__container container">
      <div class="header__content">
        <RouterLink v-if="route.name !== 'main'" class="header__logo" to="/">
          <Icon name="logos/logo" />
        </RouterLink>

        <div v-else class="header__logo">
          <Icon name="logos/logo" />
        </div>

        <nav class="header__navigation">
          <ul class="header__list">
            <li v-for="(item, idx) in navigationData" :key="idx" class="header__item">
              <!-- нет ссылки (disabled) -->
              <span v-if="!item.href" class="header__link text-lead header__link--disabled">
                {{ item.text }}
              </span>

              <!-- текущий раздел -->
              <span v-else-if="item.href === route.path" class="header__link text-lead header__link--active">
                {{ item.text }}
              </span>

              <!-- обычная ссылка -->
              <RouterLink v-else :to="item.href" class="header__link text-lead">
                {{ item.text }}
              </RouterLink>
            </li>
          </ul>
        </nav>

        <!-- <div class="header__actions">
          <div class="header__action">
            <Button v-bind="buttonData" @click="logout" />
          </div>
        </div> -->
      </div>
    </div>
  </header>
</template>

<script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  import { useAuthStore } from '@/stores/auth';
  import { useRoute, useRouter } from 'vue-router';
  import Icon from '@/components/icon/Icon.vue';
  import Button from '@/components/button/Button.vue';

  const route = useRoute();
  const router = useRouter();

  const authStore = useAuthStore();

  const navigationData = [
    {
      text: 'Главная',
      href: '/',
    },
    {
      text: 'ZemlyaPRO',
      href: '',
    },
    {
      text: 'Контакты',
      href: '',
    },
    {
      text: 'Видео',
      href: '',
    },
    {
      text: 'Новости',
      href: '',
    },
    {
      text: 'Прайс',
      href: '',
    },
    {
      text: 'FAQ',
      href: '',
    },
  ];

  const buttonData = {
    text: 'Войти',
    title: 'Войти',
    theme: 'secondary',
  };

  const headerRef = ref(null);

  async function logout() {
    try {
      await authStore.logout();

      const redirect = route.query.redirect || '/login';
      router.replace(redirect);
    } catch (error) {
      console.warn(error);
    }
  }

  let lastScrollY = window.scrollY;

  function handleScroll() {
    const currentScrollY = window.scrollY;
    const isScrollingDown = currentScrollY > lastScrollY;
    const isScrollingUp = currentScrollY < lastScrollY;

    if (!headerRef.value) return;

    if (isScrollingDown && currentScrollY > 25) {
      headerRef.value.classList.add('header--hidden');
    } else if (isScrollingUp) {
      headerRef.value.classList.remove('header--hidden');
    }

    lastScrollY = currentScrollY;
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
  });

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
  });
</script>

<style lang="scss" scoped>
  @import 'Header';
</style>
