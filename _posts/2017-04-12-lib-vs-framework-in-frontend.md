---
layout: post
title: '前端开发js框架与库的区别'
category: javascript
---

![main](/assets/images/fkvslib-main.png)

> 框架（Frameworks）、库（Librarys）

> 前端开发的迅速崛起，javascript 开发技术更是日新月异。最初的开发者从刀耕火种时代过渡到如今的百花齐放，在过渡时期，各式各样的框架和库如春笋一般破土而出，出现前端开发的圈子里面。而这些框架或者是库出现的原因，无非就是解决日常开发中遇到的各种问题的不同的解决方案，开发者都有一个意识就是DRY（don't repeat yourself），就是所谓的造轮子，通过使用框架和库实现的各种解决方案来达到效率、便捷、高性能的应用开发。框架和库本身并没有什么魔法的地方，两者都是一些可供复用的且能更快解决问题的不同方案；

虽然框架和库都是可复用的解决方案的实现，但它们之间的区别是什么呢？不然为什么不统一的叫框架或者叫做库；

Java开发中有个框架叫做Spring，在Spring中有个核心概念（功能）叫做控制反转IoC（Inversion of Control），而这里所说的框架与库的本质区别就在于此，两者的控制权不相同，在使用框架的过程中是 IoC的过程；

![1](/assets/images/fkvslib-1.png)

**库：**
    库是更多是一个封装好的特定的集合，提供给开发者使用，而且是特定于某一方面的集合（方法和函数），库没有控制权，控制权在使用者手中，在库中查询需要的功能在自己的应用中使用，我们可以从封装的角度理解库；

**框架：**
    框架一套结构化的解决方案，会基于自身的特点向用户提供一套相对完整的解决方案，而且控制权的在框架本身，使用者要找框架所规定的某种规范进行开发。

至于框架与库之间的关联，这里通过一所房子来做一个简单的隐喻：
> 房子建造的时候都需要是需要进行结构图纸设计的，而图纸的设计结构就决定了这所房子的整体框架，这个没有办法改变的，在建造过程的砌砖粉刷装修操作是灵活的；完成之后这所房子需要有家具🪑🛋️装饰，不管是自己做还是去宜家或其他家具城购买，都有相当多的选择权，甚至是家具在房子里的组合、摆放等，都可以随心所欲；

这里的家具就可以被隐喻成库，前者的图纸结构对应成框架，它们之间的关联就很明显的展示出来，看下面两张图：

![1](/assets/images/fkvslib-2.png)
![1](/assets/images/fkvslib-3.png)


实际前端开发中，Vue、Angular、Ember、Backbone等是开发框架，React、Axios、jQery、undersunderscore等是开发库；

![1](/assets/images/fkvslib-vue.png)

![1](/assets/images/fkvslib-react.png)

可能对于React为什么也是开发库会疑惑，与官方声称的一样，React 就是一个用于构建UI的库。
具体可以看下这里：
> [Is React library or a framework?](https://develoger.com/is-reactjs-library-or-a-framework-a14786f681a0)


> Frameworks do define entire application ecosystems, if that is not the case then we are not talking about the framework. Simple as that (or is it?).
> 框架是很明确的定义了整个应用程序生态系统，如果不是这样，那么我们就不在谈论框架。 就这么简单（难道不是吗？）。

