---
layout: post
title: "JS Event Loop 事件循环♻️"
category: javascript
---

JS 是一门单线程运行时的脚本语言，这是因历史原因设计者将其设计成了单线程语言，意在保证代码逻辑的顺序性，尤其是DOM操作问题（如果多线程执行DOM操作不加锁会导致意想不到的问题）；
当在浏览器中新开一个Tab页时，就相当于新增了一个进程的运行，这个进程内部是多线程机制，其中包含的进程有：
- GUI 渲染线程
- 定时器触发线程
- 事件触发线程
- 异步http请求线程
- 以及上面所说的js引擎线程

> [关于进程与线程相关的可以look这里](https://kvsur.github.io/process-thread.html)

以上的几个线程虽然是各自独立的，甚至GUI 渲染线程和JS引擎线程是互斥，当JS引擎执行时GUI线程会被挂起，GUI更新会被保存在一个队列中等到引擎线程空闲时立即被执行；由以上的这些机制就产生了Event Loop 事件循环；

JS 引擎在运行时会提供了两个数据结构作为代码运行支撑：
1. Heap：用于变量存放等分配内存的作用；
2. Call Stack： 所有的代码段（Task）运行前被push入栈，运行完成之后pop出栈；

![event-loop-one](/assets/images/event-loop-1.png)

针对第2点，所有的代码段（Task）并非都是在第一时间push入栈，而是放置与特殊的队列中等待合适的时机被动push入栈，包括如下操作（对应的callback）：

1. [setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout),[setInterval](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval),[setImmediate【nodejs｜IE】](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/setImmediate),[requestAnimationFrame](https://developer.mozilla.org/zh-CN/docs/Web/API/window/requestAnimationFrame),[I/O](https://developer.mozilla.org/zh-CN/docs/Mozilla/Projects/NSPR/Reference/I_O_Functions),[window.postMessage](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/postMessage), UI rendering

2. [process.nextTick【nodejs】](https://nodejs.org/uk/docs/guides/event-loop-timers-and-nexttick/),[Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise),[queueMicrotask](https://developer.mozilla.org/zh-CN/docs/Web/API/WindowOrWorkerGlobalScope/queueMicrotask),[MutationObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver)


在这里分为两类是有原因的，上面说的到的特殊队列可以分为两类，分别对应：

- **Macro Task Queue**-宏任务队列(requestAnimationFrame（callback）会单独建立宏任务队列且优先级高于其他宏任务队列)
- **Micro Task Queue**-微任务队列

事件循环对于两种队列中的Task处理机制是不尽相同的，下面具体介绍事件循环机制：

**首先明确以下几点：**
- 一个Event Loop 里面有一个或者多任务队列（其实任务队列就是宏任务队列）
- 一个 Event Loop 里面有一个微任务队列
- 任务队列（task queue） = 宏任务队列（macrotask queue） != 微任务队列（microtask queue）
- 一个任务（task）可能会被放入宏任务队列或者是微任务队列
- 当一个任务被放入队列中的时候，表示准备工作已经完成，任务随时可以执行
- 任务队列严格意义来说其实是一个集合而非队列，因为事件循环模式处理的第一步是选择第一个**可执行的**任务，而非第一个任务；
- script 标签包裹的一份完整的js代码其实也是一个任务（宏任务）


**事件循环遵循以下执行模型：**

当任务调用栈（Call Stack）为空的时候：

1. 在任务队列里选择等待最久且可执行的那个任务（task A）
2. 如果task A 是 null （意味着任务队列（macrotask）是空的），直接跳转第6步
3. 将 task A 作为当前正在执行的任务
4. 执行 task A(这里其实就是之前说的到callback)
5. 将当前正在执行的任务置为null，移除 task A
6. 执行微任务队列（microtask）
    - (a).在队列里选择可执行任务（task x）
    - (b).如果 task x 是 null（说明微任务队列是空的），直接跳转 (g)步骤
    - (c).将task x 置为正在执行中的任务
    - (d).执行 task x
    - (e).将当前正在执行的任务置为null，移除 task x
    - (f).在队列里选可执行任务（task x），跳转到(b)步骤
    - (g).完成微任务队列的执行
7. 跳转到步骤 1

以上模型可以简化成：

1. 在任务队列里选择等待最久且可执行的那个任务执行然后移除
2. 接着执行所有微任务队列里面所有可执行的任务
3. 跳转 第1步

*以上⬆️模型中说到的执行都是放入到调用栈（Call Stack）中执行,本文章所讲的事件循环模型只涉及浏览器事件模型，nodeJs事件循环模型见参考*

![event-loop-one](/assets/images/event-loop-2.png)


**Talk is cheap, show me the code;**

```js
// 1. 整个脚本会作为宏任务 callStack:[], macrotask:[script], microtask: [] --> callStack:[script], macrotask:[], microtask: []
function fn() {

    // 2. callStack:[script, console.log], macrotask:[], microtask: []
    console.log('start');
    
    // 3. callStack:[script, setTimeout], macrotask:[setTimeout-cb-1], microtask: []
    // setTimeout-cb-1
    setTimeout(function() {

        // 20. callStack:[setTimeout-cb-1,queueMicrotask], macrotask:[setTimeout-cb-2], microtask: [then-cb-1, queueMicrotask-cb] 

        queueMicrotask(() => {
            // 24. callStack:[setTimeout-cb-1,queueMicrotask-cb,console.log], macrotask:[setTimeout-cb-2, setTimeout-cb-3], microtask: [then-cb-1]
            console.log('microtask 0');
        });
        // 25. callStack:[setTimeout-cb-1], macrotask:[setTimeout-cb-2, setTimeout-cb-3], microtask: [then-cb-1]

        // 21. callStack:[setTimeout-cb-1,setTimeout], macrotask:[setTimeout-cb-2, setTimeout-cb-3], microtask: [then-cb-1, queueMicrotask-cb] 
        // setTimeout-cb-3
        setTimeout(() => {
            // 32. callStack:[setTimeout-cb-3, console.log], macrotask:[], microtask: []
            console.log('timeout 0 ')
            // 33. callStack:[setTimeout-cb-3], macrotask:[], microtask: []
        }, 0);
        // 34. callStack:[], macrotask:[], microtask: []


        // 22. callStack:[setTimeout-cb-1,console.log], macrotask:[setTimeout-cb-2, setTimeout-cb-3], microtask: [then-cb-1, queueMicrotask-cb] 
        console.log('timeout 1');

        // 23. callStack:[setTimeout-cb-1], macrotask:[setTimeout-cb-2, setTimeout-cb-3], microtask: [then-cb-1, queueMicrotask-cb] then-cb-1 还是不可执行


    // 26. callStack:[], macrotask:[setTimeout-cb-2, setTimeout-cb-3], microtask: [then-cb-1]
    });

    // 4. callStack:[script, queueMicrotask], macrotask:[setTimeout-cb-1], microtask: [queueMicrotask-cb]
    queueMicrotask(function() {

        // 10. callStack:[queueMicrotask-cb，requestAnimationFrame ],macrotask: [requestAnimationFrame-cb], macrotask:[setTimeout-cb-1,setTimeout-cb-2], microtask: [then-cb-1]
        requestAnimationFrame(() => {
            // 16. callStack:[requestAnimationFrame-cb,console.log], macrotask: [], macrotask:[setTimeout-cb-1,setTimeout-cb-2], microtask: [then-cb-1] 
            console.log('animation 1');

            // 17. callStack:[requestAnimationFrame-cb,queueMicrotask], macrotask:[setTimeout-cb-1,setTimeout-cb-2], microtask: [then-cb-1, queueMicrotask-cb] 
            queueMicrotask(() => {
                // 18. callStack:[requestAnimationFrame-cb,queueMicrotask,queueMicrotask-cb, console.log], macrotask:[setTimeout-cb-1,setTimeout-cb-2], microtask: [then-cb-1] 
                console.log('microtask 3');
            });

            // 19. callStack:[requestAnimationFrame-cb], macrotask:[setTimeout-cb-1,setTimeout-cb-2], microtask: [then-cb-1] 
        });

        // 20. callStack:[], macrotask:[setTimeout-cb-1,setTimeout-cb-2], microtask: [then-cb-1] then-cb-1 不可执行

        // 11. callStack:[queueMicrotask-cb, console.log],macrotask: [requestAnimationFrame-cb], macrotask:[setTimeout-cb-1,setTimeout-cb-2], microtask: [then-cb-1]
        console.log('microtask 1');

        // 12. callStack:[queueMicrotask-cb, Promise.resolve, then-body],macrotask: [requestAnimationFrame-cb], macrotask:[setTimeout-cb-1,setTimeout-cb-2], microtask: [then-cb-1, then-cb-2]
        // then-cb-2
        Promise.resolve().then(() => {
            // 13. callStack:[queueMicrotask-cb,then-cb-2, console.log], macrotask: [requestAnimationFrame-cb], macrotask:[setTimeout-cb-1,setTimeout-cb-2], microtask: [then-cb-1]
            console.log('microtask 2');
        }
        // 14. callStack:[queueMicrotask-cb], macrotask: [requestAnimationFrame-cb], macrotask:[setTimeout-cb-1,setTimeout-cb-2], microtask: [then-cb-1]
        );

        // 15. callStack:[], macrotask: [requestAnimationFrame-cb], macrotask:[setTimeout-cb-1,setTimeout-cb-2], microtask: [then-cb-1] 虽然微任务队列不为空，但是then-cb-2还是不可执行，进入下一轮 loop了

    // 12-1. callStack:[queueMicrotask-cb], macrotask: [requestAnimationFrame-cb], macrotask:[setTimeout-cb-1,setTimeout-cb-2], microtask: [then-cb-1, then-cb-2]
    // 此时微任务队列还是不为空，需要继续执行，这里看到then-cb-1还不是resolved状态，不可执行，则会执行 then-cb-2
    });

    // 5. callStack:[script, Promise-body, setTimeout], macrotask:[setTimeout-cb-1,setTimeout-cb-2], microtask: [queueMicrotask-cb]
    new Promise((res, rej) => {

        // 6. callStack:[script, Promise-body, setTimeout], macrotask:[setTimeout-cb-1,setTimeout-cb-2], microtask: [queueMicrotask-cb]
        // setTimeout-cb-2
        setTimeout(() => {
            // 27. callStack:[setTimeout-cb-2, queueMicrotask], macrotask:[ setTimeout-cb-3], microtask: [then-cb-1, queueMicrotask-cb]
            queueMicrotask(() => {
                // 28. callStack:[setTimeout-cb-2,queueMicrotask-cb], macrotask:[ setTimeout-cb-3], microtask: [then-cb-1]
                res('resolve 1');
            })
        }, 0);

        // 29. callStack:[], macrotask:[setTimeout-cb-3], microtask: [then-cb-1] 这时候then-cb-1对应的promise 状态是 resolved 可执行

        // 7. callStack:[script, Promise-body, setTimeout, console.log], macrotask:[setTimeout-cb-1,setTimeout-cb-2], microtask: [queueMicrotask-cb]
        console.log('promise directly');

    // 8. callStack:[script, Promise-body, setTimeout, then-body], macrotask:[setTimeout-cb-1,setTimeout-cb-2], microtask: [queueMicrotask-cb, then-cb-1]
    // then-cb-1
    }).then(res => {
        // 30. callStack:[then-cb-1, console.log], macrotask:[setTimeout-cb-3], microtask: []
        console.log(res);
    });

    // 31. callStack:[], macrotask:[setTimeout-cb-3], microtask: []

    // 9. callStack:[], macrotask:[setTimeout-cb-1,setTimeout-cb-2], microtask: [queueMicrotask-cb, then-cb-1] script 最后执行完毕，但是此时微任务不是空，需要继续执行
}

fn();
```

### 参考：

- [Difference between microtask and macrotask within an event loop context](https://stackoverflow.com/questions/25915634/difference-between-microtask-and-macrotask-within-an-event-loop-context)
- [多图生动详解浏览器与Node环境下的Event Loop](https://mp.weixin.qq.com/s/VZwAZcmAJGWeWrqRbiveaw)
- [浏览器与Node的事件循环(Event Loop)有何区别?](https://github.com/ljianshu/Blog/issues/54)
- [HTML 规范英文版](https://html.spec.whatwg.org/multipage/webappapis.html#task-queue)
