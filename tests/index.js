const { transform } = require("../src/transform");

const lex = require("pug-lexer");
const parse = require("pug-parser");
const generateCode = require("pug-code-gen");
const wrap = require("pug-runtime/wrap");

const fs = require("fs");
const path = require("path");

const source = fs.readFileSync(path.join(__dirname, "./test.pug")).toString();

let ast = parse(lex(source));

fs.writeFileSync(
  path.join(__dirname, "./ast.json"),
  JSON.stringify(ast, null, 4)
);

ast = transform(source);

//generate template function string
let funcStr = generateCode(ast, {
  pretty: true,
  doctype: "html",
  //compileDebug: this.debug || false,
  //templateName: 'helloWorld', //'template'
});

//generate template function
let template = wrap(funcStr);

//+ locals obj
let html = template({});

//console.log(html);

fs.writeFileSync(path.join(__dirname, "./test.html"), html);

//assert.deepEqual();
