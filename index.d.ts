// From DefinitelyTyped by Adam Thompson-Sharpe (https://github.com/MysteryBlokHed) with some modifications.
import { AcceptedPlugin, Root } from 'postcss'

declare namespace postcssJs {
  /** CSS-in-JS object */
  type CssInJs = Record<string, any>

  /**
   * Create a PostCSS processor with a simple API
   * @param plugins Synchronous plugins to use with PostCSS
   * @returns A processor function that accepts (idk) and returns a CSS-in-JS object
   */
  function sync(
    plugins?: readonly AcceptedPlugin[]
  ): (input: CssInJs) => CssInJs
  function sync(...plugins: AcceptedPlugin[]): (input: CssInJs) => CssInJs

  /**
   * Create a PostCSS processor with a simple API, allowing asynchronous plugins
   * @param plugins Plugins to use with PostCSS
   * @returns A processor function that accepts (idk) and returns a CSS-in-JS object
   */
  function async(
    plugins?: readonly AcceptedPlugin[]
  ): (input: CssInJs) => Promise<CssInJs>
  function async(
    ...plugins: AcceptedPlugin[]
  ): (input: CssInJs) => Promise<CssInJs>

  /**
   * Parse a CSS-in-JS object into a PostCSS `Root`
   * @param obj The CSS-in-JS to parse
   * @returns A PostCSS `Root`
   */
  function parse(obj: CssInJs): Root

  interface ObjectifyOptions {
    stringifyImportant?: boolean | undefined
  }

  /**
   * Convert a PostCSS `Root` into a CSS-in-JS object
   * @param root The root to convert
   * @returns CSS-in-JS object
   */
  function objectify(root: Root, options?: ObjectifyOptions): CssInJs

  export {
    CssInJs,
    ObjectifyOptions,
    sync,
    async,
    objectify,
    parse,
    postcssJs as default
  }
}

export = postcssJs
