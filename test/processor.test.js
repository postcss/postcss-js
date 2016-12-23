var postcss = require('postcss');

var postcssJS = require('../');

var doubler = postcss.plugin('test-doubler', () => {
    return (css) => {
        css.each( node => css.insertBefore(node, node.clone()) );
    };
});

var warner = postcss.plugin('test-warner', () => {
    return (css, result) => css.first.warn(result, 'Test');
});

var warnings, origin;

beforeAll(() => {
    origin       = console.warn;
    console.warn = msg => warnings.push(msg);
});

afterAll(() => {
    console.warn = origin;
});

beforeEach(() => {
    warnings = [];
});

it('processes CSS-in-JS', () => {
    var dbl = postcssJS.sync([doubler]);
    expect(dbl({ color: '#000' })).toEqual({ color: ['#000', '#000'] });
});

it('showes warnings', () => {
    var wrn = postcssJS.sync([warner]);
    wrn({ color: 'black' });
    expect(warnings).toEqual(['test-warner: Test']);
});

it('processes CSS-in-JS', () => {
    var dbl = postcssJS.async([doubler]);
    return dbl({ color: 'black' }).then(result => {
        expect(result).toEqual({ color: ['black', 'black'] });
    });
});

it('show warnings', () => {
    var wrn = postcssJS.async([warner]);
    return wrn({ color: 'black' }).then(() => {
        expect(warnings).toEqual(['test-warner: Test']);
    });
});
