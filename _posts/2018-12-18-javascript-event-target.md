---
layout: post
title: "js Event 事件处理"
category: javascript
---

javascript 的事件主要分为三个阶段：
1. 捕获阶段
2. 处于目标节点阶段
3. 冒泡阶段

> 我们一般在事件的冒泡阶段注册监听，这样做是为事件代理提供条件，即事件代理依赖于事件冒泡；另外一点则是浏览器兼容性问题，IE不支持事件捕获

> 事件监听的回调函数的参数event中的target和currentTarget是有区别的，这一点在事件代理上体现的很明确，事件代理中代理的阶段和被代理的节点，代理处理时的目标要使用target而不是currentTarget


##### currentTarget始终是监听事件者，而target是事件的真正发出者。