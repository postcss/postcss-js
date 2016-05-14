import postcss from 'postcss';
import test    from 'ava';

import postcssJS from '../';

test('returns root', t => {
    let root = postcssJS.parse({ color: 'black' });
    t.deepEqual(root.type, 'root');
});

test('parses declarations', t => {
    let root = postcssJS.parse({ color: 'black', background: 'white' });
    t.deepEqual(root.toString(), 'color: black;\nbackground: white');
});

test('converts camelCase', t => {
    let root = postcssJS.parse({ zIndex: '1' });
    t.deepEqual(root.toString(), 'z-index: 1');
});

test('converts values to string', t => {
    let root = postcssJS.parse({ zIndex: 1 });
    t.deepEqual(root.first.value, '1');
});

test('supports arrays', t => {
    let root = postcssJS.parse({ color: ['black', 'rgba(0,0,0,0.5)'] });
    t.deepEqual(root.toString(), 'color: black;\ncolor: rgba(0,0,0,0.5)');
});

test('ignores declarations with null', t => {
    let root = postcssJS.parse({ color: null, background: false });
    t.deepEqual(root.nodes.length, 0);
});

test('ignores declarations with null in array', t => {
    let root = postcssJS.parse({ color: ['black', null, false] });
    t.deepEqual(root.toString(), 'color: black');
});

test('supports prefixes', t => {
    let root = postcssJS.parse({ MozA: 'one', msA: 'one' });
    t.deepEqual(root.toString(), '-moz-a: one;\n-ms-a: one');
});

test('supports cssFloat', t => {
    let root = postcssJS.parse({ cssFloat: 'left' });
    t.deepEqual(root.toString(), 'float: left');
});

test('adds pixels', t => {
    let root = postcssJS.parse({ a: 2 });
    t.deepEqual(root.toString(), 'a: 2px');
});

test('miss pixels fot zero', t => {
    let root = postcssJS.parse({ top: 0 });
    t.deepEqual(root.toString(), 'top: 0');
});

test('parses rules', t => {
    let root = postcssJS.parse({ 'a, b': { color: 'black' } });
    t.deepEqual(root.toString(), 'a, b {\n    color: black\n}');
});

test('parses at-rules', t => {
    let root = postcssJS.parse({ '@media screen, print': { color: 'black' } });
    t.deepEqual(root.toString(), '@media screen, print {\n    color: black\n}');
});

test('parses paramless at-rules', t => {
    let root = postcssJS.parse({ '@media': { color: 'black' } });
    t.deepEqual(root.first.params, '');
});

test('parses paramless at-rules', t => {
    let root = postcssJS.parse({ '@media': { color: 'black' } });
    t.deepEqual(root.first.params, '');
});

test('supports PostCSS syntax API', t => {
    let result = postcss().process({ color: 'black' }, { parser: postcssJS });
    t.deepEqual(result.css, 'color: black');
});
