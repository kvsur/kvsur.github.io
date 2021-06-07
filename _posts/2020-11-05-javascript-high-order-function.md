---
layout: post
title: "高阶函数学习"
category: javascript
---

在数学和计算机科学中，<b style="color:red">高阶函数</b>是至少满足下列一个条件的函数：
- 接受一个或多个函数作为输入；
- 输出一个函数；


### <b>一、组合函数</b>
组合函数就是将两个或者两个以上的函数组合成一个新的函数的过程：

```js
function composeFn(f,g) {
    return function(x) {
        return f(g(x));
    }
}
```

**组合函数的实现**

```js
function compose(...fns) {
    return function(...args) {
        return fns.reduce(function(arg, fn) {
            return fn(arg);
        }, args);
    }
}
```

<b style="color:red">composeFn</b> 有一个最佳实践就是中间件和洋葱模型的应用：

```js
function compose(middleware) {
    return function(context, next) {
        let index = -1;
        return dispatch(0);

        function dispatch(i) {
            if (i <= index>) {
                return Promise.reject(new Error('next() called multiple times'));
            }
            index = i;
            let fn = middleware[i];
            if (i === middleware.length) fn = next;
            if (!fn) return Promise.resolve();

            try {
                return Promise.resolve(fn(context, dispatch.bind(null, i+1)));
            } catch(err) {
                return Promise.reject(err);
            }
        }
    }
}
```

### <b>二、柯里化</b>

**柯里化的作用**：
1. 参数复用
2. 延迟计算/运行

**柯里化的实现**：

```js
function curry(fn) {
    return function(...args) {
        if (args.length >= fn.length) {
            return fn.apply(this, args);
        }
        return function(...args2) {
            return curry.apply(this, args.concat(args2));
        }
    }
}

```

```js
const curry = (fn, ...args) => args.length < fn.length ? (...args2) => curry(fn, ...args, ...args2) : fn(...args);
```

### **三、偏函数**

在计算机科学中，偏函数的应用(Partial Application) 是指固定一个函数的某些参数，然后产生另一个更小元的函数；二所谓的元是指函数参数的个数，比如一个参数的函数被被称作为一元函数。

偏函数很容易与函数柯里化混淆，它们之间的区别是：
- 偏函数应用是固定一个函数的一个或者是多个参数，并返回一个可以接受剩余参数的函数；
- 柯里化是将函数转换为多个嵌套的一元函数，也就是每个函数指接受一个参数


**偏函数的实现**

```js
function partial(fn) {
    let args = Arrary.protoype.slice.call(arguments, 1)

    return function() {
        const newArgs = args.concat(Array.prototype.slice.call(arguments));
        return fn.apply(this, newArgs);
    }
}
```

```js
const partial = (fn, ...args) => (...arguments) => fn(...[...args, ...arguments]);
```

### **四、惰性函数**
惰性函数的特点是开发中某些代码逻辑需要判断环境、平台、兼容性等因素来决定使用执行什么代码块对应的逻辑，所以每次执行的时候都需要这样逻辑操作，这显然是不合理的，这样的情况可以通过惰性函数来解决。

**惰性载入函数**
所谓惰性载入函数就是当第一次根据条件只函数之后，在第二次调用函数时，就不再监测条件，直接执行函数。

```js
function addHandler(element, type, handler) {
    if (element.addEventListener) {
        addHandler = function(element, type, handler) {
            element.addEventListener(type, handler, false);
        }
    } else if (element.attachEvent) {
        addHandler = function(element, type, handler) {
            element.attachEvent('on' + type, handler);
        }
    } else {
        addHandler = function(element, type, handler) {
            element['on' + type] = handler;
        }
    }

    return addHandler(element, type, handler);
}
```

```js
const addHandler = (function() {
    if (element.addEventListener) {
        return function(element, type, handler) {
            element.addEventListener(type, handler, false);
        }
    } else if (element.attachEvent) {
        return function(element, type, handler) {
            element.attachEvent('on' + type, handler);
        }
    } else {
        return function(element, type, handler) {
            element['on' + type] = handler;
        }
    }
})();
```

### **五、缓存函数**
要实现换粗函数的功能，可以把经过序列化的参数作为key，再把第一次执行后的结果作为value 存储到map中。在每次执行调用函数调用前，都先先判断是否命中缓存，如果命中缓存则直接返回，反之执行调用存储结果：

```js
function memorize(fn) {
    const cache = new Map();
    return function(...args) {
        const argsKey = JSON.stringify(args);
        const tempValue = cache.get(argsKey);
        return tempValue && tempValue[0] || cache.set(argsKey, [fn(...args)]).get(argsKey)[0];
    }
}
```