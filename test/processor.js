import postcss from 'postcss';
import test    from 'ava';

import postcssJS from '../';

let doubler = postcss.plugin('test-doubler', () => {
    return (css) => {
        css.each( node => css.insertBefore(node, node.clone()) );
    };
});

let warner = postcss.plugin('test-warner', () => {
    return (css, result) => css.first.warn(result, 'Test');
});

let warnings, origin;

test.before(() => {
    origin       = console.warn;
    console.warn = msg => warnings.push(msg);
});

test.after(() => {
    console.warn = origin;
});

test.beforeEach(() => {
    warnings = [];
});

test.serial('sync processes CSS-in-JS', t => {
    let dbl = postcssJS.sync([doubler]);
    t.deepEqual(dbl({ color: '#000' }), { color: ['#000', '#000'] });
});

test.serial('sync showes warnings', t => {
    let wrn = postcssJS.sync([warner]);
    wrn({ color: 'black' });
    t.deepEqual(warnings, ['test-warner: Test']);
});

test.serial('async processes CSS-in-JS', t => {
    let dbl = postcssJS.async([doubler]);
    return dbl({ color: 'black' }).then(result => {
        t.deepEqual(result, { color: ['black', 'black'] });
    });
});

test.serial('async show warnings', t => {
    let wrn = postcssJS.async([warner]);
    return wrn({ color: 'black' }).then(() => {
        t.deepEqual(warnings, ['test-warner: Test']);
    });
});
