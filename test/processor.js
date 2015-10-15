var postcssJS = require('../');

var postcss = require('postcss');
var expect  = require('chai').expect;

var doubler = postcss.plugin('test-doubler', function () {
    return function (css) {
        css.each(function (node) {
            css.insertBefore(node, node.clone());
        });
    };
});

var warner = postcss.plugin('test-warner', function () {
    return function (css, result) {
        css.first.warn(result, 'Test');
    };
});

describe('processors', function () {
    var warnings, origin;

    before(function () {
        origin   = console.warn;
        console.warn = function (msg) {
            warnings.push(msg);
        };
    });

    after(function () {
        console.warn = origin;
    });

    beforeEach(function () {
        warnings = [];
    });

    describe('sync()', function () {

        it('processes CSS-in-JS', function () {
            var dbl = postcssJS.sync([doubler]);
            expect(dbl({ color: '#000' })).to.eql({ color: ['#000', '#000'] });
        });

        it('show warnings', function () {
            var wrn = postcssJS.sync([warner]);
            wrn({ color: 'black' });
            expect(warnings).to.eql(['test-warner: Test']);
        });

    });

    describe('async()', function () {

        it('processes CSS-in-JS', function (done) {
            var dbl = postcssJS.async([doubler]);
            dbl({ color: 'black' }).then(function (result) {
                expect(result).to.eql({ color: ['black', 'black'] });
                done();
            });
        });

        it('show warnings', function (done) {
            var wrn = postcssJS.async([warner]);
            wrn({ color: 'black' }).then(function () {
                expect(warnings).to.eql(['test-warner: Test']);
                done();
            });
        });

    });

});
