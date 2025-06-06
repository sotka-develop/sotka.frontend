<template>
  <teleport to="body">
    <div class="menu">
      <div class="menu__container container">
        <ul class="menu__list">
          <li v-for="(item, idx) in items" :key="idx" class="menu__item">
            <!-- нет ссылки (disabled) -->
            <span v-if="!item.href" class="menu__link h5 menu__link--disabled">
              {{ item.text }}
            </span>

            <!-- текущий раздел -->
            <span v-else-if="item.href === route.path" class="menu__link h5 menu__link--active">
              {{ item.text }}
            </span>

            <!-- обычная ссылка -->
            <RouterLink v-else :to="item.href" class="menu__link h5">
              {{ item.text }}
            </RouterLink>
          </li>
        </ul>

        <div class="menu__actions">
          <div class="menu__action">
            <Button v-bind="buttonData" @click="logout" />
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
  import { onBeforeUnmount, onMounted } from 'vue';
  import { useAuthStore } from '@/stores/auth';
  import { useRoute, useRouter } from 'vue-router';
  import { disableScroll, enableScroll } from '@/composables/useScrollLock';

  import Button from '@/components/button/Button.vue';

  const route = useRoute();
  const router = useRouter();

  const authStore = useAuthStore();

  const buttonData = {
    text: 'Выйти',
    title: 'Выйти',
    theme: 'secondary',
  };

  const props = defineProps({
    items: {
      type: Array,
    },
  });
  const emit = defineEmits(['close']);

  function close() {
    emit('close');
  }

  function handleResize() {
    if (window.innerWidth >= 1024) {
      enableScroll();
      close();
    }
  }

  async function logout() {
    try {
      await authStore.logout();

      const redirect = route.query.redirect || '/login';
      router.replace(redirect);
    } catch (error) {
      console.warn(error);
    }
  }

  onMounted(() => {
    disableScroll();
    window.addEventListener('resize', handleResize);
  });

  onBeforeUnmount(() => {
    enableScroll();
    window.removeEventListener('resize', handleResize);
  });
</script>

<style lang="scss" scoped>
  @import 'Menu';
</style>
