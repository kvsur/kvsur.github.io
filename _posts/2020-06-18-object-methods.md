---
layout: post
title: "Object 对象静态方法与实例方法"
category: javascript
---

### 1. Object()
Object 本身就是一个可调用的普通函数，起作用是将任意值转行为对象，可以保证传入的值返回一个定是一个对象；

#### 转换规则
1. 如果参数为空(null || undefined)，返回一个空对象
```js
const obj = Object(null) // {}
const obj2 = Object() // {}
obj instanceof Objcet // true
obj2 instanceof Object // true
```

2. 如果参数是基础类型 boolean,string,number,symbol,bigint中的一种，则返回对应的包装对象的实例
```js
Object(12) // Number {12}
Object('hello') // String {"hello"}
Object(true) // Boolean {true}
Object(12n) // BigInt {12n}
Object(Symbol('key')) // Symbol {Symbol(key)}
```

3. 如果参数本身就是对象，则直接返回该对象
```js
var obj = {}
obj === Object(obj) // true
// 可以用以上的做法判断某个值是否为对象
```

### 2. Object 构造函数

Object构造函数的用法与工具方法很相似，几乎一模一样。使用时，可以接受一个参数，如果该参数是一个对象，则直接返回这个对象；如果是一个原始类型的值，则返回该值对应的包装对象。
> 虽然用法相似，但是Object(value)与new Object(value)两者的语义是不同的，Object(value)表示将value转成一个对象，new Object(value)则表示新生成一个对象，它的值是value。

### 3. Object 静态方法

> 所谓静态方法，是指部署在Object 对象自身的方法；

#### Object.keys, Object.getOwnPropertyNames

Object.keys()和Object.getOwnPropertyNames()返回的结果是一样的。只有涉及不可枚举属性时，才会有不一样的结果。Object.keys方法只返回可枚举的属性,Object.getOwnPropertyNames方法还返回不可枚举的属性名。

```js
const list = ['hello', 'world']

Object.keys(list) // ["0", "1"]
Objcet.getOwnPropertyNames(list) // ["0", "1", "length"]

var obj = Object.create({}, {getFoo: {value: function() {return this.foo}}, setFoo: {value(foo){this.foo = foo}, enumerable: true}})
obj.foo = 12;
Object.keys(obj) // ['setFoo',foo']
```
ES6 之前的版本如果给Object.keys方法传入一个基础类型是会抛出异常的，ES6及其之后的版本会主动进行基础类型的转换，强制转换为一个对象
```js
Object.keys("foo");
// TypeError: "foo" is not an object (ES5 code)

Object.keys("foo");
// ["0", "1", "2"]                   (ES2015 code)
```

Object.keys pollify
```js
if (!Object.keys) {
	Object.keys = function(o) {
		if (o !== Objcet(o)) {
		throw new Error('Object.keys called on a not-object');
		}
		var k = [], p;
		for (p in o) {
			if (Object.prototype.hasOwnProperty.call(o, p)) {
				k.push(p);
			}
		}
		return k;
	}
}
```

#### 其他静态方法
**对象属性模型的方法**
- **Object.defineProperty()：通过描述对象，定义某个属性。**
	Object.defineProperty(obj, key, descriptor)
	descriptor包含下列属性可选：
	1. configurable 控制属性是否能被删除以及除了writable和value之外的描述属性能不能被更改，默认值为false
	2. enumerable 控制定义的属性是否出现在枚举中，为false时不在Object.keys中出现，但是在Object.getOwnPropertyNames会列出，默认值为false
	3. value， 默认值为undefined【数据描述符】
	4. writable 默认值为false，只有为true时定义的属性才能用赋值运算法修改，严格模式下会抛出TypeError【数据描述符】
	5. get 默认值为undefined，没有任何参数，但是会传入this，这里this由于继承关系的原因并不一定是定义属性对应对象【存取描述符】
	6. set 默认值为undefined，参数是需要更新的值，会传入赋值时对应的this对象
	
	```js
	var obj = {};
	obj.a = 1;
	// 等同于
	Object.defineProperty(obj, 'a', {
			enumerable: true;
			value: 1,
			writable: true,
			configurable: true,
	})
	
	Object.defineProperty(obj, 'b', { value: 2});
	// 等同于
	Object.defineProperty(o, "a", {
		  value: 1,
		  writable: false,
		  configurable: false,
		  enumerable: false
	});
	```
	自定义 Getter 和 Setter
	```js
	function Archiver() {
		  var temperature = null;
		  var archive = [];

		  Object.defineProperty(this, 'temperature', {
			get: function() {
			  console.log('get!');
			  return temperature;
			},
			set: function(value) {
			  temperature = value;
			  archive.push({ val: temperature });
			}
		  });

		  this.getArchive = function() { return archive; };
	}

	var arc = new Archiver();
	arc.temperature; // 'get!'
	arc.temperature = 11;
	arc.temperature = 13;
	arc.getArchive(); // [{ val: 11 }, { val: 13 }]
	```
- **Object.getOwnPropertyDescriptor()：获取某个属性的描述对象。**
- **Object.defineProperties()：通过描述对象，定义多个属性。**

**控制对象状态的方法**
- **Object.preventExtensions()：防止对象扩展。**
- **Object.isExtensible()：判断对象是否可扩展。**
- **Object.seal()：禁止对象配置。**
- **Object.isSealed()：判断一个对象是否可配置。**
- **Object.freeze()：冻结一个对象。**
- **Object.isFrozen()：判断一个对象是否被冻结。**

**原型链相关方法**
- **Object.create()：该方法可以指定原型对象和属性，返回一个新的对象。**
> 创建一个新对象，使用现有的对象来提供新创建的对象的\_\_proto\_\_。

	使用Object.create实现类式继承

	```js
	function Shap() {
		this.x = 0;
		this.y = 0;
	}

	Shap.prototype.move = function(x = 0, y = 0) {
		this.x += x;
		this.y += y;
		console.log('Shap moved');
	}

	function Rectangle() {
		Shap.call(this);
	}

	Rectangle.prototype = Objcet.create(shap.prototype);
	Rectangle.prototype.constructor = Rectangle;
	```
	Object.create - pollify
	```js
	if (typeof Object.create !== 'function') {
		Object.create = function(o, props) {
			if (Object(o) === o || o === null) {
				var obj = new Object()
				obj.__proto__ = o
				if (typeof props === 'object') Object.defineProperties(obj, props)
				return obj
			} else {
				throw new TypeError('Object prototype may only be an Object or null')
			}
		}
	}
	```
- **Object.getPrototypeOf()：获取对象的Prototype对象。**
- **Object.assign(target, ...source) 用于将所有可枚举属性的值从一个或多个源对象复制到目标对象。它将返回目标对象。**
	> 如果source中的某个属性是不可枚举的，则不会进行拷贝合并操作
	
	Object.assign-pollify
	```js
	if (Object.assign !== 'function') {
		Object.defineProperty(Object, 'assign', {
			value: function(target) {
				'use strict';
				if (target == null) throw new Error('Can\'t convert undefined or null to object');
				var to = Object(target);
				var index;
				for (index = 1; index < arguments.length; index++) {
					var nextSource = arguments[index];
					
					if (nextSource != null) {
						for (nextKey in nextSource) {
							if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
								to[nextkey] = nextSource[nextKey];
							}
						}
					}
				}
				
				return to;
			},
			writable: true,
			configurable: true,
		})
	}
	```

**Object.entries()**
> 对于基本类型的数据值，entries会将其转换为对象，类似与Object(obj)
> 可以使用Object.entries 返回值直接作为Map的构造函数参数

**Object.is()**
	Object.is-polliyf
	```js
		if (typeof Object.is !== 'function') {
			Object.is = function(x, y) {
				// 针对相同的值
				if (x === y) {
					return x !== 0 || 1/x === 1/y;
				}
				// 针对 NaN is NaN
				return x !== x && y !== y;
			}
		}
	```

### 参考：
[阮一峰-Object 对象](https://javascript.ruanyifeng.com/stdlib/object.html#toc0)