let { deepEqual } = require('node:assert/strict')
let { test } = require('node:test')
let { parse } = require('postcss')

let postcssJS = require('../')

test('converts declaration', () => {
  let root = parse('color: black')
  deepEqual(postcssJS.objectify(root), { color: 'black' })
})

test('converts declarations to array', () => {
  let root = parse('color: black; color: rgba(0,0,0,.5); color: #000.5;')
  deepEqual(postcssJS.objectify(root), {
    color: ['black', 'rgba(0,0,0,.5)', '#000.5']
  })
})

test('converts at-rules to array', () => {
  let root = parse(
    '@font-face { font-family: A }' +
      '@font-face { font-family: B }' +
      '@font-face { font-family: C }'
  )
  deepEqual(postcssJS.objectify(root), {
    '@font-face': [
      { fontFamily: 'A' },
      { fontFamily: 'B' },
      { fontFamily: 'C' }
    ]
  })
})

test('converts declarations to camel case', () => {
  let root = parse('-webkit-z-index: 1; -ms-z-index: 1; z-index: 1')
  deepEqual(postcssJS.objectify(root), {
    WebkitZIndex: '1',
    msZIndex: '1',
    zIndex: 1
  })
})

test('preserves case for sass exported variables', () => {
  let root = parse(
    ':export { caseSensitiveOne: 1px }' +
      ':export { caseSensitiveTwo: 2px }' +
      ':export { caseSensitiveThree: 3px }'
  )
  deepEqual(postcssJS.objectify(root), {
    ':export': {
      caseSensitiveOne: '1px',
      caseSensitiveTwo: '2px',
      caseSensitiveThree: '3px'
    }
  })
})

test('maintains !important declarations', () => {
  let root = parse('margin-bottom: 0 !important')
  deepEqual(postcssJS.objectify(root), {
    marginBottom: '0 !important'
  })
})

test('ignores comments', () => {
  let root = parse('color: black; /* test */')
  deepEqual(postcssJS.objectify(root), { color: 'black' })
})

test('converts rules', () => {
  let root = parse('&:hover { color: black }')
  deepEqual(postcssJS.objectify(root), {
    '&:hover': {
      color: 'black'
    }
  })
})

test('merge rules', () => {
  let root = parse('div { color:blue } div { padding:5px }')
  deepEqual(postcssJS.objectify(root), {
    div: {
      color: 'blue',
      padding: '5px'
    }
  })
})

test('converts at-rules', () => {
  let root = parse('@media screen { color: black }')
  deepEqual(postcssJS.objectify(root), {
    '@media screen': {
      color: 'black'
    }
  })
})

test('converts at-rules without params', () => {
  let root = parse('@media { color: black }')
  deepEqual(postcssJS.objectify(root), {
    '@media': {
      color: 'black'
    }
  })
})

test('converts at-rules without children', () => {
  let root = parse('@media screen { }')
  deepEqual(postcssJS.objectify(root), {
    '@media screen': {}
  })
})

test('does fall on at-rules in rules merge', () => {
  let root = parse('@media screen { z-index: 1 } z-index: 2')
  deepEqual(postcssJS.objectify(root), {
    '@media screen': {
      zIndex: 1
    },
    'zIndex': 2
  })
})

test('converts at-rules without body', () => {
  let root = parse('@charset "UTF-8"')
  deepEqual(postcssJS.objectify(root), { '@charset "UTF-8"': true })
})

test('handles mixed case properties', () => {
  let root = parse('COLOR: green; -WEBKIT-border-radius: 6px')
  deepEqual(postcssJS.objectify(root), {
    color: 'green',
    WebkitBorderRadius: '6px'
  })
})

test("doesn't convert css variables", () => {
  let root = parse('--test-variable: 0;')
  deepEqual(postcssJS.objectify(root), { '--test-variable': '0' })
})

test('converts unitless value to number instead of string', () => {
  let root = parse('z-index: 100; opacity: .1;')
  deepEqual(postcssJS.objectify(root), {
    zIndex: 100,
    opacity: 0.1
  })
})

test('merges rules ignoring important', () => {
  let root = parse('a { height: 1px !important; };a { height: 2px }')
  deepEqual(postcssJS.objectify(root), {
    a: {
      height: '2px'
    }
  })
})

test('keeps last important in merge', () => {
  let root = parse(
    'a { height: 1px !important; };a { height: 2px !important; }'
  )
  deepEqual(postcssJS.objectify(root), {
    a: {
      height: '2px !important'
    }
  })
})

test('prioritizes important in merge', () => {
  let root = parse('a { height: 1px !important; };a { height: 2px }')
  deepEqual(postcssJS.objectify(root, { stringifyImportant: true }), {
    a: {
      height: '1px !important'
    }
  })
})

test('keeps last important with priority', () => {
  let root = parse(
    'a { height: 1px !important; };a { height: 2px !important; }'
  )
  deepEqual(postcssJS.objectify(root, { stringifyImportant: true }), {
    a: {
      height: '2px !important'
    }
  })
})

test('keeps last important with priority', () => {
  let root = parse(
    'a { vertical-align: 2px center; };a { vertical-align: 1px center; }'
  )
  deepEqual(postcssJS.objectify(root, { stringifyImportant: true }), {
    a: {
      verticalAlign: '1px center'
    }
  })
})

test('keeps last important with priority', () => {
  let root = parse(
    'a { vertical-align: 2px center !important; };a { vertical-align: 1px center; }'
  )
  deepEqual(postcssJS.objectify(root, { stringifyImportant: true }), {
    a: {
      verticalAlign: '2px center !important'
    }
  })
})

test('merges nested rules in merged rules', () => {
  let root = parse(
    '.btn { color: red; &:hover { color: blue; padding: 1px } } ' +
      '.btn { &:hover { margin: 0 } }'
  )
  deepEqual(postcssJS.objectify(root), {
    '.btn': {
      'color': 'red',
      '&:hover': { color: 'blue', padding: '1px', margin: '0' }
    }
  })
})

test('merges nested at-rules in merged rules', () => {
  let root = parse(
    'a { @media print { color: red; b { c: d } } } ' +
      'a { @media print { margin: 0; b { e: f } } }'
  )
  deepEqual(postcssJS.objectify(root), {
    a: {
      '@media print': { color: 'red', margin: '0', b: { c: 'd', e: 'f' } }
    }
  })
})
