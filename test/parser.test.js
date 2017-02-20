var postcss = require('postcss');

var postcssJS = require('../');

it('returns root', () => {
    var root = postcssJS.parse({ color: 'black' });
    expect(root.type).toEqual('root');
});

it('parses declarations', () => {
    var root = postcssJS.parse({ color: 'black', background: 'white' });
    expect(root.toString()).toEqual('color: black;\nbackground: white');
});

it('converts camelCase', () => {
    var root = postcssJS.parse({ zIndex: '1' });
    expect(root.toString()).toEqual('z-index: 1');
});

it('converts values to string', () => {
    var root = postcssJS.parse({ zIndex: 1 });
    expect(root.first.value).toEqual('1');
});

it('supports arrays', () => {
    var root = postcssJS.parse({ color: ['black', 'rgba(0,0,0,0.5)'] });
    expect(root.toString()).toEqual('color: black;\ncolor: rgba(0,0,0,0.5)');
});

it('supports arrays in at-rules', () => {
    var root = postcssJS.parse({
        '@font-face': [{ fontFamily: 'A' }, { fontFamily: 'B' }]
    });
    expect(root.toString()).toEqual(
        '@font-face {\n    font-family: A\n}\n' +
        '@font-face {\n    font-family: B\n}');
});

it('ignores declarations with null', () => {
    var root = postcssJS.parse({ color: null, background: false });
    expect(root.nodes.length).toEqual(0);
});

it('ignores declarations with null in array', () => {
    var root = postcssJS.parse({ color: ['black', null, false] });
    expect(root.toString()).toEqual('color: black');
});

it('supports prefixes', () => {
    var root = postcssJS.parse({ MozA: 'one', msA: 'one' });
    expect(root.toString()).toEqual('-moz-a: one;\n-ms-a: one');
});

it('supports cssFloat', () => {
    var root = postcssJS.parse({ cssFloat: 'left' });
    expect(root.toString()).toEqual('float: left');
});

it('adds pixels', () => {
    var root = postcssJS.parse({ a: 2 });
    expect(root.toString()).toEqual('a: 2px');
});

it('miss pixels fot zero', () => {
    var root = postcssJS.parse({ top: 0 });
    expect(root.toString()).toEqual('top: 0');
});

it('parses rules', () => {
    var root = postcssJS.parse({ 'a, b': { color: 'black' } });
    expect(root.toString()).toEqual('a, b {\n    color: black\n}');
});

it('parses at-rules', () => {
    var root = postcssJS.parse({ '@media screen, print': { color: 'black' } });
    expect(root.toString()).toEqual(
        '@media screen, print {\n    color: black\n}');
});

it('parses paramless at-rules', () => {
    var root = postcssJS.parse({ '@media': { color: 'black' } });
    expect(root.first.params).toEqual('');
});

it('parses paramless at-rules', () => {
    var root = postcssJS.parse({ '@media': { color: 'black' } });
    expect(root.first.params).toEqual('');
});

it('supports PostCSS syntax API', () => {
    var result = postcss().process({ color: 'black' }, { parser: postcssJS });
    expect(result.css).toEqual('color: black');
});
