var postcssJS = require('../');

var expect = require('chai').expect;
var parse  = require('postcss').parse;

describe('objectify()', function () {

    it('converts declaration', function () {
        var root = parse('color: black');
        expect(postcssJS.objectify(root)).to.eql({ color: 'black' });
    });

    it('converts declarations to array', function () {
        var root = parse('color: black; color: rgba(0,0,0,.5); color: #000.5;');
        expect(postcssJS.objectify(root)).to.eql({
            color: [
                'black',
                'rgba(0,0,0,.5)',
                '#000.5'
            ]
        });
    });

    it('converts declarations to camel case', function () {
        var root = parse('-webkit-z-index: 1; -ms-z-index: 1; z-index: 1');
        expect(postcssJS.objectify(root)).to.eql({
            WebkitZIndex: '1',
            msZIndex:     '1',
            zIndex:       '1'
        });
    });

    it('ignores comments', function () {
        var root = parse('color: black; /* test */');
        expect(postcssJS.objectify(root)).to.eql({ color: 'black' });
    });

    it('converts rules', function () {
        var root = parse('&:hover { color: black }');
        expect(postcssJS.objectify(root)).to.eql({
            '&:hover': {
                color: 'black'
            }
        });
    });

    it('merge rules', function () {
        var root = parse('div { color:blue } div { padding:5px }');
        expect(postcssJS.objectify(root)).to.eql({
            div: {
                color:   'blue',
                padding: '5px'
            }
        });
    });

    it('converts at-rules', function () {
        var root = parse('@media screen { color: black }');
        expect(postcssJS.objectify(root)).to.eql({
            '@media screen': {
                color: 'black'
            }
        });
    });

    it('converts at-rules without params', function () {
        var root = parse('@media { color: black }');
        expect(postcssJS.objectify(root)).to.eql({
            '@media': {
                color: 'black'
            }
        });
    });

    it('converts at-rules without children', function () {
        var root = parse('@media screen { }');
        expect(postcssJS.objectify(root)).to.eql({
            '@media screen': { }
        });
    });

    it('converts at-rules without body', function () {
        var root = parse('@charset "UTF-8"');
        expect(postcssJS.objectify(root)).to.eql({
            '@charset "UTF-8"': true
        });
    });

});
