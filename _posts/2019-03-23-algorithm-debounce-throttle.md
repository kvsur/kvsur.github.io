---
layout: post
title: "防抖节流函数"
category: algorithm
---

1. debounce

```js
function debounce(fn, time) {
    let timer = null;

    return function(args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            timer = null;
            fn(args);
        }, time);
    }
}

function debounce2(fn, time, immediate = true) {
    let timer, result;

    // 延迟执行函数
    const later = (ctx, args) => setTimeout(() => {
        timer = null; // 倒计时结束

        if (!immediate) {
            // 执行回调
            result = fn.apply(ctx, args);
            ctx = args = null;
        }
    }, time);

    let debounced = function(...params) {
        if (!timer) {
            timer = later(this, params);
            // 立即执行回调
            if (immediate) {
                result = fn.apply(this, params);
            }
        } else {
            clearTimeout(timer);
            // 函数在每个等待延时的结束被调用
            timer = later(this, params);
        }

        return result;
    }

    // 提供一个外部晴空定时器的方法
    debounced.cancel = function() {
        clearTimeout(timer);
        timer = null;
    }

    return debounced;
}

window.onload = function () {
    const fn = value => { console.log(value.target.value); }
    const debounce = debounce2(fn, 4000, false);
    const input = document.getElementById('inputText');

    input.addEventListener('keyup', debounce);
}
```
2. throttle

```js
function throttle(fn, time) {
    let pre = +new Date;

    return function(...args) {
        let ctx = this;
        if ( (+new Date) - pre > time) {
            fn.apply(ctx, args);
            pre = (+new Date);
        }
    }
}

function throttle2(fn, time, options = {}) {
    let timer, ctx, args, result;
    let pre = 0;

    function later() {
        pre = options.leading === false ? 0 : (+new Date);
        timer = null;
        result = fn.apply(ctx, args);

        if (!timer) ctx = args = null;
    }

    function throttled() {
        const now = (+new Date);
        
        if (!pre && options.leading === false) pre = now;

        const remaining = time - (now - pre);
        ctx = this;
        args = arguments;

        if (remaining <= 0 || remaining > time) {
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }

            pre = now;
            result = fn.apply(ctx, args);

            if (!timer) ctx = args = null;
        } else if (!timer && options.leading !== false) {
            timer = setTimeout(later, remaining);
        }

        return result;
    }

    throttled.cancel = function() {
        clearTimeout(timer);
        pre = 0;
        timer = ctx = args = 0;
    }

    return throttled;
}
```