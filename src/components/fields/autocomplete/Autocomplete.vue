<template>
  <div class="autocomplete">
    <v-autocomplete
      variant="outlined"
      v-bind="inputProps"
      :model-value="modelValue"
      :items="items"
      @update:modelValue="emitUpdate"
      @input="handleInput"
    >
      <template #selection="{ item, index, props }">
        <!-- Всегда отображается первый выбранный элемент -->
        <div v-if="index === 0" class="autocomplete__item text-body">{{ item.title }}</div>

        <!-- Если выбрано больше одного элемента и showAll = false -->
        <button v-else-if="index === 1 && !showAll" class="autocomplete__toggle text-body" @click="toggleShowAll">
          {{ counterValue }}
        </button>

        <!-- Отображается все, если showAll = true и index > 0 -->
        <div v-else-if="index > 0 && showAll" class="autocomplete__toggle text-body">
          {{ item.title }}
        </div>

        <!-- Если showAll = true, то кнопка "Свернуть" -->
        <button v-if="index === modelValue.length - 1 && showAll" class="autocomplete__toggle text-body" @click="toggleShowAll">
          {{ hideButtonText }}
        </button>
      </template>
    </v-autocomplete>
  </div>
</template>

<script setup>
  import { computed, ref } from 'vue';

  const props = defineProps({
    label: {
      type: String,
    },
    placeholder: {
      type: String,
    },
    items: {
      type: Array,
      default: () => [],
    },
    modelValue: {
      type: [String, Number, Object, Array],
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    hideDetails: {
      type: Boolean,
    },
    returnObject: {
      type: Boolean,
      default: false,
    },
    itemTitle: {
      type: String,
      default: 'text',
    },
    itemValue: {
      type: String,
      default: 'value',
    },
    rules: {
      type: Array,
      default: () => [],
    },
    errorMessages: {
      type: Array,
      default: () => [],
    },
    onInput: Function,
  });

  const emit = defineEmits(['update:modelValue']);

  function emitUpdate(val) {
    emit('update:modelValue', val);
  }

  function handleInput(val) {
    if (props.onInput) {
      props.onInput(val);
    }
  }

  const inputProps = computed(() => ({
    label: props.label,
    placeholder: props.placeholder,
    readonly: props.readonly,
    multiple: props.multiple,
    returnObject: props.returnObject,
    itemTitle: props.itemTitle,
    itemValue: props.itemValue,
    rules: props.rules,
    hideDetails: props.hideDetails,
    errorMessages: props.errorMessages,
  }));

  const showAll = ref(false);

  const counterValue = computed(() => {
    return `+${(props?.modelValue?.length || 0) - 1}`;
  });

  const hideButtonText = 'Свернуть';

  function toggleShowAll() {
    showAll.value = !showAll.value;
  }
</script>

<style lang="scss" scoped>
  @import 'Autocomplete';
</style>
