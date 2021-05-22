---
layout: post
title: "BFC"
category: css
---

BFC 就是块级格式化上下文（Block Formatting Context），是页面盒子模型中的一种渲染模式，相当于一个独立的容器，这个容器里面的元素和外面的元素互不影响；

**创建BFC 的方式有多种：**
- root <html>
- float 属性不是 none 的元素
- position 属性是 absolute 或者 fixed 的元素
- display 属性是 inline-block 的元素
- display 属性是 table table-cell inline-table table-row 的元素
- overflow 属性不是visible的元素
- display 属性是 flow-root的元素
- contain 属性是 layout、content 或者 paint 的元素
- display 属性是 flex、inline-flex、grid、inline-grid的元素
- 。。。

**BFC的用途：**
- 浮动定位与清除浮动
- 外边距折叠问题

