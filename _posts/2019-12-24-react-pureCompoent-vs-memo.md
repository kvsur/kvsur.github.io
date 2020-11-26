---
layout: post
title: "PureComponent vs memo"
category: react
---

#### PureComponent

> React.PureComponent 中的 shouldComponentUpdate() 仅作对象的浅层比较。如果对象中包含复杂的数据结构，则有可能因为无法检查深层的差别，产生错误的比对结果。仅在你的 props 和 state 较为简单时，才使用 React.PureComponent，或者在深层数据结构发生变化时调用 forceUpdate() 来确保组件被正确地更新。你也可以考虑使用 immutable 对象加速嵌套数据的比较。
> 此外，React.PureComponent 中的 shouldComponentUpdate() 将跳过所有子组件树的 prop 更新。因此，请确保所有子组件也都是“纯”的组件。

如果一个 PureComponent 组件自定义了shouldComponentUpdate生命周期函数，则该组件是否进行渲染取决于shouldComponentUpdate生命周期函数的执行结果，不会再进行额外的浅比较。如果未定义该生命周期函数，才会浅比较状态 state 和 props。

---

#### memo

> React.memo为高阶组件。它与React.PureComponent非常相似，但它适用于函数组件，但不适用于 class 组件。

memo 实现了类似shouldComponentUpdate 的 compare 方法；

updateMemoComponent函数决定是否退出渲染取决于以下两点：

* 当前 props 与 nextProps 是否相等；
* 即将渲染组件的引用是否与 workInProgress Fiber 中的引用是否一致；
