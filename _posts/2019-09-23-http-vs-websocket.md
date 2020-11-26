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