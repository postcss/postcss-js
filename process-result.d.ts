import { CssInJs } from './index.js'
import { LazyResult } from 'postcss'
import NoWorkResult from 'postcss/lib/no-work-result'

declare function processResult(result: LazyResult | NoWorkResult): CssInJs

export = processResult
