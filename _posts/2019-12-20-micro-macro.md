---
layout: post
title: "微任务&&宏任务"
category: javascript
---

* JavaScript是单线程的语言
* Event Loop是javascript的执行机制

由此产生了事件循环机制：
> 在这个机制中，事件任务分为两种大分类，同步任务和异步任务；
> 而异步任务又分为宏任务和微任务两种；
> 执行宏任务和微任务都会将回调放入事件队列eventQueue中，但是两者的eventQueje是不相同的；
> 微任务队列中的回调回比宏任务中的对调优先执行

> process.nextTick方法可以在当前"执行栈"的尾部----下一次Event Loop（主线程读取"任务队列"）之前----触发回调函数。也就是说，它指定的任务总是发生在所有异步任务之前。setImmediate方法则是在当前"任务队列"的尾部添加事件，也就是说，它指定的任务总是在下一次Event Loop时执行，这与setTimeout(fn, 0)很像。

1. 宏任务
包括整体代码script，setTimeout，setInterval、setImmediate；

2. 微任务
原生Promise(有些实现的promise将then方法放到了宏任务中)、process.nextTick、Object.observe(已废弃)、 MutationObserver 记住就行了

看看下面的代码：

```js
console.log('1');

setTimeout(function () {
    console.log('2');
    process.nextTick(function () {
        console.log('3');
    })
    new Promise(function (resolve) {
        console.log('4');
        resolve();
    }).then(function () {
        console.log('5')
    })
})

process.nextTick(function () {
    console.log('6');
})
new Promise(function (resolve) {
    console.log('7');
    resolve();
}).then(function () {
    console.log('8')
})

setTimeout(function () {
    console.log('9');
    process.nextTick(function () {
        console.log('10');
    })
    new Promise(function (resolve) {
        console.log('11');
        resolve();
    }).then(function () {
        console.log('12')
    })
})
```

> 结果是
> // 1, 7, 6, 8, 2, 4, 3, 5, 9, 11, 10, 12, 