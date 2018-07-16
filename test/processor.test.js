var postcss = require('postcss')

var postcssJS = require('../')

var doubler = postcss.plugin('test-doubler', function () {
  return function (css) {
    css.each(function (node) { return css.insertBefore(node, node.clone()) })
  }
})

var warner = postcss.plugin('test-warner', function () {
  return function (css, result) { return css.first.warn(result, 'Test') }
})

var warnings, origin

beforeAll(function () {
  origin = console.warn
  console.warn = function (msg) { return warnings.push(msg) }
})

afterAll(function () {
  console.warn = origin
})

beforeEach(function () {
  warnings = []
})

it('processes CSS-in-JS', function () {
  var dbl = postcssJS.sync([doubler])
  expect(dbl({ color: '#000' })).toEqual({ color: ['#000', '#000'] })
})

it('showes warnings', function () {
  var wrn = postcssJS.sync([warner])
  wrn({ color: 'black' })
  expect(warnings).toEqual(['test-warner: Test'])
})

it('converts properties to array', function () {
  var dbl = postcssJS.async([doubler])
  return dbl({ color: 'black' }).then(function (result) {
    expect(result).toEqual({ color: ['black', 'black'] })
  })
})

it('show warnings', function () {
  var wrn = postcssJS.async([warner])
  return wrn({ color: 'black' }).then(function () {
    expect(warnings).toEqual(['test-warner: Test'])
  })
})
