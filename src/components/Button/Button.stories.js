import Button from './Button.vue';

export default {
  component: Button,
  title: 'Atoms/Button',
  tags: ['autodocs'],

  parameters: {
    docs: {
      description: {
        component: 'Кнопка с иконками, лоадером и выбором темы',
      },
    },
  },

  argTypes: {
    href: { control: 'text', description: 'Ссылка, если кнопка как anchor' },
    title: { control: 'text', description: 'Атрибут title' },
    text: { control: 'text', description: 'Текст кнопки' },
    type: {
      control: { type: 'radio' },
      options: ['button', 'submit'],
      description: 'HTML-тип кнопки',
    },
    theme: {
      control: { type: 'select' },
      options: ['primary', 'secondary'],
      description: 'Цветовая тема',
    },
    loading: { control: 'boolean', description: 'Показать состояние загрузки' },

    hasPrependIcon: {
      control: 'boolean',
      description: 'Показать иконку слева',
    },
    hasAppendIcon: {
      control: 'boolean',
      description: 'Показать иконку справа',
    },
    prependIcon: {
      table: { disable: true },
    },
    appendIcon: {
      table: { disable: true },
    },

    onClick: { action: 'clicked' },
  },

  args: {
    title: 'Кнопка',
    text: 'Кнопка',
    type: 'button',
    theme: 'primary',
    loading: false,
    hasPrependIcon: false,
    hasAppendIcon: false,
  },
};

export const Default = {
  args: {
    text: 'Кнопка',
    title: 'Кнопка',
    theme: 'primary',
    hasPrependIcon: false,
    hasAppendIcon: false,
    loading: false,
  },
};

export const ButtonPrependIcon = {
  args: {
    text: 'Кнопка',
    title: 'Кнопка',
    theme: 'primary',
    hasPrependIcon: false,
    hasAppendIcon: false,
    loading: false,
    prependIcon: '20/eye',
  },
};

export const ButtonAppendIcon = {
  args: {
    text: 'Кнопка',
    title: 'Кнопка',
    theme: 'primary',
    hasPrependIcon: false,
    hasAppendIcon: false,
    loading: false,
    appendIcon: '20/eye',
  },
};
