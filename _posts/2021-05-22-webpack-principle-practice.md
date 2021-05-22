---
layout: post
title: "webpack 原理与实践"
category: tools
---

### webpack 解决了什么问题？

想要知道webpack 究竟解决了什么问题，首先需要需要了解下在前端实现模块化的几个重要的阶段：
- 文件划分方式： 直接通过script标签引入文件的方式，将模块直接暴露在全局中，让模块间相互调用；带来了全局污染、无私有空间、易命名冲突、依赖关系无法管理等问题；
- 命名空间方式：这种方式规定每个模块只暴露一个全局对象，与之相关的成员都挂在到这个全局对象中；命名空间虽然解决了命名冲突问题，但是其他问题依然存在；
- IIFE（Immediately-Invoked Function Expression）立即执行函数表达式：这种方式为模块提供了私有空间，每一个模块都放在一个立即执行函数所形成的私有作用域中，对于需要暴露给外部的成员，通过挂在到全局对象的方式实现；这种利用闭包机制的方式，很好的解决了全局污染和命名冲突的问题；对于依赖关系，可以通过参数作为依赖声明使用，是的模块间的依赖关系变得更加明显；

以上几种方式在早期开发过程中很好的解决了模块化中遇到的很多问题，但是仍然存在一些未得到解决的问题，其中最为明显的就是：模块的加载，上面的方式都是通过script标签直接加载；
更为理想的方式应该是在页面的中引入一个JS入口文件，其余用的模块通过代码进行控制，按需加载进来使用；

结合以上的点，现在对应的需求就是两点：
1. 一个统一的模块化标准规范
2. 一个可以自动加载模块的基础库（工具）

理一理早期的模块化规范集合：
1. CommonJS 规范，Nodejs的模块管理实现了CommonJs规范：module.exports 导出，require载入模块
2. CommonJs 规范不适用于浏览器环境，因为浏览器中的模块加载都是异步，所以就有了 AMD(Asynchronous Module Definition) 规范：Require.js 实现了此规范，通过define定义模块，define有两个参数，第一个是一个需要的依赖的数组，第二个参数是一个函数，函数的入参就是依赖的模块，导出的时候使用return方式；还有一个require函数，其作用只用于加载模块，通过动态创建script的方式加载；require.js也兼容了CommonJs规范，所有模块都通过 define定义，只有一个函数参数，函数入参为(require, exports, module)
3. CMD规范：Sea.js(淘宝开发)实现了这个规范
4. 最新的ES Modules 规范

随着模块化思想的引入实现和使用，有出现了一些新的问题：
- 兼容性问题，例如Es Modules 一些旧版本浏览器并不支持，还有一个其他的新的API 特性等
- 模块化划分文件过多，增加了很多http 请求，影响性能
- 文件类型的增加，出了js文件之外，html css image media font 等文件也需要模块化加载

以上的这些问题，刚好迎合了模块打包工具出现的契机，进而推动Webpack，Parcel，Rollup这类模块打包工具的产生；


### Webpack 打包结果bundle 分析

```javascript
// 是一个IIFE 

(function (modules /** 所有的模块 */) { // webpack 启动器
  // 模块缓存
  var installedModules = {};

  // require加载函数
  function __webpack_require__(moduleId) {

    // 检查需要加载模块是否已加载过
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports;

    }
    // 创建一个新的模块并加其加入缓存中
    var module = installedModules[moduleId] = {
      i: moduleId,
      l: false,
      exports: {}

    };

    // 执行模块，指定执行的上下文为模块的exports对象
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

    // 重置module的是否已加载Flag 为true
    module.l = true;

    // 返回module的exports对象
    return module.exports;

  }
    // ... 省略不必要的部分

  // 加载入口文件
  return __webpack_require__(__webpack_require__.s = "./src/index.js");

})
  /************************************************************************/
  ({

/***/ "./src/index.js":
/***/ (function (module, __webpack_exports__, __webpack_require__) {

        "use strict";
        __webpack_require__.r(__webpack_exports__);
/* harmony import */ var _info_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./info.js */ "./src/info.js");

        console.log(_info_js__WEBPACK_IMPORTED_MODULE_0__["default"]);

        /***/
      }),
  });
```

### 通过Loader 实现特殊资源的加载
Webpack 想要实现的是整个前端项目的模块化，相中各种资源（样式，Media，Image），换句话说就是webpack 不仅仅打包js模块，在webpack 所有的文件都可以是模块；
Webpack 是不同类型资源模块加载的核心就是Loader；

那么如何开发一个Loader呢？ 每一个Loader 都需要导出一个函数，函数入参就是加载到的文件内容，输出就是加工过后的内容；

```javascript
// 写一个Markdonw-Loader markdown-loader.js
const marked = require('marked');
module.exports = source => {
    const html = marked(source);
    // Webpack 加载资源的时候 Loader 的指定就像一个管道，执行顺序是从右到左，从下到上，webpack 规定 最后一个Loader的返回一定是一段可执行的js代码
    const code = `module.exports = ${JSON.stringify(html)}`;

    return code;
}

// 如果上一部marddown-loader 直接放回 html 字符串，webpack就无法解析，这个时候可以借助其他loader进行处理，比如使用 html-loader

config = {
    module: {
        rules: [
            {
                test: /\.md$/,
                use: ['html-loader', './markdown-loader']
            }
        ]
    }
}
```