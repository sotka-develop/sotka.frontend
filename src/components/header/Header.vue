<template>
  <header class="header header--fixed" ref="headerRef">
    <div class="header__container container">
      <div class="header__content">
        <RouterLink v-if="route.name !== 'main'" class="header__logo" to="/">
          <Image v-bind="logoData" />
        </RouterLink>

        <div v-else class="header__logo">
          <Image v-bind="logoData" />
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

        <button type="button" class="header__toggle" @click="toggleMenu">
          <Icon v-if="isMenuOpen" name="24/menu-close" />
          <Icon v-else name="24/menu" />
        </button>
      </div>
    </div>

    <Menu :items="navigationData" v-if="isMenuOpen" @close="isMenuOpen = false" />
  </header>
</template>

<script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  import { useAuthStore } from '@/stores/auth';
  import { useRoute, useRouter } from 'vue-router';
  import Image from '@/components/image/Image.vue';
  import Button from '@/components/button/Button.vue';
  import Menu from '@/components/menu/Menu.vue';
  import Icon from '@/components/icon/Icon.vue';

  const logoData = {
    src: 'images/logo/logo.png',
    alt: '',
  };

  const route = useRoute();
  const router = useRouter();

  const authStore = useAuthStore();

  const navigationData = [
    {
      text: 'Главная',
      href: '/',
    },
    {
      text: 'Вопросы',
      href: '/questions',
    },
    {
      text: 'Видео',
      href: '/video',
    },
    {
      text: 'Тарифы',
      href: '/tariffs',
    },
    {
      text: 'Контакты',
      href: '/contacts',
    },
  ];

  const buttonData = {
    text: 'Войти',
    title: 'Войти',
    theme: 'secondary',
  };

  const isMenuOpen = ref(false);
  const toggleMenu = () => (isMenuOpen.value = !isMenuOpen.value);

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
