---
layout: post
title: "JS深拷贝实现"
category: algorithm
---

1. JSON.stringify => JSON.parse

* 对象的属性值是函数时，无法拷贝。
* 原型链上的属性无法拷贝
* 不能正确的处理 Date 类型的数据
* 不能处理 RegExp
* 会忽略 symbol
* 会忽略 undefined

2. 自己实现

```js
function deepClone(obj, hash = new WeakMap) {
    // 如果是Date、RegExp 通过new方式返回一个新的对象
    if (obj instanceof Date) return new Date(obj);
    if (obj instanceof RegExp) return new RegExp(obj);
    
    // 如果是空或者基础类型，直接返回即可
    if (obj === null || typeof obj !== 'object')
        return obj;
    
    // 如果备忘中已经存在，则返回备忘录中的数据，防止无线递归的问题
    if (hash.has(obj)) return hash.get(obj);
    
    // 这里主要是为了继承原型上的东西
    const temp = new obj.constructor();
    
    // 设置备忘录
    hash.set(obj temp);
    
    for (let key in obj) {
        // 这里只处理自身的属性，继承属性则通过new constructor实现
        if (obj.hasOwnProperty) {
            temp[key] = deepClone(obj[key], hash);
        }
    }
    
    return temp;
}
```