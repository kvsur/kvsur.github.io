---
layout: post
title: "js 类型转换"
category: javascript
---

2020-06-18 19:01:28 星期四

### 1. 强制转换
> 强制转换主要指使用Number()、String()和Boolean()三个函数，手动将各种类型的值，分别转换成数字、字符串或者布尔值。

#### 1.1 Number()
**原始类型转换**
> Number() 转换字符时，如果字符包含除了数字之外的字符，返回NaN
> parseInt() 转换字符时，字符是纯数字或者以数字开头两者都能转换，其他返回NaN

```js
Number(12) //12
Number('12') //12
Number('12number') // NaN
Number('') // 0
Number(true) // 1
Number(false) // 0
Number(undefined) // NaN
Number(null) // 0
Number(12n) // 12
Number(Symbol('s')) // TypeError: Cannot convert a Symbol value to a number

// parseInt
parseInt('') // NaN
parseInt(23) // 23
parseInt('23') // 23
parseInt('23fsd7fsdf8') // 23
parseInt('fdsfa23') // NaN
parseInt(12n) // 12
parseInt('12n') // 12
parseInt(null) // NaN
parseInt(undefined) // NaN
parseInt(Symbol('s')) // TypeError: Cannot convert a Symbol value to a number
```
**对象类型转换**
> 转换规则：首先调用valueOf，如果不是基础类型再调用toString，如果再不是基础类型则抛出异常
> parseInt 解析对象时顺序和上面相反，先是toString，然后是valueOf，返回对象也是抛出异常

```js
var obj = {};
obj.toString() // '[objcet Object]'
obj.valueOf() // {}

Number(obj) // NaN
parseInt(obj) // NaN
// 重写valueOf 方法
obj.valueOf = function() {return '4'}
Number(obj) // 4
parseInt(obj) // 4
// 重写toString 方法
obj.toString = function() {return '44'}
Number(obj) // 4
parseInt(obj) // 44

```

#### 1.2 String()
**基础类型转换**
```js
String() // ''
String(undefined) // 'undefined'
String(null) // 'null'
String(12) // 12
String(12n) // 12
String(Symbol('s')) // 'Symbol("s")'
String(true) // 'true'
String(false) // false
```
**对象类型转换**
> 1.先调用对象自身的toString方法。如果返回原始类型的值，则对该值使用String函数，不再进行以下步骤。
> 2.如果toString方法返回的是对象，再调用原对象的valueOf方法。如果valueOf方法返回原始类型的值，则对该值使用String函数，不再进行以下步骤。
> 3.如果valueOf方法返回的是对象，就报错。


#### 1.3 Boolean()
### 2. 自动转换
