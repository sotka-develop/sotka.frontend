<template>
  <form class="form-auth" @submit.prevent="emitSubmit">
    <div class="form-auth__container">
      <div class="form-auth__content">
        <h2 v-if="title" class="form-auth__title">{{ title }}</h2>

        <div class="form-auth__fields">
          <div v-for="field in fields" :key="field.name" class="form-auth__field">
            <Input v-bind="field" v-model="formData[field.name]" />
          </div>
        </div>

        <div class="form-auth__actions">
          <div v-for="(action, idx) in actions" :key="idx" class="form-auth__action">
            <Button v-bind="action" />
          </div>
        </div>
      </div>
    </div>
  </form>
</template>

<script setup>
  import { reactive, watch } from 'vue';

  import Input from '@/components/fields/input/Input.vue';
  import Button from '@/components/button/Button.vue';

  const props = defineProps({
    title: {
      type: String,
    },
    fields: {
      type: Array,
    },
    actions: {
      type: Array,
    },
    modelValue: {
      type: Object,
    },
  });

  // реактивный объект для полей формы
  const formData = reactive({ ...props.modelValue });

  // события для родителя
  const emit = defineEmits(['update:modelValue', 'submit']);

  const emitSubmit = () => {
    emit('submit', formData);
  };

  watch(
    () => formData,
    (newVal) => {
      emit('update:modelValue', newVal);
    },
    { deep: true }
  );
</script>

<style lang="scss" scoped>
  @import 'FormAuth';
</style>
