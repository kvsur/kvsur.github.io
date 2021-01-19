---
layout: post
title: "React 原理及源码学习笔记📒"
category: react
---

****

### JSX 代码是如何“摇身一变”成为 DOM 的？

首先来确定下关于JSX 的三个核心问题：
1. JSX的本质是什么？JSX 和 JS 是什么样的关系？
2. 到底为什么要使用JSX？会与不会的区别有哪些？
3. JSX 背后的功能模块是什么？这个功能模块都做了哪些事情？

#### JSX 的本质：JavaScript的语法扩展
官方解释说明到：

> JSX 是JavaScript的语法扩展，它和模板语言很接近，但是它充分具备JavaScript的能力；

那么 JSX 是如何在javascript 中生效的呢？
官方解释说明到：
> JSX 会被编译为 React.createElement(), React.createElement() 将返回一个叫做 React Element 的 JS 对象。

**而完成JSX到React.createElement()这一层转换的主要核心工具就是Babel**

虽然最终 JSX 都会被Babel转换成 React.createElement() 形式，但是React 依然坚持使用 JSX 是有原因的：
1. JSX 代码层次、嵌套关系清晰分明，反之React.createElement()方式则比较杂乱，可读性差、不易维护；
2. JSX 允许开发通过熟悉的类HTML Tag 语法创建 VDOM，降低学习成本同时提升研发效率于体验；

#### JSX -> DOM 的映射过程： createElement source code
1. React.createElement 方法
```javascript
/**
 101. React的创建元素方法
 */

export function createElement(type, config, children) {
  // propName 变量用于储存后面需要用到的元素属性
  let propName; 
  // props 变量用于储存元素属性的键值对集合
  const props = {}; 
  // key、ref、self、source 均为 React 元素的属性，此处不必深究
  let key = null;
  let ref = null; 
  let self = null; 
  let source = null; 

  // config 对象中存储的是元素的属性
  if (config != null) { 
    // 进来之后做的第一件事，是依次对 ref、key、self 和 source 属性赋值
    if (hasValidRef(config)) {
      ref = config.ref;
    }
    // 此处将 key 值字符串化
    if (hasValidKey(config)) {
      key = '' + config.key; 
    }
    self = config.__self === undefined ? null : config.__self;
    source = config.__source === undefined ? null : config.__source;
    // 接着就是要把 config 里面的属性都一个一个挪到 props 这个之前声明好的对象里面
    for (propName in config) {
      if (
        // 筛选出可以提进 props 对象里的属性
        hasOwnProperty.call(config, propName) &&
        !RESERVED_PROPS.hasOwnProperty(propName) 
      ) {
        props[propName] = config[propName]; 
      }
    }
  }

  // childrenLength 指的是当前元素的子元素的个数，减去的 2 是 type 和 config 两个参数占用的长度
  const childrenLength = arguments.length - 2; 
  // 如果抛去type和config，就只剩下一个参数，一般意味着文本节点出现了
  if (childrenLength === 1) { 
    // 直接把这个参数的值赋给props.children
    props.children = children; 
    // 处理嵌套多个子元素的情况
  } else if (childrenLength > 1) { 
    // 声明一个子元素数组
    const childArray = Array(childrenLength); 

    // 把子元素推进数组里
    for (let i = 0; i < childrenLength; i++) { 
      childArray[i] = arguments[i + 2];
    }
    // 最后把这个数组赋值给props.children
    props.children = childArray; 
  } 
  // 处理 defaultProps
  if (type && type.defaultProps) {
    const defaultProps = type.defaultProps;
    for (propName in defaultProps) { 
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }

  // 最后返回一个调用ReactElement执行方法，并传入刚才处理过的参数
  return ReactElement(
    type,
    key,
    ref,
    self,
    source,
    ReactCurrentOwner.current,
    props,
  );
}
```

![React.createElement](/assets/images/React.creatElement.method.png)

![React.createElement.props](/assets/images/React.creatElement.props.png)

2. ReactElement 函数

```javascript
const ReactElement = function(type, key, ref, self, source, owner, props) {
  const element = {
    // REACT_ELEMENT_TYPE是一个常量，用来标识该对象是一个ReactElement
    $$typeof: REACT_ELEMENT_TYPE,
    // 内置属性赋值
    type: type,
    key: key,
    ref: ref,
    props: props,
    // 记录创造该元素的组件
    _owner: owner,
  };
  // 
  if (__DEV__) {
    // 这里是一些针对 __DEV__ 环境下的处理，对于大家理解主要逻辑意义不大，此处我直接省略掉，以免混淆视听
  }

  return element;
};
```

****

### React 16 为什么要对组件的生命周期进行调整更新？
组件在初始化时，会通过调用生命周期中的render方法，**生成VDOM**，然后在通过ReactDOM.render方法实现VDOM 到 DOM 的连接转换；

> 生命周期的本质：组件的‘灵魂’于‘躯干’
> “躯干”未必总是会做具体的事情（比如说我们可以选择性地省略对 render 之外的任何生命周期方法内容的编写），而“灵魂”却总是充实的（render 函数却坚决不能省略）；倘若“躯干”做了点什么，往往都会直接或间接地影响到“灵魂”（因为即便是 render 之外的生命周期逻辑，也大部分是在为 render 层面的效果服务）；“躯干”和“灵魂”一起，共同构成了 React 组件完整而不可分割的“生命时间轴”。


#### React v15 LifeCircle

1. 初始化阶段： constructor、**componentWillMount**、render、componentDidMount
2. 更新阶段：(当更新由父组件触发时多一个生命周期：**componentWillReceiveProps**)、shouldComponentUpdate、**componentWillUpdate**、render、componentDidUpdate
3. 组件卸载：componentWillUnmounted 

![react v15 lifecircle](/assets/images/lifecircle.15.png)

关于 componentWillReceiveProps(nextProps) 生命周期方法的触发需要注意⚠️的是：
1. componentWillReceiveProps 并不是由 props 的变化触发的，而是由父组件的更新触发的。
2. 可以适度结合shouldComponentUpdate 进行优化
3. shouldComponentUpdate 默认返回值是 true，针对简单的props 类组件，可以使用 React.pureComponent 组件中的自带优化

组件卸载阶段，这个阶段发生的可能行有两种：
1. 组件被被动移除
2. 组件的设置了key属性且更新过程中 key的值发生了变化；

#### React v16 LifeCircle
1. 初始化挂载阶段： constructor、getDerivedStateFromProps(props, state)、render、componentDidMount
2. 更新阶段：getDerivedStateFromProps、shouldComponentUpdate(nextProps, nextState)、render、getSnapshotBeforeUpdate(preProps, preState)、componentDidUpdate(preProps, preState, snapshot)
3. 卸载阶段：componentWillUnmount
4. 对于挂载和更新阶段，它们可以更细分为三个阶段：
    1. render 阶段 -> 这个阶段的操作需要保证纯净且不包含副作用，这个阶段可能会被React 暂停⏸️、中止或重新启动；
    2. pre-commit 阶段 -> 这个阶段可以读取DOM
    3. commit 阶段 -> 可以使用DOM，执行副作用，安排更新
5. 对于方法 getDerivedStateFromProps，v16.3 中只有 props 更新才会 被执行，但是在v16.4 版本及之后，setState 或则 froceUpdate 操作也同时会触发 其执行

> [关于React v16 生命周期的更信息可参考官方引用的图谱](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)

