import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';

export default [
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],

  {
    files: ['**/*.js', '**/*.vue'],
    languageOptions: {
      env: {
        browser: true,
        es2021: true,
      },
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'warn',
      'no-console': 'warn',
      'vue/multi-word-component-names': 'off',
      'vue/require-default-prop': 'off',
      'vue/max-attributes-per-line': 'off',
    },
  },
];
