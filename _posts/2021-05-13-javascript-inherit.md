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

```

原型继承存在的问题：
1. 如果原型中有引用的值，则引用会在所有实例之间共享
2. SubType 在实例化时不能给SuperType 传入参数

```bash


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

#### 2. 借用构造函数
为了解决原型包含引用值的问题。通过call 或者 apply 的方式在子类中调用父类，因为父类其实也是函数；

```js
function Super(name) {
    this.name = name;
}

function Sub(name, age) {
    Super.call(this, name);
    this.age = age;
}
```

借用构造函数存在的问题：
1. Super的方法不能继承使用
2. Sub 也不能在Super 实例上定义方法

#### 3. 组合继承
组合继承（伪经典继承）综合了原型链和借用构造函数的优缺点，通过原型链继承父类原型的属性和方法，通过借用构造函数继承父类实例属性；


#### 4. 原型式继承

使用Object.create 方法达到进程的目的

```js
let person = {
name: "Nicholas",
friends: ["Shelby", "Court", "Van"]
};
let anotherPerson = Object.create(person, { name: {
        value: "Greg"
      }
});
console.log(anotherPerson.name); // "Greg"
```

#### 5. 寄生式继承
```js
function inheritMethod(origin) {
    const clone = Object.create(origin);

    clone.say = function () {
        return 'hello world!!!';
    }

    return clone;
}
```


#### 6. 寄生式组合继承

```js
function Super(name) {
    this.name = name;
    this.friends = [];
}

Super.prototype.makeFriends = function(friend) {
    this.friends.push(friend);
    console.log(this.friends.join(','));
}

function Sub(name, age) {
    // 继承 获取Super 的属性
    Super.call(this, name);

    this.age = age;
}


// // 继承 获取 Super 的方法
// Sub.prototype = new Super();
// // 继承 重定向construtor 指向Sub 自身
// Sub.prototype.constructor = Sub;

// 以上两步可以用 inheritPrototype 实现
inheritPrototype(Sub, Super);

Sub.prototype.showSelf = function() {
    console.log(`Hi, My name is ${this.name}, and I'm ${this.age} years old.`);
}

function inheritPrototype(subType, superType) {
    const prototype = Object.create(superType.prototype);
    prototype.constructor = subType;
    subType.prototype = prototype;
}

const sub = new Sub('licheng', 26);

console.log(sub.friends);
```

### class 类对象的继承