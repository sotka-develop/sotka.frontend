import Button from './Button.vue';

export default {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    href: { control: 'text' },
    title: { control: 'text' },
    text: { control: 'text' },
    type: { control: 'text' },
    loading: { control: 'boolean' },
    theme: { options: ['primary', 'secondary'], control: 'select' },
    onClick: { action: 'clicked' },
    hasPrependIcon: {
      control: 'boolean',
      description: 'Показать иконку слева',
    },
    hasAppendIcon: {
      control: 'boolean',
      description: 'Показать иконку справа',
    },
    prependIcon: { table: { disable: true } },
    appendIcon: { table: { disable: true } },
  },
  args: {
    title: 'Кнопка',
    text: 'Кнопка',
    type: 'button',
    theme: 'primary',
    loading: false,
  },
};

const Template = (args) => {
  const { hasPrependIcon, hasAppendIcon, ...rest } = args;

  const finalArgs = {
    ...rest,
    prependIcon: hasPrependIcon ? '20/eye' : undefined,
    appendIcon: hasAppendIcon ? '20/eye' : undefined,
  };

  return {
    components: { Button },
    setup() {
      return { args: finalArgs };
    },
    template: `<Button v-bind="args" />`,
  };
};

export const Primary = Template.bind({});

Primary.args = {
  text: 'Кнопка',
  title: 'Кнопка',
  type: 'button',
  theme: 'primary',
  hasPrependIcon: false,
  hasAppendIcon: false,
  loading: false,
};

export const Secondary = Template.bind({});

Secondary.args = {
  text: 'Кнопка',
  title: 'Кнопка',
  type: 'button',
  theme: 'secondary',
  hasPrependIcon: false,
  hasAppendIcon: false,
  loading: false,
};

// export const Primary = {
//   args: {
//     text: 'Показывать',
//     title: 'Показывать',
//     type: 'button',
//     prependIcon: false,
//     appendIcon: false,
//   },
// };

// export const Secondary = {
//   args: {
//     text: 'Показывать',
//     title: 'Показывать',
//     type: 'button',
//     theme: 'secondary',
//     prependIcon: false,
//     appendIcon: false,
//   },
// };
