const incstr = require('incstr')

const path = require('path');

const nameGeneratorContext = () => {
    let namesMap = {};

    //move dash to the end to optimize name generation
    let nameGenerator = incstr.idGenerator({ alphabet: '_abcdefghijklmnopqrstuvwxyz0123456789-' })

    //the function is called for each CSS rule, so cache the pairs of minified name with og name
    return (context, localIdentName, localName, options) => {

        let key = path.basename(context.resourcePath) + '?' + localName;

        if (namesMap[key]) return (namesMap[key]);

        let name = nameGenerator();

        //hypen prefixes are reserved for vendor classes, also it can't start with a digit
        //in addition exclude ^ad or any _ad, -ad constructions to avoid adblock problem
        while (/^[-\d]|(?:[-_]+|^)ad/.test(name)) {
            name = nameGenerator();
        }

        namesMap[key] = name;

        return name;
    }
}

module.exports = nameGeneratorContext;