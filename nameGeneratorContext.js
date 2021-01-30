const incstr = require('incstr')

const path = require('path');

const nameGeneratorContext = () => {
    let namesMap = {};

    let nameGenerator = incstr.idGenerator({ alphabet: '-_abcdefghijklmnopqrstuvwxyz0123456789' })

    //the function is called for each CSS rule, so cache the pairs of minified name with og name
    return (context, localIdentName, localName, options) => {

        let key = path.basename(context.resourcePath) + '?' + localName;

        if (namesMap[key]) return (namesMap[key]);

        let name = undefined;

        do {
            name = nameGenerator()
        }
        while (/^[-\d]|(?:[-_]+|^)ad/.test(name));
        //hypen prefixes are reserved for vendor classes, also it can't start with a digit
        //in addition exclude ^ad or any _ad, -ad constructions to avoid adblock problem

        namesMap[key] = name;

        return name;
    }
}

module.exports = nameGeneratorContext;