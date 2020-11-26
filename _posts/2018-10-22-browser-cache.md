---
layout: post
title: "浏览器缓存"
category: network
---

##### 1. 强缓存
强缓存不需要发送http请求
> http1.0 使用Expires
> http2.0 使用 Cache-Control

Expires 字面理解为缓存过期时间，但是有个问题就是这个时间点可能与服务器的时间不同步问题
Cache-Control：
1. max-age=3600
2. public;
3. 

##### 2. 协商缓存

##### 3. 缓存位置

