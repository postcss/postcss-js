import { parse } from 'postcss';
import   test    from 'ava';

import postcssJS from '../';

test('converts declaration', t => {
    let root = parse('color: black');
    t.deepEqual(postcssJS.objectify(root), { color: 'black' });
});

test('converts declarations to array', t => {
    let root = parse('color: black; color: rgba(0,0,0,.5); color: #000.5;');
    t.deepEqual(postcssJS.objectify(root), {
        color: [
            'black',
            'rgba(0,0,0,.5)',
            '#000.5'
        ]
    });
});

test('converts declarations to camel case', t => {
    let root = parse('-webkit-z-index: 1; -ms-z-index: 1; z-index: 1');
    t.deepEqual(postcssJS.objectify(root), {
        WebkitZIndex: '1',
        msZIndex:     '1',
        zIndex:       '1'
    });
});

test('ignores comments', t => {
    let root = parse('color: black; /* test */');
    t.deepEqual(postcssJS.objectify(root), { color: 'black' });
});

test('converts rules', t => {
    let root = parse('&:hover { color: black }');
    t.deepEqual(postcssJS.objectify(root), {
        '&:hover': {
            color: 'black'
        }
    });
});

test('merge rules', t => {
    let root = parse('div { color:blue } div { padding:5px }');
    t.deepEqual(postcssJS.objectify(root), {
        div: {
            color:   'blue',
            padding: '5px'
        }
    });
});

test('converts at-rules', t => {
    let root = parse('@media screen { color: black }');
    t.deepEqual(postcssJS.objectify(root), {
        '@media screen': {
            color: 'black'
        }
    });
});

test('converts at-rules without params', t => {
    let root = parse('@media { color: black }');
    t.deepEqual(postcssJS.objectify(root), {
        '@media': {
            color: 'black'
        }
    });
});

test('converts at-rules without children', t => {
    let root = parse('@media screen { }');
    t.deepEqual(postcssJS.objectify(root), {
        '@media screen': { }
    });
});

test('does fall on at-rules in rules merge', t => {
    let root = parse('@media screen { z-index: 1 } z-index: 2');
    t.deepEqual(postcssJS.objectify(root), {
        '@media screen': {
            zIndex: 1
        },
        zIndex: 2
    });
});

test('converts at-rules without body', t => {
    let root = parse('@charset "UTF-8"');
    t.deepEqual(postcssJS.objectify(root), {
        '@charset "UTF-8"': true
    });
});
