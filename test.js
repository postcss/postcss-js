var postcssJS = require('./');

var postcss = require('postcss');
var expect  = require('chai').expect;

describe('postcss-js', function () {

    describe('.parse()', function () {

        it('returns root', function () {
            var root = postcssJS.parse({ color: 'black' });
            expect(root.type).to.eql('root');
        });

        it('parses declarations', function () {
            var root = postcssJS.parse({ color: 'black', background: 'white' });
            expect(root.toString()).to.eql('color: black;\nbackground: white');
        });

        it('converts camelCase', function () {
            var root = postcssJS.parse({ zIndex: '1' });
            expect(root.toString()).to.eql('z-index: 1');
        });

        it('converts values to string', function () {
            var root = postcssJS.parse({ zIndex: 1 });
            expect(root.first.value).to.eql('1');
        });

        it('supports arrays', function () {
            var root = postcssJS.parse({ color: ['black', 'rgba(0,0,0,0.5)'] });
            expect(root.toString()).to.eql(
                'color: black;\ncolor: rgba(0,0,0,0.5)');
        });

        it('ignores declarations with null', function () {
            var root = postcssJS.parse({ color: null, background: false });
            expect(root.nodes).to.be.empty;
        });

        it('ignores declarations with null in array', function () {
            var root = postcssJS.parse({ color: ['black', null, false] });
            expect(root.toString()).to.eql('color: black');
        });

        it('supports prefixes', function () {
            var root = postcssJS.parse({ MozA: 'one', msA: 'one' });
            expect(root.toString()).to.eql('-moz-a: one;\n-ms-a: one');
        });

        it('adds pixels', function () {
            var root = postcssJS.parse({ a: 2 });
            expect(root.toString()).to.eql('a: 2px');
        });

        it('miss pixels fot zero', function () {
            var root = postcssJS.parse({ top: 0 });
            expect(root.toString()).to.eql('top: 0');
        });

        it('parses rules', function () {
            var root = postcssJS.parse({ 'a, b': { color: 'black' } });
            expect(root.toString()).to.eql('a, b {\n    color: black\n}');
        });

        it('parses at-rules', function () {
            var root = postcssJS.parse({
                '@media screen, print': { color: 'black' }
            });
            expect(root.toString()).to.eql(
                '@media screen, print {\n    color: black\n}');
        });

        it('parses paramless at-rules', function () {
            var root = postcssJS.parse({ '@media': { color: 'black' } });
            expect(root.first.params).to.eql('');
        });

        it('parses paramless at-rules', function () {
            var root = postcssJS.parse({ '@media': { color: 'black' } });
            expect(root.first.params).to.eql('');
        });

    });

    it('supports PostCSS syntax API', function () {
        var css    = { color: 'black' };
        var result = postcss().process(css, { parser: postcssJS });
        expect(result.css).to.eql('color: black');
    });

});
