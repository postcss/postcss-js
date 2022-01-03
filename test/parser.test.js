let postcss = require('postcss')

let postcssJS = require('../')

it('returns root', () => {
  let root = postcssJS.parse({ color: 'black' })
  expect(root.type).toEqual('root')
})

it('parses declarations', () => {
  let root = postcssJS.parse({ color: 'black', background: 'white' })
  expect(root.toString()).toEqual('color: black;\nbackground: white')
})

it('parses declarations with !important', () => {
  let root = postcssJS.parse({
    color: 'black !important',
    background: 'white!IMPORTANT  ',
    fontFamily: 'A'
  })
  expect(root.nodes[0].value).toEqual('black')
  expect(root.nodes[0].important).toBe(true)
  expect(root.nodes[1].value).toEqual('white')
  expect(root.nodes[1].important).toBe(true)
  expect(root.nodes[2].important).not.toBeDefined()
})

it('converts camelCase', () => {
  let root = postcssJS.parse({ zIndex: '1' })
  expect(root.toString()).toEqual('z-index: 1')
})

it('converts values to string', () => {
  let root = postcssJS.parse({ zIndex: 1 })
  expect(root.first.value).toEqual('1')
})

it('supports arrays', () => {
  let root = postcssJS.parse({ color: ['black', 'rgba(0,0,0,0.5)'] })
  expect(root.toString()).toEqual('color: black;\ncolor: rgba(0,0,0,0.5)')
})

it('supports arrays in at-rules', () => {
  let root = postcssJS.parse({
    '@font-face': [{ fontFamily: 'A' }, { fontFamily: 'B' }]
  })
  expect(root.toString()).toEqual(
    '@font-face {\n    font-family: A\n}\n' +
      '@font-face {\n    font-family: B\n}'
  )
})

it('ignores declarations with null', () => {
  let root = postcssJS.parse({
    font: undefined,
    color: null,
    background: false
  })
  expect(root.nodes).toHaveLength(0)
})

it('ignores null and undefined', () => {
  let root1 = postcssJS.parse(null)
  expect(root1.toString()).toEqual('')
  let root2 = postcssJS.parse(undefined)
  expect(root2.toString()).toEqual('')
})

it('supports prefixes', () => {
  let root = postcssJS.parse({ MozA: 'one', msA: 'one' })
  expect(root.toString()).toEqual('-moz-a: one;\n-ms-a: one')
})

it('supports cssFloat', () => {
  let root = postcssJS.parse({ cssFloat: 'left' })
  expect(root.toString()).toEqual('float: left')
})

it('adds pixels', () => {
  let root = postcssJS.parse({ a: 2 })
  expect(root.toString()).toEqual('a: 2px')
})

it('miss pixels fot zero', () => {
  let root = postcssJS.parse({ top: 0 })
  expect(root.toString()).toEqual('top: 0')
})

it('parses rules', () => {
  let root = postcssJS.parse({ 'a, b': { color: 'black' } })
  expect(root.toString()).toEqual('a, b {\n    color: black\n}')
})

it('parses at-rules', () => {
  let root = postcssJS.parse({ '@media screen, print': { color: 'black' } })
  expect(root.toString()).toEqual('@media screen, print {\n    color: black\n}')
})

it('parses paramless at-rules', () => {
  let root = postcssJS.parse({ '@media': { color: 'black' } })
  expect(root.first.params).toEqual('')
})

it('supports PostCSS syntax API', () => {
  let result = postcss().process({ color: 'black' }, { parser: postcssJS })
  expect(result.css).toEqual('color: black')
})

it('preseves casing for css variables', () => {
  let root = postcssJS.parse({
    '--testVariable0': '0',
    '--test-Variable-1': '1',
    '--test-variable-2': '2'
  })
  expect(root.toString()).toEqual(
    '--testVariable0: 0;\n--test-Variable-1: 1;\n--test-variable-2: 2'
  )
})
