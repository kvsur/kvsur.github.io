---
layout: post
title: "css position 定位"
category: css
---

**position 用来指定元算在网页中的定位，一共有五种方式：**
1. static
2. relative
3. absolute
4. fixed
5. sticky

***

1. static 定位是元素的默认值，static导致的元素定位是由浏览器决定的，所以这时元素的top、right、bottom、left都将失效
> relative、fixed、absolute这三个值都有一个共同点，都是相对于某个基点定位，不同点在于基点不同；所以只要掌握了基点，就很容易掌握这三个属性值；


2. relative的定位是基于static定位的，使用top、right、bottom、left属性时是基于原始的static定位来渲染执行的；
3. absolute的定位是基于父元素，且父元素的position属性不能为static，否则会基于再上一级元素定位，直到html
4. fixed的定位是基于视窗（viewport，即浏览器窗口），top、right、bottom、left都是的值渲染是基于视窗来进行的；

> sticky 很像是relative和fixed的结合，产生动态效果；


5. sticky 必须结合top、rihgt、bottom、left其中之一进行使用，才能达到动态效果，主要用来定位偏移距离；一般使用场景包括头部nav，列表header、图片堆叠等