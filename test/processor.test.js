let { equal } = require('uvu/assert')
let { test } = require('uvu')

let postcssJS = require('../')

let doubler = () => ({
  postcssPlugin: 'test-doubler',
  Once(root) {
    root.each(node => root.insertBefore(node, node.clone()))
  }
})
doubler.postcss = true

let warner = () => ({
  postcssPlugin: 'test-warner',
  Once(root, { result }) {
    return root.first.warn(result, 'Test')
  }
})
warner.postcss = true

let warnings, origin

test.before(() => {
  origin = console.warn
  console.warn = msg => {
    warnings.push(msg)
  }
})

test.before.each(() => {
  warnings = []
})

test.after(() => {
  console.warn = origin
})

test('processes CSS-in-JS', () => {
  let dbl = postcssJS.sync([doubler])
  equal(dbl({ color: '#000' }), { color: ['#000', '#000'] })
})

test('showes warnings', () => {
  let wrn = postcssJS.sync([warner])
  wrn({ color: 'black' })
  equal(warnings, ['test-warner: Test'])
})

test('converts properties to array', () => {
  let dbl = postcssJS.async([doubler])
  return dbl({ color: 'black' }).then(result => {
    equal(result, { color: ['black', 'black'] })
  })
})

test('show warnings', () => {
  let wrn = postcssJS.async([warner])
  return wrn({ color: 'black' }).then(() => {
    equal(warnings, ['test-warner: Test'])
  })
})

test.run()
