---
layout: post
title: "浏览器垃圾回收♻️机制"
category: performance
---

### 垃圾数据、变量声明周期
![b74f26bee0030feb81b66814318277c2.png](/assets/images/browser-gc1.png)
此时将另一个对象赋值给a属性：

```javascript
dog.a = new Object();
```

a的指向改变了，此时堆中的数组对象就成了不被使用的数据，专业名次叫做不可达的数据；
![984cb019b770cb6b7c9db7e2e6b2fc26.png](/assets/images/browser-gc2.png)


### V8 GC 算法
**一、标记**
1. 从根节点（Root）出发，遍历所有的对象；
2. 可以遍历到的对象，是可达的（reachable）；
3. 没有遍历到的对象，不可达的（unreachable）；

> 全局变量window，DOM 树， 存放在栈中的变量。。。是根节点，不可能被回收；

**二、清理**
在完成所有的标记之后，统一处理内存中所有不可达的对象；

**三、内存整理**

- 在频繁回收对象后，内存中就会存在大量不连续空间，专业名词叫【内存碎片】；
- 当内存中出现了大量内存碎片之后，如果需要分配较大的连续内存时，就有可能出现内存不足的情况；
- 某些垃圾回收器是不会产生碎片的，不需要内存整理；


### GC 时间
浏览器进行垃圾回收的时候，会暂停js脚本的执行，回收完成之后再继续执行js脚本；对于连贯性要求比较高的应用，这种机制会有很大的影响，比如游戏、动画等；

**一、分代收集**

- 临时对象【函数作用内部变量、块级作用域变量】，这类对象需要快速回收
- 长久对象【全局window、DOM、Web API】，这类对象可以放慢回收

> 这两种对象对应的回收机制不同，所有 V8把堆分为新生代和老生代两个区域，前者存放临时对象，后者存放长久对象；
> 并且让副垃圾回收器、主垃圾回收器，分别负责新生代、老生代的垃圾回收。

**二、主垃圾回收器**

负责老生代垃圾回收，有以下两个特点：
1. 对象占用空间大
2. 对象存活时间长

它使用 【标记->清除算法】

1. 首相是标记
 - 从一组跟元素开始，递归遍历这一组跟元素
 - 在这个遍历过程中，能达到的元素称为活动对象，没有达到的元素可以判断为垃圾数据；

2. 然后是垃圾清除
![a5282c936662de64eca2767e47316522.png](/assets/images/browser-gc3.png)
直接将标记为垃圾的数据清理掉；

3. 多次标记-清除🆑操纵后，会产生大量不连续的内粗碎片🧩，接下来就需要进行内存整理；

![162dc79fb14455869b2b8913b4312518.png](/assets/images/browser-gc4.png)


**三、副垃圾回收器**

负责新生代垃圾的回收，通常只支持1~8M的容量；新生代被分为两个区域：一半是对象区，一般是空闲区域；

![9c98f210d1af9519b3027569d8c7842f.png](/assets/images/browser-gc5.png)
1. 先给对象区域所有所有垃圾标记
2. 标记完成之后，存活的对象被复制到空闲区，并进行一次有序的排列；
![cfe83bb9610b9db08cba72c2a7b9eec7.png](/assets/images/browser-gc6.png)
副垃圾回收器没有内存碎片整理就是因为空闲区的对象都是有序的，没有碎片存在，也就不需要整理；
3. 复制完成之后，对象区和空闲区会进行对调。将空闲区的对象放入对象区里面；
![d2dd36dfde8025381836e73d25edb495.png](/assets/images/browser-gc7.png)
    以上就完成了垃圾回收。

因为副垃圾回收器执行频繁，所以考虑到执行效率，一般新生区的空间都会被设置很小，一旦监测到空间满了就立即执行垃圾回收操作；


### 参考链接
[1. 四个面试了解浏览器的垃圾回收机制](https://mp.weixin.qq.com/s?__biz=MzI0MzIyMDM5Ng==&mid=2649830704&idx=1&sn=e66ca7c4604ea7f396abf44e86d68dbd&chksm=f175fff3c60276e506570f5744e0ae90441d031feb2315bb9e4c73e3328a04c5647c930d770f&scene=126&sessionid=1604385669&key=7adf10a6617c63155623f3f9b469695bb10ad9136ce59f92e4d4d674f2cb3a4afb4bd5a22ce566cb3275baff4ea98ed01305e8cbcccfecd4a86ca04324a1f6d99c870122e9d4b2b009769d936d684363d887b82e976b15ed260086b457c5c59169ae864f5f8cdd57cf373e831b9f6cada3dcfd4c5bc64f5eafbf9a3338d14a90&ascene=1&uin=MjU5NDQxNzkwMQ%3D%3D&devicetype=Windows+7+x64&version=6300002f&lang=zh_CN&exportkey=Awx4%2F4pLQuFrBnSHFehDyNM%3D&pass_ticket=x02Kq9BzcPcWCTK6NLnOnUtXnhZItYdaV6xIOunbgel2%2B4GpS9k5F4PHn58EnjXf&wx_header=0)