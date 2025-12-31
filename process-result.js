let objectify = require('./objectifier')

module.exports = function processResult(result) {
  if (console && console.warn) {
    result.warnings().forEach(warn => {
      console.warn((warn.plugin || 'PostCSS') + ': ' + warn.text)
    })
  }
  return objectify(result.root)
}
