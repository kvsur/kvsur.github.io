---
layout: post
title: "new 操作符的内部流程及实现"
category: javascript
---

使用new 调用类的构造函数会执行如下的操作：
1. 在内存中创建一个对象;
2. 这个对象内部的[[Protoptype]]指针被赋值为构造函数的prototype（原型）属性;
3. 构造函数的内部的this被指向这个对象；
4. 执行构造函数内部代码（给这个对象添加属性和值）
5. 如果执行的结果返回的一个非空对象，则返回执行结果；否则返回这个对象

```js
function newOperation(Constructor, ...args) {
    // const instance = Object.create(Constructor.prototype); // 设置[[Prototype]]的方式之一

    const instance = {};

    // instance.__proto__ = Constructor.prototype; // 设置[[Prototype]]的方式之一
    Object.setPrototypeOf(instance, Constructor.prototype);

    const result = Constructor.call(instance, ...args);

    return result instanceof Object ? result : instance;
}
```