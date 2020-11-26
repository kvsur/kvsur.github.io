---
layout: post
title: "React render 需要满足的条件"
category: react
---

**React 创建Fiber树时，每个组件对应的 fiber 都是通过以下两个逻辑之一创建的：**
- render，主动调用render函数，根据函数返回的jsx 创建的 fiber；
- bailout，即满足一定条件时，React判断该组件更新前后没有发生变化，则复用上一次更新的fiber作为本次更新的fiber；

**bailout 需要满足的条件：**
那么什么时候回进入bailout逻辑呢？当同时满足以下四个条件时：

1. oldProps === newProps（注意这里是全等，是对引用进行判断，如果我们使用PureComponent或者Memo，则是对props进行浅比较）
2. context.value 没有生变化
3. workdInProgress.type === current.type(更新前后fiber.type 是否发生变化，如从div 变成 p)
4.  !includesSomeLane(renderLanes, updateLanes) ？ 当前fiber上是否存在更新，如果存在那么更新的优先级是否和本次整棵fiber树调度的优先级一致？如果一致则进入render逻辑。