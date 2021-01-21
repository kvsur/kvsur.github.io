---
layout: post
title: "React 原理及源码学习笔记📒"
category: react
---

****

### 一、JSX 代码是如何“摇身一变”成为 DOM 的？

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

### 二、React 16 为什么要对组件的生命周期进行调整更新？
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

> [关于React v16 生命周期的更信息可参考官方引用的来源](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)

**getDerivedStateFromProps不是componentWillMount的替代品**
其实这个API设计的目的是意图替代componentWillReceiveProps方法，从命名也可以得知，这个API的作用有且仅有一个，那就是从props中派生出state

```javascript
static getDerivedStateFromProps(props, state) {}
```

1. getDerivedStateFromProps 方法是静态 static 修饰， 这就意味着它是不能访问组件this的
2. 参数props和state 分别对应当前来自父组件的props和当前组件的state状态
3. getDerivedStateFromProps 需要一个对象格式返回值或者返回null， 其他形式则会抛出警告
4. 返回值对象并不会对当前组件的state进行覆盖式更新，而是针对性的定向更新

**消失的componentWillUpdate与新增的getSnapshotBeforeUpdate**
1. 官方的意愿及推荐用法是结合 componentDidUpdate 使用 getSnapshotBeforeUpdate 方法
2. getSnapshotBeforeUpdate 意在对VDOM connect 到DOM （render）获取快找（snapshot），例如 滚动位置
3. componentWillMount 被取消的真正原因是不利于Fiber 架构的实现及优化

#### Fiber 架构简介

划重点：**Fiber会使得原本的同步渲染过程变成异步的**

**在React v16之前，每一次更新的触发，都会促使React重新构建VDOM Tree，然后进行diff 操作，对DOM进行定向更新；但是这个过程是一个递归的过程，即使diff 优化使其时间复杂度达到O(n)，可不得不承认同步渲染的递归调用栈是很深的，只有最底层的调用完成之后才会返回上去；同步渲染进程一旦开启就没办法中止，这期间没法儿做其他事情，用户就无法处理其他的任何交互，因此如果渲染周期稍微变长的话，就能可能面临页面卡顿卡死的现象**

以上面临的在问题，在React 16 引入的Fiber 架构中能狗很好的解决：
1. Fiber 会将一个大的更新任务拆分为许多个小任务
2. 每当执行完一个小任务时，渲染线程都会把主线程交回去，看看有没有优先级更高的任务需要处理
3. 以上的机制让渲染工作变成“异步渲染”模式

前面提到在React v16中生命周期被划分为多个阶段:
1. render
2. commit: 细分为re-commit、commit 两个阶段

**总的来说就是render阶段可以被打断重启，而commit阶段则是同步执行；**
也正是因为这样的机制，导致render阶段的生命周期是极大可能会被重复执行的

- componentWillMount
- componentWillUpdate
- componentWillReceiveProps

**Example：** 在componentWillReceiveProps中删除一个DOM 节点，如果重复执行的话则会操作多次；componentWillUpdate中发起一次付款，如果被多次执行则会多次付款

****

### 三、数据是如何在React组件中流动的？

#### props 在父组件，子组件，兄弟组件通信中的应用

通过在props中传递基础数据类型，复杂数据类型甚至回调函数的方式达到通信目的
![React.props.communication](/assets/images/React.props.communication.png)

但是使用props 通信是有缺点的且不是唯一的方式，当组件嵌套层太深的时候props 通信简直就是噩梦般的存在
![React.props.communication](/assets/images/React.props.com.bad.png)

#### 是时候使用[发布-订阅]模式了

```javascript
class EventEmitter {
    constructor() {
        this.eventMap = new Map()
    }

    on(eventName, handler) {
        if (typeof handler !== 'function') throw new TypeError('handler must be a function');

        if (!this.eventMap.get(eventName)) this.eventMap.set(eventName, []);

        this.eventMap.get(eventName).push(handler);
    }

    emit(eventName, ...params) {
        if (this.eventMap.get(eventName)) this.eventMap.get(eventName).forEach(handler => handler(...params));
    }

    off(eventName, handler) {
        const listeners = this.eventMap.get(eventName);
        if (listeners) {
            listeners.splice(listeners.indexOf(handler) >>> 0, 1)
        }
    }
}
```

#### React.createContext && Redux

> [React Context](https://zh-hans.reactjs.org/docs/context.html#when-to-use-context)
> [Use Redux](https://github.com/kvsur/DIY-Redux-Use-TypeScript)

****

### 四、React-Hooks 设计动机与工作模式

类组件是面向对象编程思想的特征，主要就是封装及继承的思想。但是从另一个面来说，类组件相对沉重，且成本相对较大；

> 函数组件会捕获 render 内部的状态，这是两类组件最大的不同。参考Dan 的文章[函数组件与类组件的不同](https://overreacted.io/how-are-function-components-different-from-classes/)

**类组件与函数组件之间纵使有千差万别，但是最不能被忽略的是心智模型层面的差异，**是面向对象编程和函数式编程这两套不同设计思想之间的差异；这一理念说的更具体一点则是，**函数式组件更急契合React的设计理念**

![React.design.mind](/assets/images/React.design.mind.png)

React 组件本身的定位就是函数，一个吃进数据、吐出 UI 的函数。作为开发者，我们编写的是声明式的代码，而 React 框架的主要工作，就是及时地把声明式的代码转换为命令式的 DOM 操作，把数据层面的描述映射到用户可见的 UI 变化中去。这就意味着从原则上来讲，React 的数据应该总是紧紧地和渲染绑定在一起的，而类组件做不到这一点.

函数组件真正地把数据和渲染绑定到了一起。

经过岁月的洗礼，React 团队显然也认识到了，函数组件是一个更加匹配其设计理念、也更有利于逻辑拆分与重用的组件表达形式，接下来便开始“用脚投票”，用实际行动支持开发者编写函数式组件。于是，React-Hooks 便应运而生。

#### 面试时Hooks的问题：为什么需要React-Hooks？
1. 告别难以理解的class 组件（this、setState、 lifeCircle 的理解）
2. 解决业务逻辑难以拆分的问题
3. 使状态逻辑的复用变得简单可行（custom-hooks 自定义）
4. 函数式组件的从设计思想上来看，更加符合React的理念 （UI = f(data)）

但是值得注意的是，React-Hooks 并非银弹，纵使它有很多优点，不过还是有一些问题是hooks 力所不能及的：
- 比如像类组件中的componentDidCatch、getSnapshotBeforeUpdate
- 组件逻辑的过度自由，过度分散也不是好事
- Hooks 在使用层面有严格的约束规则（顺利问题）

### 五、深入React Hooks 背后的工作机制："原则"的背后是"原理"

React-Hooks 有如下两个使用原则：
- Hooks 只能在函数组件中使用
- 不要在循环、条件或者嵌套函数中使用（调用）Hooks

第一个点是很明显的，对于第二个点，可以从hook的实现原理层面来解释：

```typescript
useState<S>(
      initialState: (() => S) | S,
    ): [S, Dispatch<BasicStateAction<S>>] {
    currentHookNameInDev = 'useState';
    mountHookTypesDev();
    const prevDispatcher = ReactCurrentDispatcher.current;
    ReactCurrentDispatcher.current = InvalidNestedHooksDispatcherOnMountInDEV;
    try {
    return mountState(initialState);
    } finally {
    ReactCurrentDispatcher.current = prevDispatcher;
    }
}
// ...
function mountState<S>(
  initialState: (() => S) | S,
): [S, Dispatch<BasicStateAction<S>>] {
  const hook = mountWorkInProgressHook();
  if (typeof initialState === 'function') {
    // $FlowFixMe: Flow doesn't like mixed types
    initialState = initialState();
  }
  hook.memoizedState = hook.baseState = initialState;
  const queue = (hook.queue = {
    pending: null,
    dispatch: null,
    lastRenderedReducer: basicStateReducer,
    lastRenderedState: (initialState: any),
  });
  const dispatch: Dispatch<
    BasicStateAction<S>,
  > = (queue.dispatch = (dispatchAction.bind(
    null,
    currentlyRenderingFiber,
    queue,
  ): any));
  return [hook.memoizedState, dispatch];
}
//...
function mountWorkInProgressHook(): Hook {
  const hook: Hook = {
    memoizedState: null,

    baseState: null,
    baseQueue: null,
    queue: null,

    next: null,
  };
  if (workInProgressHook === null) {
    // This is the first hook in the list
    currentlyRenderingFiber.memoizedState = workInProgressHook = hook;
  } else {
    // Append to the end of the list
    workInProgressHook = workInProgressHook.next = hook;
  }
  return workInProgressHook;
}
//...
useState<S>(
      initialState: (() => S) | S,
    ): [S, Dispatch<BasicStateAction<S>>] {
    currentHookNameInDev = 'useState';
    updateHookTypesDev();
    const prevDispatcher = ReactCurrentDispatcher.current;
    ReactCurrentDispatcher.current = InvalidNestedHooksDispatcherOnUpdateInDEV;
    try {
    return updateState(initialState);
    } finally {
    ReactCurrentDispatcher.current = prevDispatcher;
    }
}
// ...
function updateState<S>(
  initialState: (() => S) | S,
): [S, Dispatch<BasicStateAction<S>>] {
  return updateReducer(basicStateReducer, (initialState: any));
}
//...
```

从上面的源代码 mountWorkInProgressHook 函数中可一看到，**每一个hook就是一个Node节点，所有一个组件中所有的hooks就是一个单向链表**；
所有的Hooks 方法都会对应的调用 mountXXX 函数，这些函数里面都是统一调用了 mountWorkInProgressHook 这个函数的；与之对应的还有updateXXX 函数

### 六、 React 使用VDOM 是为了性能么？

首先来明确两个点： 
- VDOM 是js 对象
- VDOM 是对 真实 DOM 的描述

其次：
- **挂载阶段：** React 将结合 JSX 的描述，构建出虚拟 DOM 树，然后通过 ReactDOM.render 实现虚拟 DOM 到真实 DOM 的映射（触发渲染流水线）
- **更新阶段：** 页面的变化在作用于真实 DOM 之前，会先作用于虚拟 DOM，虚拟 DOM 将在 JS 层借助算法先对比出具体有哪些真实 DOM 需要被改变，然后再将这些改变作用于真实 DOM

**虚拟 DOM 解决的关键问题有以下两个：**
1. 研发体验/研发效率的问题：这一点前面已经反复强调过，DOM 操作模式的每一次革新，背后都是前端对效率和体验的进一步追求。虚拟 DOM 的出现，为数据驱动视图这一思想提供了高度可用的载体，使得前端开发能够基于函数式 UI 的编程方式实现高效的声明式编程
2. 跨平台的问题：虚拟 DOM 是对真实渲染内容的一层抽象。若没有这一层抽象，那么视图层将和渲染平台紧密耦合在一起，为了描述同样的视图内容，你可能要分别在 Web 端和 Native 端写完全不同的两套甚至多套代码。但现在中间多了一层描述性的虚拟 DOM，它描述的东西可以是真实 DOM，也可以是iOS 界面、安卓界面、小程序......同一套虚拟 DOM，可以对接不同平台的渲染逻辑，从而实现“一次编码，多端运行”，如下图所示。其实说到底，跨平台也是研发提效的一种手段，它在思想上和1是高度呼应的

![vdom.diff.platform.png](vdom.diff.platform.png)