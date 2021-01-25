const lex = require('pug-lexer')
const parse = require('pug-parser');
const walk = require('pug-walk')

const classObjParse = (classObjString) => {
    let result = [];

    //remove {} and split entries
    classObjString.trim().slice(1, -1).trim().split(/\s*,\s*/).forEach(e => {
        let [key, val] = e.split(/\s*:\s*/);

        //if key is a string
        key = key.startsWith("'") ? key.slice(1, -1) : key;

        // in case of {var2}
        val = val || key;

        result.push(`{[$style['${key}']] : ${val}}`);
    })

    return result;
}

const transform = (source) => {

    let ast = parse(lex(source))

    ast = walk(ast, (node) => {
        if (node.attrs && node.attrs.length) {
            let classes = [];

            let idAttrVal = '';

            node.attrs.forEach(
                (attr) => {

                    switch (attr.name) {
                        case 'class':

                            //'className'
                            classes.push(`$style[${attr.val}]`)

                            break;

                        case ':class':
                        case 'v-bind:class':

                            //remove quotes "
                            let c = attr.val.slice(1, -1)

                            //[{b: var}, {var2}, 'c', var3]
                            if (c.startsWith('[')) {
                                c.slice(1, -1).trim().split(/\s*,\s*/).forEach(e => {
                                    if (e.startsWith('{')) {
                                        classes = classes.concat(classObjParse(e))
                                    }
                                    else {
                                        classes.push(`$style[${e}]`);
                                    }
                                })
                            }
                            //{class1, class2: var}
                            else if (c.startsWith('{')) {
                                classes = classes.concat(classObjParse(c))
                            }
                            // var, x ? y : z
                            else {
                                classes.push(`$style[${c}]`);
                            }

                            break;

                        case 'id':

                            //'id'
                            idAttrVal = `$style[${attr.val}]`

                            break;

                        case ':id':
                        case 'v-bind:id':

                            //"id" -> remove quotes "
                            idAttrVal = `$style[${attr.val.slice(1, -1)}]`

                            break;

                        default:
                            break;
                    }

                }
            )

            if (classes.length || idAttrVal) {
                let finalAttrs = node.attrs.filter(a => !['class', ':class', 'v-bind:class', 'id', ':id', 'v-bind:id'].includes(a.name));

                if (classes.length) {
                    let resultingClassAttr = (classes.length == 1) ? classes[0] : '[ ' + classes.join(', ') + ' ]';

                    finalAttrs.unshift({
                        name: ':class',
                        val: '"' + resultingClassAttr + '"',
                        mustEscape: true
                    })
                }

                if (idAttrVal) {
                    finalAttrs.unshift({
                        name: ':id',
                        val: '"' + idAttrVal + '"',
                        mustEscape: true
                    })
                }

                node.attrs = finalAttrs;
            }
        }
    })

    return ast;

}

module.exports = { transform }