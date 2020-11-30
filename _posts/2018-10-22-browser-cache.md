---
layout: post
title: "浏览器缓存"
category: network
---

![main](/assets/images/browser-cache-main.png)

浏览器中的缓存查找使用方式有两种，一个中需要发送http请求，另一种是不需要发送http请求，这两种方式分别对应：
> 强缓存｜协商缓存

***

#### 1. 强缓存

进入强缓存阶段，不需要发送http请求，那么浏览器是如何判断进入这个阶段的呢? 答案是通过特定字段检测，当然对于不同的http版本，这个字段是不尽相同的，看下面的详细介绍：

**1. http 1.0 -> Expires**

    Expires 字段表示过期时间，此字段存在与服务端Response Header里面，意在告诉浏览器在Expires 这个时间之前对于此文件可以直接使用缓存

![expires](/assets/images/browser-cache-expires.png)

**2. http 1.1 -> Cache-Control**

    在http1.0中使用的expires 字段虽然能让浏览器使用强缓存，但是如果服务器的时间和客户端的时间不一致时，就会导致缓存不能正确使用，于是在http1.1中新增了 Cache-Control 字段用于控制缓存；

![cachecontrol](/assets/images/browser-cache-cachecontrol.png)

Cache-Control 字段有多个属性可以组合使用：

- **public:** 表示响应内容可以被客户端和所有的代理服务节点缓存；
- **private:** 表示响应的内容只有客户端可以进行缓存；
- **max-age=3600:** 表示响应内容将在3600秒之后失效；
- **s-maxage=3600:** 同max-age作用一样，只在代理服务器中生效（比如CDN缓存），比如当s-maxage=60时，在这60秒中，即使更新了CDN的内容，浏览器也不会进行请求。max-age用于普通缓存，而s-maxage用于代理缓存。s-maxage的优先级高于max-age。如果存在s-maxage，则会覆盖掉max-age和Expires header；
- **no-store:** 表示响应内容不使用任何缓存机制缓存；
- **no-cache:** 表示响应内容会被客户端缓存，是否使用缓存则需要经过协商缓存来验证决定；换而言之就是不使用Cache-Control的缓存控制方式做前置验证，而是使用 Etag 或者Last-Modified字段来控制缓存；
- **max-stale=30:** 表示响应内容即使过期，如果时间是在30s以内是可以接受的；如果max-stale未设值，表示浏览器能接受任意age过期响应（age表示响应由源站生成或确认的时间与当前时间的差值）
- **min-fresh=30:** 表示希望在30s以内能获取最新的内容

举个例子🌰：

```javascript
// 所有的代理服务也是可以缓存内容的，但是两个小时之后这个缓存不能继续使用
Cache-Control: public, max-age=7200
```

**有一点需要注意的是不管是 Request 还是Response header都是可以设置定义 Cache-Control字段的；**

***

#### 2. 协商缓存

在强缓存没有命中的情况下，会进入协商缓存阶段；浏览器会在请求里面添加相应的 **缓存tag** 发送给服务器，服务根据tag来决定是否使用缓存；

- **协商缓存生效，返回304 和 Not Modified**
- **协商换粗失效，返回200 和 请求内容**

协商缓存可以通过设置两种 Request Header 缓存tag 来达到协商缓存的目的：

1. **Last-Modified && If-Modified-Since**

    浏览器会在第一次请求响应时把 last-modified 这个字段对应的时间值放入header中，浏览器收到请求之后会缓存文件和header，下次请求的时候将last-modified 的值作为 if-modified-since的值放入request header中，服务器收到这个值之后用文件的last-modified 和 收到的 if-modified-since 做比较来判断是否使用缓存；
    
2. **Etag && If-None-Match** 

    Etag 是服务器根据文件内容生成的一个唯一标示； Etag是在http1.1中加入进来为了解决 last-modified 对应文件修改稿和时间控制导致缓存计算逻辑不精确的问题，和last-modified 类似，服务端第一次响应带上Etag， 浏览器请求时用Etag作为if-none-match 发送给服务端来判断是否使用缓存；


Etag 相较于 Last-modified来说判断控制更为精确，但是因为是通过文件内容计算出来的唯一标示，会对计算性能有所损耗，相较于last-modified 只记录一个时间点，性能会差一点；另外如果两者同时在header中出现时，对于浏览器的请求，服务器会优先使用Etag来作为判断是否使用缓存条件；å

***

#### 3. 缓存位置

- **Service Worker**
- **Memory Cache**
- **Disk Cache**
- **Push Cache**


### 4. 参考

- [简书-深入理解浏览器缓存机制](https://www.jianshu.com/p/54cc04190252)
- [掘金-(1.6w字)浏览器灵魂之问，请问你能接得住几个？](https://juejin.cn/post/6844904021308735502#heading-4)

