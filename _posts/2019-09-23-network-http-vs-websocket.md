---
layout: post
title: "Http 与 Websocket 的异同"
category: network
---

### 相同点
1. 都是在TCP协议的基础上进行通信，都是可靠性传输协议，且都是应用层协议；
2. 都需要握手，都使用Request/Response模型进行连接的建立；
3. 在连接的建立过程中对错误的处理方式相同，在这个阶段WS可能返回和HTTP相同的返回码；
4. 


### 区别点
1. Websocket是双向通信，Http 是单向通信；
2. Websocket使用http协议来建立连接，但是自定义一系列新的header域，在http中并不会使用这些域；
3. WS连接建立之后，数据的传输使用帧来传递，不再需要Request消息；
4. WS的数据帧有序；

### websocket 建立连接过程
1. 发送一个header标记了Upgrade的http 请求，服务端response的状态码是101 HTTP/1.1 101 Switching Protocols
2. 基于http方式进行连接设计目的是为了更好的兼容一些中间的服务节点，代理服务器nginx或者一些中间件服务
3. 简单的一个  WebSocket 连接
```
GET /chat HTTP/1.1
Host: server.example.com
Upgrade: websocket
Conenction: Upgrade
Sec-WebSocket-Key: x6h5fx99m6a 一个使用了Base64加密的密钥
Sec-WebSocket-Protocol: chat, superchat 应用层的子协议
Sec-WebSocket-Version: 13 告诉服务器使用的协议版本 只能指定13
Origin: http://example.com
```


```
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: HSmrc0sMlYUkAFmm50PpG2HaGwk=
Sec-WebSocket-Protocol: chat
```
4. Sec-WebSocket-Accept 这个header值表示服务器统一握手建立连接，具体的值是客户端传输的 key加上 “258EADFA5-E914-47DA-95CA-C5ABoDC85B11”