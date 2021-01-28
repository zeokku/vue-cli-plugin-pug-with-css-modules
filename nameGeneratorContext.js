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
        //hypens are reserved for vendor classes, also it can't start with a digit
        //also exclude ^ad or any _ad, -ad constructions to avoid adblock problem

        namesMap[key] = name;

        return name;

        // let te = new TextEncoder();
        // crypto.subtle.digest("SHA-256", te.encode(localName))

        // return localIdentName
    }
}

module.exports = nameGeneratorContext;