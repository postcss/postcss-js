let postcssJS = require('../')

let doubler = () => ({
  postcssPlugin: 'test-doubler',
  Once (root) {
    root.each(node => root.insertBefore(node, node.clone()))
  }
})
doubler.postcss = true

let warner = () => ({
  postcssPlugin: 'test-warner',
  Once (root, { result }) {
    return root.first.warn(result, 'Test')
  }
})
warner.postcss = true

let warnings, origin

beforeAll(() => {
  origin = console.warn
  console.warn = msg => {
    warnings.push(msg)
  }
})

afterAll(() => {
  console.warn = origin
})

beforeEach(() => {
  warnings = []
})

it('processes CSS-in-JS', () => {
  let dbl = postcssJS.sync([doubler])
  expect(dbl({ color: '#000' })).toEqual({ color: ['#000', '#000'] })
})

it('showes warnings', () => {
  let wrn = postcssJS.sync([warner])
  wrn({ color: 'black' })
  expect(warnings).toEqual(['test-warner: Test'])
})

it('converts properties to array', () => {
  let dbl = postcssJS.async([doubler])
  return dbl({ color: 'black' }).then(result => {
    expect(result).toEqual({ color: ['black', 'black'] })
  })
})

it('show warnings', () => {
  let wrn = postcssJS.async([warner])
  return wrn({ color: 'black' }).then(() => {
    expect(warnings).toEqual(['test-warner: Test'])
  })
})
