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
      </div>
    </div>
  </teleport>
</template>

<script setup>
  import { onBeforeUnmount, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { disableScroll, enableScroll } from '@/composables/useScrollLock';

  const route = useRoute();

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
