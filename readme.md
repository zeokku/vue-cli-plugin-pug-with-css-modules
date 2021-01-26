## vue-cli-plugin-pug-with-css-modules
![npm](https://img.shields.io/npm/v/vue-cli-plugin-pug-with-css-modules?color=pink&style=flat-square)
![npm](https://img.shields.io/npm/dw/vue-cli-plugin-pug-with-css-modules?color=pink&style=flat-square)
[![Discord](https://img.shields.io/discord/405510915845390347?color=pink&label=join%20discord&style=flat-square)](https://zeokku.com/discord)

Vue CLI plugin to add support for pug templates with implicit support of CSS modules (providing CSS classname and ID minification), so you won't have to use $style object, just write the code as usual

## Installation:
```
vue add pug-with-css-modules
```

You don't need to change your templates. Look at the example:

```vue
<template lang="pug">
bob.sas(
  :class="{ state, locked }",
  @click="setState",
  :zk-state-default="stateDefault",
  :zk-state-active="stateActive"
)
  .child 
    .grand-child

#id.a.z.x(:class="[b, c, d]")

div(:class="{d: someVar}" :id="someIdVar")
div(:class="a ? 'b' : c")
div(:class="someOtherVar")

bob
</template>
```

The plugin compiles pug and processes class and id attributes to use $style:

```html
<bob :class="[ $style['sas'], {[$style['state']] : state}, {[$style['locked']] : locked} ]" @click="setState" :zk-state-default="stateDefault" :zk-state-active="stateActive">
  <div :class="$style['child']"> 
    <div :class="$style['grand-child']"></div>
  </div>
</bob>
<div :id="$style['id']" :class="[ $style['a'], $style['z'], $style['x'], $style[b], $style[c], $style[d] ]"></div>
<div :id="$style[someIdVar]" :class="{[$style['d']] : someVar}"></div>
<div :class="$style[a ? 'b' : c]"></div>
<div :class="$style[someOtherVar]"></div>
<bob></bob>
```

Don't forget to use **module** attribute for your styles:

```vue
<style lang="less" scoped module>
...
</style>
```

And setup **vue.config.js** properly:

```js
module.exports = {
//...
  css: {
      requireModuleExtension: false,
      loaderOptions: {
          css: {
              modules: {
                  localIdentName: process.env.NODE_ENV === 'production' ? '[hash:base64:2]' : '[name]_[local]',
              },
          },
      }
  }
}
```
