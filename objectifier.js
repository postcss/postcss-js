let UNITLESS = {
  boxFlex: true,
  boxFlexGroup: true,
  columnCount: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,
  fillOpacity: true,
  strokeDashoffset: true,
  strokeOpacity: true,
  strokeWidth: true
}

function atRule(node) {
  return node.nodes === undefined ? true : process(node)
}

// From https://github.com/hyperz111/fast-camelcase-css
function camelcase(property) {
  property = property.toLowerCase()

  if (property === 'float') return 'cssFloat'

  let index = property.indexOf('-')
  // Early return if don't have a dash
  if (index === -1) return property

  // Microsoft vendor-prefixes are uniquely cased
  if (property.startsWith('-ms-')) {
    property = property.slice(1)
    index = property.indexOf('-')
  }

  let cursor = 0
  let result = ''

  do {
    result += property.slice(cursor, index) + property[index + 1].toUpperCase()
    cursor = index + 2
    index = property.indexOf('-', cursor)
  } while (index !== -1)

  return result + property.slice(cursor)
}

function process(node, options = {}) {
  let name
  let result = {}

  node.each(child => {
    if (child.type === 'atrule') {
      name = '@' + child.name
      if (child.params) name += ' ' + child.params
      if (typeof result[name] === 'undefined') {
        result[name] = atRule(child)
      } else if (Array.isArray(result[name])) {
        result[name].push(atRule(child))
      } else {
        result[name] = [result[name], atRule(child)]
      }
    } else if (child.type === 'rule') {
      let body = process(child)
      if (result[child.selector]) {
        for (let i in body) {
          let object = result[child.selector]
          if (
            options.stringifyImportant &&
            typeof object[i] === 'string' &&
            object[i].endsWith('!important')
          ) {
            if (typeof body[i] === 'string' && body[i].endsWith('!important')) {
              object[i] = body[i]
            }
          } else {
            object[i] = body[i]
          }
        }
      } else {
        result[child.selector] = body
      }
    } else if (child.type === 'decl') {
      if (child.prop.startsWith('--')) {
        name = child.prop
      } else if (child.parent && child.parent.selector === ':export') {
        name = child.prop
      } else {
        name = camelcase(child.prop)
      }
      let value = child.value
      if (!isNaN(child.value) && UNITLESS[name]) value = parseFloat(child.value)
      if (child.important) value += ' !important'
      if (typeof result[name] === 'undefined') {
        result[name] = value
      } else if (Array.isArray(result[name])) {
        result[name].push(value)
      } else {
        result[name] = [result[name], value]
      }
    }
  })
  return result
}

module.exports = process
