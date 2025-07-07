<template>
  <v-form ref="formRef" class="form-auth" @submit.prevent="emitSubmit">
    <div class="form-auth__container">
      <div class="form-auth__base">
        <div class="form-auth__content">
          <!-- <div class="form-auth__logo">
            <Image v-bind="logoData" />
          </div> -->

          <h2 v-if="title" class="form-auth__title">{{ title }}</h2>

          <div class="form-auth__fields">
            <div v-for="field in fields" :key="field.name" class="form-auth__field">
              <Field v-bind="field" v-model="formData[field.name]" />
            </div>
          </div>

          <div class="form-auth__actions">
            <div v-for="(action, idx) in actions" :key="idx" class="form-auth__action">
              <Button v-bind="{ ...action, fit: true }" />
            </div>
          </div>
        </div>
      </div>

      <div class="form-auth__side">
        <Image v-bind="imageData" />
      </div>
    </div>
  </v-form>
</template>

<script setup>
  import { reactive, ref, watch } from 'vue';

  import Field from '@/components/fields/field/Field.vue';
  import Button from '@/components/button/Button.vue';
  import Image from '@/components/image/Image.vue';

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

  const logoData = {
    src: 'images/logo/logo.png',
    alt: '',
  };

  // события для родителя
  const emit = defineEmits(['update:modelValue', 'submit']);

  const formRef = ref(null);
  // реактивный объект для полей формы
  const formData = reactive({ ...props.modelValue });

  const imageData = {
    src: 'images/formAUth/image-2.jpg',
    alt: '',
  };

  const emitSubmit = async () => {
    const { valid } = await formRef.value.validate(); // валидация формы перед отправкой
    if (!valid) return;

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
