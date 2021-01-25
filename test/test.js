const lex = require('pug-lexer')
const parse = require('pug-parser');
const walk = require('pug-walk')
const generateCode = require('pug-code-gen');
const wrap = require('pug-runtime/wrap')

const fs = require('fs')

const source = fs.readFileSync('./test/index.pug').toString();

let ast = parse(lex(source))

fs.writeFileSync('./ast.json', JSON.stringify(ast, null, 4))

const classObjParse = (c) => {
    let result = [];

    //remove {} and split entries
    c.trim().slice(1, -1).trim().split(/\s*,\s*/).forEach(e => {
        let [key, val] = e.split(/\s*:\s*/);

        //if key is a string
        key = key.startsWith("'") ? key.slice(1, -1) : key;

        // in case of {var2}
        val = val || key;

        result.push(`{[$style['${key}']] : ${val}]}`);
    })

    return result;
}

ast = walk(ast, (node, replace) => {
    if (node.attrs && node.attrs.length) {
        let classes = [];

        let idAttrVal = '';

        node.attrs.forEach(
            (attr, attrIndex) => {

                switch (attr.name) {
                    case 'class':

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

                        idAttrVal = `$style[${attr.val}]`

                        break;

                    case ':id':

                        //remove quotes "
                        idAttrVal = `$style[${attr.val.slice(1, -1)}]`

                        break;

                    default:
                        break;
                }

            }
        )

        let finalAttrs = node.attrs.filter(a => !['class', ':class', 'id', ':id'].includes(a.name));

        let resultingClassArray = '[ ' + classes.join(', ') + ' ]';

        finalAttrs.push({
            name: ':class',
            val: '"' + resultingClassArray + '"',
            mustEscape: true
        })

        if (idAttrVal) {
            finalAttrs.push({
                name: ':id',
                val: '"' + idAttrVal + '"',
                mustEscape: true
            })
        }

        node.attrs = finalAttrs;
    }
})


//generate template function string
let funcStr = generateCode(ast, {
    pretty: true,
    doctype: 'html',
    //compileDebug: this.debug || false,
    //templateName: 'helloWorld', //'template'
});

//generate template function
let template = wrap(funcStr);

//+ locals obj
let html = template({})

//console.log(html);

fs.writeFileSync('./test/test.html', html)

//assert.deepEqual();