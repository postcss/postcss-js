import type { Root } from 'postcss'

import type { CssInJs, ObjectifyOptions as Options } from './index.js'

declare function objectifier(root: Root, options?: Options): CssInJs

declare namespace objectifier {
  export { Options as ObjectifyOptions }
}

export = objectifier
