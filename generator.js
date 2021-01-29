const fs = require('fs');
const path = require('path');

const chalk = require('chalk')

//patch vue.config file
module.exports = api => {
    const accent = chalk.italic.bold.keyword('cyan');
    const notif = chalk.keyword('darkorange').bold;

    console.log(`Patching ${accent('vue.config.js')}...`);

    let config = {};

    let configPath = '../../vue.config.js'
    let configAbsPath = path.join(__dirname, configPath)

    if (fs.existsSync(configAbsPath)) {
        config = require(configPath);
    }

    if (!config.css) config.css = {}

    let cssPluginConfig = {
        requireModuleExtension: false,
        loaderOptions: {
            css: {
                modules: {
                    localIdentName: '[name]_[local]',

                    //if this returns undefined, then localIdentName is used
                    getLocalIdent: api.makeJSOnlyValue(`process.env.NODE_ENV === 'production' ? nameGeneratorContext() : () => { }`),

                },
            },
        }
    };

    Object.assign(config.css, cssPluginConfig);

    let configStr =
        'const nameGeneratorContext = require("vue-cli-plugin-pug-with-css-modules/nameGeneratorContext")' + '\n\n' +
        api.genJSConfig(config);


    //why sync version didn't work doe?????? when patching existing. needs investigation
    fs.writeFile(configAbsPath, configStr, () => {
        console.log(`vue.config.js ${chalk.green('stored!')}`)
    });

    //move one line up '\033[1A'

    console.log(
        notif(
            `Don't forget to use ${accent('module')} attribute in ${accent('<style>')}`) + '\n' +
        notif(
            `Also there's ${accent('no need')} to use ${accent('scoped')} attribute, as built-in function generates scoped class names`))
}

