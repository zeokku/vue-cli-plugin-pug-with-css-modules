//inject css config into vue.config.js
//css: {...injected_config}

//https://cli.vuejs.org/dev-guide/generator-api.html#injectimports

const fs = require('fs');
const path = require('path');

//patch vue.config file
module.exports = api => {
    const accent = chalk.underline.italic.bold.keyword('purple');
    const notif = chalk.keyword('black').bgKeyword('darkorange').bold;

    console.log(notif(`Patching ${accent('vue.config.js')} with CSS config`));

    let config = {};

    let configPath = '../../vue.config.js'
    let configAbsPath = path.join(__dirname, configPath)

    if (fs.existsSync(configAbsPath)) {
        console.log(notif('vue.config found!'));

        config = require(configPath);
    }

    if (!config.css) config.css = {}

    let cssPluginConfig = {
        requireModuleExtension: false,
        loaderOptions: {
            css: {
                modules: {
                    localIdentName: '[name]_[local]',//process.env.NODE_ENV === 'production' ? '[sha256:hash:base52:2]' : '[name]_[local]',//[local]

                    //if this returns undefined, then localIdentName is used
                    getLocalIdent: api.makeJSOnlyValue(`process.env.NODE_ENV === 'production' ? nameGeneratorContext() : () => { }`),

                },
            },
        }
    };

    Object.assign(config.css, cssPluginConfig);

    let configStr = api.genJSConfig(config);

    fs.writeFileSync(configAbsPath, configStr);

    api.injectImports(configAbsPath, 'const nameGeneratorContext = require("vue-cli-plugin-pug-with-css-modules/nameGeneratorContext")')

    console.log(notif(`Don't forget to use ${accent('module')} attribute in ${accent('<style>')}`));
}

