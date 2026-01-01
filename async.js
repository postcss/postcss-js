let postcss = require('postcss')

let parser = require('./parser')
let processResult = require('./process-result')

module.exports = function async(plugins) {
  let processor = postcss(plugins)
  return async input => {
    let result = await processor.process(input, { parser, from: undefined })
    return processResult(result)
  }
}
