<template>
  <div class="autocomplete" :class="classList">
    <v-autocomplete
      variant="outlined"
      v-bind="inputProps"
      :model-value="modelValue"
      :items="items"
      :loading="loading"
      :disabled="disabled"
      no-data-text="Ничего не найдено"
      :hide-no-data="hideNoData"
      @update:modelValue="emitUpdate"
      @input="handleInput"
      :menu-props="{ maxWidth: '400' }"
    >
      <template #selection="{ item, index }">
        <div v-if="selectedCount && index === 0">{{ selectedCount }}</div>
      </template>

      <!-- <template #selection="{ item, index }"> -->
      <!-- Всегда отображается первый выбранный элемент -->
      <!-- <div v-if="index === 0" class="autocomplete__item text-body">{{ item.title }}</div> -->

      <!-- Отображается все, если showAll = true и index > 0 -->
      <!-- <div v-else-if="index > 0 && showAll" class="autocomplete__item text-body">
          {{ item.title }}
        </div> -->
      <!-- </template> -->

      <!-- <template #append-inner> -->
      <!-- Если выбрано больше одного элемента и showAll = false -->
      <!-- <button v-if="itemsCount > 1 && !showAll" class="autocomplete__toggle text-body" @click="toggleShowAll">
          {{ counterValue }}
        </button> -->

      <!-- Если showAll = true, то кнопка "Свернуть" -->
      <!-- <button v-if="itemsCount > 1 && showAll" class="autocomplete__toggle text-body" @click="toggleShowAll">
          {{ hideButtonText }}
        </button> -->
      <!-- </template> -->

      <template v-slot:item="{ item, props }">
        <v-list-item v-bind="props" :title="item.name">
          <v-list-item-title :title="item.title">
            <div v-if="multiple" class="autocomplete__checkbox">
              <div class="autocomplete__mark"></div>
            </div>

            {{ item.title }}
          </v-list-item-title>
        </v-list-item>
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
    disabled: {
      type: Boolean,
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
    loading: {
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
    hideNoData: {
      type: Boolean,
      default: false,
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

  const selectedCount = computed(() => {
    if (!props?.modelValue?.length) return null;

    return `Выбрано (${props?.modelValue?.length})`;
  });

  const hideButtonText = 'Свернуть';

  function toggleShowAll() {
    showAll.value = !showAll.value;
  }

  const classList = computed(() => {
    return {
      ['autocomplete--showall']: showAll.value,
      ['autocomplete--hide-no-data']: props.hideNoData,
    };
  });

  const itemsCount = computed(() => {
    if (!props.modelValue) return 0;

    return props.modelValue.length;
  });
</script>

<style lang="scss" scoped>
  @import 'Autocomplete';
</style>
