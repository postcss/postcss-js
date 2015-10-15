# PostCSS JS [![Build Status][ci-img]][ci]

<img align="right" width="95" height="95"
     title="Philosopher’s stone, logo of PostCSS"
     src="http://postcss.github.io/postcss/logo.svg">

[PostCSS] for React Inline Styles, [Free Style] and other CSS-in-JS.

[Free Style]: https://github.com/blakeembrey/free-style
[PostCSS]:    https://github.com/postcss/postcss
[ci-img]:     https://travis-ci.org/postcss/postcss-js.svg
[ci]:         https://travis-ci.org/postcss/postcss-js

## Usage

### Processing

```js
let prefixer = postcssJs.sync([ autoprefixer ]);

let style = prefixer({
    display: 'flex'
});
```

### Compile CSS-in-JS to CSS

```js
let style = {
    top: 10,
    '&:hover': {
        top: 5
    }
};

postcss().process(style, { parser: postcssJs }).then( (result) => {
    result.css //=> top: 10px;
               //   &:hover { top: 5px; }
})
```
