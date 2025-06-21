<template>
  <component v-if="isLocal && IconComponent" :is="IconComponent" class="icon" />

  <div v-else class="icon" v-html="svgContent" />
</template>

<script setup>
  import { defineAsyncComponent, computed, ref, watchEffect } from 'vue';

  // Импорт всех локальных SVG-компонентов
  const icons = import.meta.glob('@/assets/icons/**/*.svg', { query: '?component', eager: false });

  const props = defineProps({
    name: {
      type: String,
      required: true,
    },
  });

  // Проверка: является ли иконка локальной
  const isLocal = computed(() => props.name.includes('/'));

  // 🔹 Локальная SVG-компонента
  const IconComponent = computed(() => {
    if (!isLocal.value) return null;

    const [size, iconNameWithExt] = props.name.split('/');
    const iconName = iconNameWithExt.replace(/\.svg$/, '');
    const path = `/src/assets/icons/${size}/${iconName}.svg`;
    const loader = icons[path];

    if (!loader) {
      console.warn(`Локальная иконка "${iconName}" по пути ${path} не найдена!`);
      return null;
    }

    return defineAsyncComponent(loader);
  });

  // 🔸 Внешняя SVG как строка
  const svgContent = ref('');

  watchEffect(async () => {
    if (isLocal.value) {
      svgContent.value = '';
      return;
    }

    const iconPath = `${window.location.origin}/rubrics/${props.name}.svg`;

    try {
      const res = await fetch(iconPath);
      const svg = await res.text();
      if (svg.trim().startsWith('<svg')) {
        svgContent.value = svg;
      } else {
        console.warn(`Файл по пути ${iconPath} не является SVG`);
      }
    } catch (err) {
      console.warn(`Не удалось загрузить внешнюю SVG ${iconPath}:`, err);
    }
  });
</script>

<style lang="scss">
  @import 'Icon';
</style>
