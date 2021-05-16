---
layout: post
title: "javascript 继承"
category: javascript
---

### Function 构造函数对象的继承

#### 1. 原型继承
构造函数、原型和实例的关系： 每一个构造函数都有一个原型对象（prototype），原型对象有一个属性（constructor）指回构造函数，每一个实例都有一个指针指向原型构造函数的那个原型对象；如果构造函数的原型对象是另一个类型的实例，那就意味着构造函数的原型对象内部也有一个指针指向另一个原型对象，相对应的另一个原型对象也有一个属性指向另一个构造函数，这样实例和原型之间就构成了一条链路，这就是原型链的基本构想；

```js
function SuperType() {
    this.property = true;
}

SuperType.prototype.getProperty = function() {
    return this.property;
}

function SubType() {
    this.subProperty = false;
}

SubType.prototype = new SuperType();
SubType.prototype.getSubProperty = function() {
    return this.subProperty;
}

const instance = new SubType();


                |---------------------|
                |       instance      |
                |---------------------|
                | [[Prototype]] |     | ------->\
                |---------------------|         |
                                                |
                |---------------------|         |
                |       SubType       |         |
                |---------------------|         |
                | prototype     |     | ------->|
                |---------------------|         |
                                                |
                |---------------------|         |
                | SubType prototype   | <-------/
                |---------------------|          
                | [[Prototype]] |     | ------->\
                |---------------------|         |
                                                |
                |---------------------|         |
            /-->|       SuperType     |         |
            |   |---------------------|         |
            |   | prototype     |     | ------->|
            |   |---------------------|         |
            |                                   |
            |   |---------------------|         |
            |   | SuperType prototype | <-------/
            |   |---------------------|          
            |   | [[Prototype]] |     | --------\
            |   |---------------------|         |
            \-- |      | constructor  |         |
                |---------------------|         |
                                                |
                |---------------------|         |
            /-->|       Object        |         |
            |   |---------------------|         |
            |   | prototype     |     | ------->|
            |   |---------------------|         |
            |                                   |
            |   |---------------------|         |
            |   | Object prototype    | <-------/
            |   |---------------------|
            \-- |      | constructor  |
                |---------------------|

```

#### 2. 

### class 类对象的继承