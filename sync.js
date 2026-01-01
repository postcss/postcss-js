let postcss = require('postcss')

let parser = require('./parser')
let processResult = require('./process-result')

module.exports = function (plugins) {
  let processor = postcss(plugins)
  return input => {
    let result = processor.process(input, { parser, from: undefined })
    return processResult(result)
  }
}
