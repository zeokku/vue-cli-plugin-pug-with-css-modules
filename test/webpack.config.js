const path = require('path');

module.exports = {
    mode: 'development',
    template: './src/index.pug',

    output: {
        path: path.resolve(__dirname, 'dist')
    },

    module: {
        rules: [
            {
                test: /\.pug$/i,
                use: [
                    'html-loader',
                    //"raw-loader",
                    {
                        //path.resolve - get absolute path
                        loader: path.resolve('./loader.js'),
                        options: {
                            test: 'bob'
                        }
                    }
                ]
            }
        ]
    },

};