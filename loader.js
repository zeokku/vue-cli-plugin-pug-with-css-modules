const lex = require('pug-lexer')
const parse = require('pug-parser');
const walk = require('pug-walk')
const generateCode = require('pug-code-gen');
const wrap = require('pug-runtime/wrap')

const { getOptions } = require('loader-utils')

module.exports = function (source) {
    if (this.debug) {
        console.log(this.resourcePath)
    }

    const options = Object.assign({
        //filename: this.resourcePath,
        doctype: 'html',
        compileDebug: this.debug || false
    }, getOptions(this))

    let ast = parse(lex(source))

    const classObjParse = (c) => {
        let result = [];

        //remove {} and split entries
        c.trim().slice(1, -1).trim().split(/\s*,\s*/).forEach(e => {
            let [key, val] = e.split(/\s*:\s*/);

            //if key is a string
            key = key.startsWith("'") ? key.slice(1, -1) : key;

            // in case of {var2}
            val = val || key;

            result.push(`{[$style['${key}']] : ${val}}`);
        })

        return result;
    }

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

                            //"id" -> remove quotes "
                            idAttrVal = `$style[${attr.val.slice(1, -1)}]`

                            break;

                        default:
                            break;
                    }

                }
            )

            if (classes.length || idAttrVal) {
                let finalAttrs = node.attrs.filter(a => !['class', ':class', 'id', ':id'].includes(a.name));

                if (classes.length) {
                    let resultingClassArray = '[ ' + classes.join(', ') + ' ]';

                    finalAttrs.unshift({
                        name: ':class',
                        val: '"' + resultingClassArray + '"',
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


    //generate template function string
    let funcStr = generateCode(ast, options);

    //generate template function
    let template = wrap(funcStr);

    //add dependancy files to watch them (no such thing here)
    //template.dependencies.forEach(this.addDependency)

    //template({locals}), locals are vars referenced by using #{var} in pug src | { var: 'bob' }
    return template(options.locals || {})
}