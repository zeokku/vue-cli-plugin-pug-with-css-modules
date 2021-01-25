const path = require('path');

const loaderPath = path.resolve('./src/loader.js');

module.exports = (api, options) => {
    //rules: https://vue-loader.vuejs.org/guide/pre-processors.html#pug

    api.chainWebpack(webpackConfig => {
        webpackConfig.module.rules.delete('pug')
    })

    api.configureWebpack({
        module: {
            rules: [
                {
                    test: /\.pug$/i,
                    oneOf: [
                        // this applies to `<template lang="pug">` in Vue components
                        {

                            resourceQuery: /^\?vue/,
                            use: [loaderPath],
                            //options: {}
                        }
                        ,
                        // this applies to pug imports inside JavaScript
                        {
                            use: ['raw-loader', loaderPath]
                        }
                    ]
                }
            ]
        }
    })
}