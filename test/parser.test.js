let postcss = require('postcss')
let { test } = require('uvu')
let { equal, type, is } = require('uvu/assert')

let postcssJS = require('../')

test('returns root', () => {
  let root = postcssJS.parse({ color: 'black' })
  equal(root.type, 'root')
})

test('parses declarations', () => {
  let root = postcssJS.parse({ color: 'black', background: 'white' })
  equal(root.toString(), 'color: black;\nbackground: white')
})

test('parses declarations with !important', () => {
  let root = postcssJS.parse({
    color: 'black !important',
    background: 'white!IMPORTANT  ',
    fontFamily: 'A'
  })
  equal(root.nodes[0].value, 'black')
  is(root.nodes[0].important, true)
  equal(root.nodes[1].value, 'white')
  is(root.nodes[1].important, true)
  type(root.nodes[2].important, 'undefined')
})

test('converts camelCase', () => {
  let root = postcssJS.parse({ zIndex: '1' })
  equal(root.toString(), 'z-index: 1')
})

test('converts values to string', () => {
  let root = postcssJS.parse({ zIndex: 1 })
  equal(root.first.value, '1')
})

test('supports arrays', () => {
  let root = postcssJS.parse({ color: ['black', 'rgba(0,0,0,0.5)'] })
  equal(root.toString(), 'color: black;\ncolor: rgba(0,0,0,0.5)')
})

test('supports arrays in at-rules', () => {
  let root = postcssJS.parse({
    '@font-face': [{ fontFamily: 'A' }, { fontFamily: 'B' }]
  })
  equal(
    root.toString(),
    '@font-face {\n    font-family: A\n}\n' +
      '@font-face {\n    font-family: B\n}'
  )
})

test('ignores declarations with null', () => {
  let root = postcssJS.parse({
    font: undefined,
    color: null,
    background: false
  })
  equal(root.nodes.length, 0)
})

test('ignores null and undefined', () => {
  let root1 = postcssJS.parse(null)
  equal(root1.toString(), '')
  let root2 = postcssJS.parse(undefined)
  equal(root2.toString(), '')
})

test('supports prefixes', () => {
  let root = postcssJS.parse({ MozA: 'one', msA: 'one' })
  equal(root.toString(), '-moz-a: one;\n-ms-a: one')
})

test('supports cssFloat', () => {
  let root = postcssJS.parse({ cssFloat: 'left' })
  equal(root.toString(), 'float: left')
})

test('adds pixels', () => {
  let root = postcssJS.parse({ a: 2 })
  equal(root.toString(), 'a: 2px')
})

test('miss pixels fot zero', () => {
  let root = postcssJS.parse({ top: 0 })
  equal(root.toString(), 'top: 0')
})

test('parses rules', () => {
  let root = postcssJS.parse({ 'a, b': { color: 'black' } })
  equal(root.toString(), 'a, b {\n    color: black\n}')
})

test('parses at-rules', () => {
  let root = postcssJS.parse({ '@media screen, print': { color: 'black' } })
  equal(root.toString(), '@media screen, print {\n    color: black\n}')
})

test('parses paramless at-rules', () => {
  let root = postcssJS.parse({ '@media': { color: 'black' } })
  equal(root.first.params, '')
})

test('supports PostCSS syntax API', () => {
  let result = postcss().process({ color: 'black' }, { parser: postcssJS })
  equal(result.css, 'color: black')
})

test('preseves casing for css variables', () => {
  let root = postcssJS.parse({
    '--testVariable0': '0',
    '--test-Variable-1': '1',
    '--test-variable-2': '2'
  })
  equal(
    root.toString(),
    '--testVariable0: 0;\n--test-Variable-1: 1;\n--test-variable-2: 2'
  )
})

test.run()
