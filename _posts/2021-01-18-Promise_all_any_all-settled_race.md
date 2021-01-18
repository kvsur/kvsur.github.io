---
layout: post
title: "实现Promise: all、race、allSettled、any"
category: javascript
---

### 准备工作
```javascript
function isNative(Ctor){
    return typeof Ctor === 'function' && /native code/.test(Ctor.toString());
}

function macroTask(cb) {
    const channel = new MessageChannel();

    channel.port1.onmessage = cb;
    channel.port2.postMessage(1);
}

class AggregateError extends Error {
    constructor(message: string) {
        super(message);
        this.message = message;
    }
}
```

### 实现 Promise.all
1. 参数有且仅有一个可迭代对象，意思是指 装载了 Symbol.iterator 方法；
2. 当不满足第1个条件时，抛出一个TypeError 错误；
3. 参数里面的所有项要么是一个Promise 实例，或者是一个LikePromis
4. 临时申请一个结果数组，对可迭代对象中的所有项进行处理，结果放入临时数组, 完成后执行 6 (pending)
5. 迭代过程中如果有项触发 reject 则退出 for 体；(fulfilled：rejected)
6. resolve 临时数组（fulfilled：resolved）

```javascript
function promiseAll(values) {
    return new Promise((resolve, reject) => {

        if (!isNative(values[Symbol.iterator]))
            return reject(new TypeError(`${typeof values} is not iterable (cannot read property Symbol(Symbol.iterator))`));

        const results = [];
        let haveAnyReject = false;

        for (let item of values) {
            // 如果在结束循环之前的其中任何一个触发了reject 则break；
            if (haveAnyReject) break;
            try {
                item.then(res => results.push(res)).catch(reason => {
                    haveAnyReject = true;
                    reject(reason);
                });
            } catch (err) {
                Promise.resolve().then(() => { results.push(item) });
            }
        }

        // setTimeout(resolve, 0, results);
        // queueMicrotask(() => resolve(results));

        !haveAnyReject && macroTask(() => resolve(results));
    });
}
```

### 实现 Promise.race
1. 参数有且仅有一个可迭代对象，意思是指 装载了 Symbol.iterator 方法；
2. 当不满足第1个条件时，抛出一个TypeError 错误；
3. 参数里面的所有项要么是一个Promise 实例，或者是一个LikePromis
4. 可迭代对象里面的任意一个触发resolve｜reject 则 race 方法resolve｜reject（fulfilled）
5. 如果第4 个条件不满足， 则返回的promise实例是pending状态 （pending）

```javascript
function promiseRace(values) {
    return new Promise((resolve, reject) => {
        if (!isNative(values[Symbol.iterator]))
            return reject(new TypeError(`${typeof values} is not iterable (cannot read property Symbol(Symbol.iterator))`));

        for(let item of values) {
            try {
                item.then(res => resolve(res)).catch(reason => reject(reason));
            } catch (err) {
                Promise.resolve().then(() => resolve(item));
            }
        }
        
    });
}
```

### 实现Promise.allSellted

1. 参数有且仅有一个可迭代对象，意思是指 装载了 Symbol.iterator 方法；
2. 当不满足第1个条件时，抛出一个TypeError 错误；
3. 参数里面的所有项要么是一个Promise 实例，或者是一个LikePromis
4. 临时申请一个结果数组，对可迭代对象中的所有项进行处理，结果放入临时数组, 完成后执行 6 (pending)
5. resolve 临时数组（fulfilled：resolved）

```javascript
function promiseAllSellted(values) {
    return new Promise((resolve, reject) => {
        if (!isNative(values[Symbol.iterator]))
            return reject(new TypeError(`${typeof values} is not iterable (cannot read property Symbol(Symbol.iterator))`));

        const results = [];

        for (let item of values) {
            try {
                item.then(res => results.push(res)).catch(reason => results.push(reason));
            } catch (err) {
                Promise.resolve().then(() => { results.push(item) });
            }
        }

        macroTask(() => resolve(results));
        
    });
}
```

### 实现Promise.any
1. 参数有且仅有一个可迭代对象，意思是指 装载了 Symbol.iterator 方法；
2. 当不满足第1个条件时，抛出一个TypeError 错误；
3. 参数里面的所有项要么是一个Promise 实例，或者是一个LikePromis
4. 可迭代参数中任意一项触发 resolve 则整个any 方法返回的promise 有 pending ——> fulfilled(resolved)
5. 如果第4项不满足则抛出一个AggregateError （Aggregate 合计，全部，所有）

```javascript
function promiseAny(values) {
    return new Promise((resolve, reject)=> {
        if (!isNative(values[Symbol.iterator]))
            return reject(new TypeError(`${typeof values} is not iterable (cannot read property Symbol(Symbol.iterator))`));

        let haveAnyResolved = false;

        for (let item of values) {
            if (haveAnyResolved) break;

            try {
                item.then(res => {
                    resolve(res);
                    // 此处不能直接break， 因为跨级了，这里属于 then cb 的作用域块了
                    haveAnyResolved = true;
                }).catch(reason => reason);
            } catch(e) {
                resolve(item);
                break;
            }
        }

        macroTask(() => {
            reject(new AggregateError('All promise is rejected'));
        });
    });
}
```