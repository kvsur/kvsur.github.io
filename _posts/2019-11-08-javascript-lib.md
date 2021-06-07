---
layout: post
title: "js 模块化基本原理"
category: javascript
---

#### 模块定义工具
---
file--[./mo.js]

```js
module.exports = (function() {
    const modules = {};
    
    function define(name, deps, impl) {
        for(let index = 0, l = (deps || []).length; index < l; index++) {
            deps[index] = modules[deps[index]];
        }
        modules[name] = impl.apply(impl, deps);
    }
    
    function get(name) {
        return modules[name];
    }
    
    return {
        define,
        get,
    };
})();
```
#### 使用方法
---
file--[./demo.js]

```js
const mo = require('./mo.js');

mo.define('m1', null, function() {
    function hello(name) {
        return `hello ${name}`;
    }
    
    return {
        hello
    };
});

mo.define('m2', ['m1'], function(tool) {
    function iam(name) {
        return `${tool.hello('Tom')}, I am ${name}.`;
    }
    
    return {
        iam
    };
});
```
