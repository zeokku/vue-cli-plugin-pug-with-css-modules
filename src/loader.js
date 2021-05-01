const { transform } = require("./transform");

const generateCode = require("pug-code-gen");
const wrap = require("pug-runtime/wrap");

module.exports = function (source) {
  const options = Object.assign(
    {
      //filename: this.resourcePath,
      doctype: "html",
      compileDebug: this.debug || false,
    },
    this.getOptions()
  );

  let ast = transform(source);

  //generate template function string
  let funcStr = generateCode(ast, options);

  //generate template function
  let template = wrap(funcStr);

  //template({locals}), locals are vars referenced by using #{var} in pug src | { var: 'bob' }
  return template(options.locals || {});
};
