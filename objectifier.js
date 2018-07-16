var camelcase = require('camelcase-css')

function atRule (node) {
  if (typeof node.nodes === 'undefined') {
    return true
  } else {
    return process(node)
  }
}

function process (node) {
  var name
  var result = { }
  node.each(function (child) {
    var rules = {}
    node.each(function (rule) {
      if (rule.type !== 'rule') {

      } else if (rules[rule.selector]) {
        if (rules[rule.selector].append) {
          rules[rule.selector].append(rule.nodes)
          rule.remove()
        }
      } else {
        rules[rule.selector] = rule
      }
    })

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
      result[child.selector] = process(child)
    } else if (child.type === 'decl') {
      name = camelcase(child.prop)
      child.value = child.important ? child.value + ' !important' : child.value
      if (typeof result[name] === 'undefined') {
        result[name] = child.value
      } else if (Array.isArray(result[name])) {
        result[name].push(child.value)
      } else {
        result[name] = [result[name], child.value]
      }
    }
  })
  return result
}

module.exports = process
