import loguxConfig from '@logux/eslint-config'

export default [
  ...loguxConfig,
  {
    rules: {
      'perfectionist/sort-objects': 'off',
      'no-console': 'off'
    }
  }
]
