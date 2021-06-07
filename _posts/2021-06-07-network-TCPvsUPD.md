---
layout: post
title: "TCP vs UPD"
category: network
---

###  TCP对比UPD：有什么不同之处？

在本文中，将涉及到的内容： 

- [什么是TCP？](#什么是TCP？)
- [什么是UDP？](#什么是UDP？)
- [主要的不同点](#主要的不同点)
- [TCP是怎么工作的？](#TCP是怎么工作的？)
- [UDP是怎么工作的？](#UDP是怎么工作的？)
- [TCP的特性](#TCP的特性)
- [TCP与UDP之间的不同](#TCP与UDP之间的不同)
- [TCP的应用](#TCP的应用)
- [UDP的应用](#UDP的应用)
- [TCP的优势](#TCP的优势)
- [UDP的优势](#UDP的优势)
- [TCP的劣势](#TCP的劣势)
- [UDP的劣势](#UDP的劣势)
- [什么时候使用TCP、UPD？](#什么时候使用TCP、UPD？)

#### 什么是TCP？ [回到顶部](#TCP对比UPD：有什么不同之处？)
TCP/IP 决定指定的计算机如何连接网络并且如何在这之间进行数据的传输；能在多个计算机连接网络间创建虚拟网络；
TCP/IP 代表的是 Transmission Control Protocol/Internet Protocol，是一种为了在端对端提供可靠字节流传输而设计的网络协议；

#### 什么是UDP？ [回到顶部](#TCP对比UPD：有什么不同之处？)
UDP 是一种面向数据报文的协议；UDP用于传播或组播类型的网络传输；UDP的全称是 User Datagram Protocol （用户数据报协议，数据报是与分组交换网络相关联的传输单元）；
UDP协议的工作方式几乎与TCP相似，不同的是UDP摒弃了所有的错误检测，来回间的通信信息以及可交付性；

#### 主要不同点： [回到顶部](#TCP对比UPD：有什么不同之处？)
> - TCP是一种面向连接的协议，然而UDP是一种无连接协议；
> - TCP 协议相对于UDP协议传输速度稍慢一些；
> - TCP 连接时使用像 SYN、SYN-ACK、ACK这样的握手协议，UDP 没有握手机制；
> - TCP 有错误检测机制而且可进行错误恢复，UDP也会进行错误检测，但是UDP中会丢弃发生错误的数据包；
> - TCP 中有确认段机制(acknowledgement segment)，UDP没有；
> - TCP 是一种重量级的传输协议，UDP是轻量级的协议；

#### TCP是怎么工作的？ [回到顶部](#TCP对比UPD：有什么不同之处？)
TCP建立连接需要有三次握手机制，三次握手是一个发起和确认连接的过程；一旦连接建立之后，数据便开始传输；当传输过程完成之后，通过关闭建立好的虚拟线路来终止连接；

#### UDP是怎么工作的？ [回到顶部](#TCP对比UPD：有什么不同之处？)
UDP采用一种简单的传输方式，没有隐含的握手机制用来对数据传输进行排序、保证可靠性和完整性；同时为了避免在网络接口中增加开销，UDP默认错误检测以及纠正行为不重要，或者让其在程序中自行处理；UDP也兼容数据包的广播(broadcast)和组播(multicasting)；

#### TCP与UDP的特性 [回到顶部](#TCP对比UPD：有什么不同之处？)
TCP：
- 需要发送确认（ACK）；
- 可复用；
- 当网络阻塞时延迟传输；
- 简单的错误捕获机制；

UDP：
- 支持可容忍丢包的带宽(bandwidth)密集型应用程序；
- 低延迟；
- 支持同时发送大量数据包；
- 存在数据丢包问题；
- 允许小型事务处理(如：DNS 查找)；

#### TCP与UDP之间的不同 [回到顶部](#TCP对比UPD：有什么不同之处？)

|TCP                                                                    |UDP|
|:--:                                                                   |:--:|
|面向连接的协议                                                            |无连接协议|
|将数据读取为字节流，and the message is transmitted to segment boundaries   |UDP消息包含着数据包，一个接一个发送，达到时检测完整性|
|TCP消息通过网络（Internet）从一台计算机传输到另一台计算机                       |UDP不是基于连接的，所以应用程序可以一次性发送大量数据包给另一方|
|TCP会对数据包按照指定的顺序重排                                              |UDP不会干预数据包顺序，仅仅取决于数据包本身|
|Request Header 限制大小20字节                                             |Request Header 限制大小8 字节|
|TCP是重量级协议，正式数据发送之前需要三次握手建立连接                            |UDP是轻量级的，没有连接追踪，数据排序等机制|
|TCP有错误的处理和恢复机制                                                   |UDP执行错误检测，但是会废弃错误的数据包|
|ACK机制                                                                  |没有ACK机制|
|TCP是可靠的，保证数据传送到目标路由                                           |UDP无法保证数据传输到指定路由目标|
|TCP提供了广泛的错误检测机制，进行数据流的控制和确认（ACK）                       |UDP只有一个用来统计数据包总数的错误检测机制|

#### TCP的应用 [回到顶部](#TCP对比UPD：有什么不同之处？)


#### UDP的应用 [回到顶部](#TCP对比UPD：有什么不同之处？)

#### TCP的优势 [回到顶部](#TCP对比UPD：有什么不同之处？)

#### UDP的优势 [回到顶部](#TCP对比UPD：有什么不同之处？)

#### TCP的劣势 [回到顶部](#TCP对比UPD：有什么不同之处？)

#### UDP的劣势 [回到顶部](#TCP对比UPD：有什么不同之处？)

#### 什么时候使用TCP、UPD？ [回到顶部](#TCP对比UPD：有什么不同之处？)
