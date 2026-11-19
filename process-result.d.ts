import type { LazyResult } from 'postcss'
import type NoWorkResult from 'postcss/lib/no-work-result'

import type { CssInJs } from './index.js'

declare function processResult(result: LazyResult | NoWorkResult): CssInJs

export = processResult
