---
layout: post
title: "js 四舍五入操作"
category: javascript
---

1.丢弃小数部分,保留整数部分
parseInt(7/2)

2.向上取整,有小数就整数部分加1
Math.ceil(7/2)

3,四舍五入
Math.round(7/2)

4,向下取整
Math.floor(7/2)

5、保留小数位数
10.989.toFixed(2) // 10.99
10.984.toFixed(2) // 10.98

6、javascript多位数四舍五入的通用方法

```javascript
//num表示要四舍五入的数,v表示要保留的小数位数。
function decimal(num,v) {
  var vv = Math.pow(10,v);
  return Math.round(num*vv)/vv;
}
```