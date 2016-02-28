var postcss = require('postcss');

var unitless = {
    'box-flex':          true,
    'box-flex-group':    true,
    'column-count':      true,
    'flex':              true,
    'flex-grow':         true,
    'flex-positive':     true,
    'flex-shrink':       true,
    'flex-negative':     true,
    'font-weight':       true,
    'line-clamp':        true,
    'line-height':       true,
    'opacity':           true,
    'order':             true,
    'orphans':           true,
    'tab-size':          true,
    'widows':            true,
    'z-index':           true,
    'zoom':              true,
    'fill-opacity':      true,
    'stroke-dashoffset': true,
    'stroke-opacity':    true,
    'stroke-width':      true
};

function dashify(str) {
    return str.replace(/([A-Z])/g, '-$1')
              .replace(/^ms-/, '-ms-')
              .toLowerCase();
}

function decl(parent, name, value) {
    if ( value === false || value === null ) return;

    name = dashify(name);
    if ( typeof value === 'number' ) {
        if ( value === 0 || unitless[name] ) {
            value = value.toString();
        } else {
            value += 'px';
        }
    }

    if ( name === 'css-float' ) name = 'float';

    parent.push(postcss.decl({ prop: name, value: value }));
}

function parse(obj, parent) {
    var name, value, node;
    for ( name in obj ) {
        if ( obj.hasOwnProperty(name) ) {
            value = obj[name];
            if ( name[0] === '@' ) {
                var part = name.match(/@([^\s]+)(\s+([\w\W]*)\s*)?/);
                node = postcss.atRule({ name: part[1], params: part[3] || '' });
                if ( typeof value === 'object' ) {
                    node.nodes = [];
                    parse(value, node);
                }
                parent.push(node);
            } else if ( Array.isArray(value) ) {
                for ( var i = 0; i < value.length; i++ ) {
                    decl(parent, name, value[i]);
                }
            } else if ( typeof value === 'object' && value !== null ) {
                node = postcss.rule({ selector: name });
                parse(value, node);
                parent.push(node);
            } else {
                decl(parent, name, value);
            }
        }
    }
}

module.exports = function (obj) {
    var root = postcss.root();
    parse(obj, root);
    return root;
};
