const { transform } = require('./transform')

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


    let ast = 0;

    //generate template function string
    let funcStr = generateCode(ast, options);

    //generate template function
    let template = wrap(funcStr);

    //add dependancy files to watch them (no such thing here)
    //template.dependencies.forEach(this.addDependency)

    //template({locals}), locals are vars referenced by using #{var} in pug src | { var: 'bob' }
    return template(options.locals || {})
}