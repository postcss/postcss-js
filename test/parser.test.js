var postcss = require('postcss')

var postcssJS = require('../')

it('returns root', function () {
  var root = postcssJS.parse({ color: 'black' })
  expect(root.type).toEqual('root')
})

it('parses declarations', function () {
  var root = postcssJS.parse({ color: 'black', background: 'white' })
  expect(root.toString()).toEqual('color: black;\nbackground: white')
})

it('parses declarations with !important', function () {
  var root = postcssJS.parse({ color: 'black !important', background: 'white' })
  expect(root.first.value).toEqual('black')
  expect(root.first.important).toBeTruthy()
  expect(root.last.important).not.toBeDefined()
})

it('converts camelCase', function () {
  var root = postcssJS.parse({ zIndex: '1' })
  expect(root.toString()).toEqual('z-index: 1')
})

it('converts values to string', function () {
  var root = postcssJS.parse({ zIndex: 1 })
  expect(root.first.value).toEqual('1')
})

it('supports arrays', function () {
  var root = postcssJS.parse({ color: ['black', 'rgba(0,0,0,0.5)'] })
  expect(root.toString()).toEqual('color: black;\ncolor: rgba(0,0,0,0.5)')
})

it('supports arrays in at-rules', function () {
  var root = postcssJS.parse({
    '@font-face': [{ fontFamily: 'A' }, { fontFamily: 'B' }]
  })
  expect(root.toString()).toEqual(
    '@font-face {\n    font-family: A\n}\n' +
        '@font-face {\n    font-family: B\n}')
})

it('ignores declarations with null', function () {
  var root = postcssJS.parse({
    font: undefined,
    color: null,
    background: false
  })
  expect(root.nodes).toHaveLength(0)
})

it('ignores null and undefined', function () {
  var root1 = postcssJS.parse(null)
  expect(root1.toString()).toEqual('')
  var root2 = postcssJS.parse(undefined)
  expect(root2.toString()).toEqual('')
})

it('supports prefixes', function () {
  var root = postcssJS.parse({ MozA: 'one', msA: 'one' })
  expect(root.toString()).toEqual('-moz-a: one;\n-ms-a: one')
})

it('supports cssFloat', function () {
  var root = postcssJS.parse({ cssFloat: 'left' })
  expect(root.toString()).toEqual('float: left')
})

it('adds pixels', function () {
  var root = postcssJS.parse({ a: 2 })
  expect(root.toString()).toEqual('a: 2px')
})

it('miss pixels fot zero', function () {
  var root = postcssJS.parse({ top: 0 })
  expect(root.toString()).toEqual('top: 0')
})

it('parses rules', function () {
  var root = postcssJS.parse({ 'a, b': { color: 'black' } })
  expect(root.toString()).toEqual('a, b {\n    color: black\n}')
})

it('parses at-rules', function () {
  var root = postcssJS.parse({ '@media screen, print': { color: 'black' } })
  expect(root.toString()).toEqual(
    '@media screen, print {\n    color: black\n}')
})

it('parses paramless at-rules', function () {
  var root = postcssJS.parse({ '@media': { color: 'black' } })
  expect(root.first.params).toEqual('')
})

it('supports PostCSS syntax API', function () {
  var result = postcss().process({ color: 'black' }, { parser: postcssJS })
  expect(result.css).toEqual('color: black')
})
