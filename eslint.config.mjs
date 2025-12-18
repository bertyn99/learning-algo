import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true, // Enables formatting for CSS/HTML/JSON
  vue: true,
  typescript: true,
  rules: {
    'no-console': 'off',
    'vue/max-attributes-per-line': ['error', {
      singleline: { max: 5 },
      multiline: { max: 1 }
    }]
  }
})
