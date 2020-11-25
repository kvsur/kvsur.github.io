[TOC]

### 1. call
> call() 方法在使用一个指定的 this 值和若干个指定的参数值的前提下调用某个函数或方法。

**function.call(thisArg, arg1, arg2, ...)**

thisArg 参数在非严格模式下时，如果指定为 **null** 或者 **undefined**，则会被替换为全局对象，原始值会被包装；

#### call 实现
```javascript
/** 实现思路
1. 将函数做为属性赋值给context，注意context可能是null或者 undefeind，兼容为window或者global
2. 取arguments第一个到最后一个作为函数调用参数，使用eval执行得到结果
3. 删除context赋值的函数属性
4. 返回eval执行得到的结果
**/
Function.prototype.call2 = function(context) {
	context  = context || window || global;
	context.fn = this;
	
	var args = [];
	for (var index = 1; index < args.length; index++) {
		args.push('arguments[' + index + ']');
	}
	
	var result = eval('context.fn(' + args + ')');
	// 上的参数取用逻辑可以使用es6语法代替
	// var result = context.fn(...[...arguments].splice(1))
	
	delete context.fn;
	return result;
}
```

### 2. apply

> apply 和 call的区别在于传递参数的方式不同

#### apply 实现
```javascript
Function.prototype.apply2 = function(context, arr) {
	context  = context || window || global;
	context.fn = this;
	
	var result;
	
	if (!arr) result = context.fn();
	else {
		var args = [];
		for (var index = 1; index < args.length; index++) {
			args.push('arguments[' + index + ']');
		}

		result = eval('context.fn(' + args + ')');
	}
	
	delete context.fn;
	return result;
}
```

###3.  bind

> bind()会创建一个新的函数。当这个函数被调用时，bind()的第一个参数作为运行时的this，之后的一系列参数将会在运行时传递的实参前作为它的参数。

#### bind的实现
```javascript
Function.prototype.bind2 = function(context) {
	if(typeof this !== 'function') {
		throw new Error('Function.prototype.bind to be bound must be a function');
	}
	var self = this;
	var args = Array.prototype.slice.call(arguments, 1);
	// fNOP -> a functoin not own prototype
	var fNOP = function() {}
	
	var fBound =  function() {
		var bindArgs = Array.prototype.slice.call(arguments);
		// 普通函数使用时this 指向 window
		// new 方式构造函数使用时，this 指向 fBound
		// 不同的方式导致 apply 指向的this不同
		return self.apply(this instanceof fNOP ? this : context, args.concat(bindArgs));
	}
	// 以下的方式避免了在修改fBound函数的原型时同时修改绑定函数的原型
	fNOP.prototype = this.prototype;
	fBound.prototype = new fNOP();
	return fBound;
}
```