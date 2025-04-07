<template>
  <header class="header">
    <div class="header__container container">
      <div class="header__content">
        <RouterLink v-if="route.name !== 'main'" class="header__logo" to="/main">
          <Icon name="logos/logo" />
        </RouterLink>

        <div v-else class="header__logo">
          <Icon name="logos/logo" />
        </div>

        <nav class="header__navigation">
          <ul class="header__list">
            <li v-for="(item, idx) in navigation" :key="idx" class="header__item">
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
      </div>
    </div>
  </header>
</template>

<script setup>
  import { ref } from 'vue';
  import { useRoute } from 'vue-router';
  import Icon from '@/components/Icon/Icon.vue';

  const route = useRoute();

  const navigation = ref([
    {
      text: 'Главная',
      href: '/main',
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
  ]);
</script>

<style lang="scss" scoped>
  @import 'Header';
</style>
