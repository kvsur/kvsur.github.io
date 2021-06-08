---
layout: post
title: "tcp vs udp"
category: network
---

###  tcp对比udp有什么不同之处

> [TCP vs UDP: What's the Difference?](https://www.guru99.com/tcp-vs-udp-understanding-the-difference.html#1)

在本文中，将涉及到的内容： 

- [tcp/ip网络模型](#tcp\/ip网络模型)
- [什么是tcp？](#什么是tcp)
- [什么是udp？](#什么是udp)
- [主要的不同点](#主要的不同点)
- [tcp是怎么工作的？](#tcp是怎么工作的)
- [udp是怎么工作的？](#udp是怎么工作的)
- [tcp与udp的特性](#tcp与udp的特性)
- [tcp与udp之间的不同](#tcp与udp之间的不同)
- [tcp的应用](#tcp的应用)
- [udp的应用](#udp的应用)
- [tcp的优势](#tcp的优势)
- [udp的优势](#udp的优势)
- [tcp的劣势](#tcp的劣势)
- [udp的劣势](#udp的劣势)
- [什么时候使用tcp、udp？](#什么时候使用tcp和udp)

#### tcp/ip网络模型
[回到顶部](#tcp对比udp有什么不同之处)

> [OSI 七层模型和TCP/IP模型及对应协议（详解）](https://blog.csdn.net/qq_41923622/article/details/85805003)

计算机与网络设备要相互通信，双方就必须基于相同的方法。比如，如何探测到通信目标、由哪一边先发起通信、使用哪种语言进行通信、怎样结束通信等规则都需要事先确定。不同的硬件、操作系统之间的通信，所有的这一切都需要一种规则。而我们就把这种规则称为协议（protocol）。
TCP/IP 是互联网相关的各类协议族的总称，比如：TCP，UDP，IP，FTP，HTTP，ICMP，SMTP 等都属于 TCP/IP 族内的协议。
TCP/IP模型是互联网的基础，它是一系列网络协议的总称。

这些协议可以划分为四层，分别为链路层、网络层、传输层和应用层。
- 链路层：负责封装和解封装IP报文，发送和接受ARP/RARP报文等；
- 网络层：负责路由以及把分组报文发送给目标网络或主机；
- 传输层：负责对报文进行分组和重组，并以TCP或UDP协议格式封装报文；
- 应用层：负责向用户提供应用程序，比如HTTP、FTP、Telnet、DNS、SMTP等；

![process](https://img-blog.csdnimg.cn/20190105161812494.gif)

![table](https://img-blog.csdnimg.cn/20190105164025264.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQxOTIzNjIy,size_16,color_FFFFFF,t_70)

![header](https://img-blog.csdnimg.cn/20190105164101657.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQxOTIzNjIy,size_16,color_FFFFFF,t_70)

![7-5-1](https://img-blog.csdnimg.cn/20190105165022790.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQxOTIzNjIy,size_16,color_FFFFFF,t_70)

![7-5-2](https://img-blog.csdnimg.cn/20190105165116628.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQxOTIzNjIy,size_16,color_FFFFFF,t_70)

![7-5-3](https://img-blog.csdnimg.cn/20190105165204409.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQxOTIzNjIy,size_16,color_FFFFFF,t_70)

#### 什么是tcp
[回到顶部](#tcp对比udp有什么不同之处)

传输控制协议（TCP，Transmission Control Protocol）是一种面向连接的、可靠的、基于字节流的传输层通信协议，由IETF的RFC 793 定义。
TCP旨在适应支持多网络应用的分层协议层次结构。 连接到不同但互连的计算机通信网络的主计算机中的成对进程之间依靠TCP提供可靠的通信服务。TCP假设它可以从较低级别的协议获得简单的，可能不可靠的数据报服务。 原则上，TCP应该能够在从硬线连接到分组交换或电路交换网络的各种通信系统之上操作。

#### 什么是udp
[回到顶部](#tcp对比udp有什么不同之处)

udp 是一种面向数据报文的协议；udp用于传播或组播类型的网络传输；udp的全称是 User Datagram Protocol （用户数据报协议，数据报是与分组交换网络相关联的传输单元）；
udp协议的工作方式几乎与tcp相似，不同的是udp摒弃了所有的错误检测，来回间的通信信息以及可交付性；

#### 主要的不同点
[回到顶部](#tcp对比udp有什么不同之处)

> - tcp是一种面向连接的协议，然而udp是一种无连接协议；
> - tcp 协议相对于udp协议传输速度稍慢一些；
> - tcp 连接时使用像 SYN、SYN-ACK、ACK这样的握手协议，udp 没有握手机制；
> - tcp 有错误检测机制而且可进行错误恢复，udp也会进行错误检测，但是udp中会丢弃发生错误的数据包；
> - tcp 中有确认段机制(acknowledgement segment)，udp没有；
> - tcp 是一种重量级的传输协议，udp是轻量级的协议；

#### tcp是怎么工作的
[回到顶部](#tcp对比udp有什么不同之处)

tcp建立连接需要有三次握手机制，三次握手是一个发起和确认连接的过程；一旦连接建立之后，数据便开始传输；当传输过程完成之后，借助四次握手机制， 通过关闭建立好的虚拟线路来终止连接；

> [百度百科：三次握手协议](https://baike.baidu.com/item/%E4%B8%89%E6%AC%A1%E6%8F%A1%E6%89%8B%E5%8D%8F%E8%AE%AE)

三次握手流程：（一开始client处于closed状态，server处于listen状态）
1. 建立连接时候 client 发送 syn 同步序列号 包到服务器（syn=x），然后状态更新为syn_send，等待server确认并返回；
2. server收到 client 的 syn 包（状态更新为 receive_syn）后进行确认包返回（ack=x+1），同时server也要发送一个syn包（syn=y），即发送的包就是（syn + ack），状态更新为 syn_send；
3. client收到server的syn+ack包，状态更新为receive_syn，然后向server发送 ack(ack = y + 1)，状态更新为send_ack，server收到ack包后状态更新为receive_ack;最后一个包发送完成并被收到之后client和server的状态都更新为 established;

![threetimes_shakehand](https://bkimg.cdn.bcebos.com/pic/a1ec08fa513d26977c74304855fbb2fb4316d87b?x-bce-process=image/watermark,image_d2F0ZXIvYmFpa2U3Mg==,g_7,xp_5,yp_5/format,f_auto)

三次握手中的一些重要的概念：
1. 未连接队列：在三次握手协议中，服务器维护一个未连接队列，该队列为每个客户端的SYN包（syn=j）开设一个条目，该条目表明服务器已收到SYN包，并向客户发出确认，正在等待客户的确认包。这些条目所标识的连接在服务器处于Syn_RECV状态，当服务器收到客户的确认包时，删除该条目，服务器进入ESTABLISHED状态。
2. SYN-ACK重传次数：服务器发送完SYN－ACK包，如果未收到客户确认包，服务器进行首次重传，等待一段时间仍未收到客户确认包，进行第二次重传，如果重传次数超过系统规定的最大重传次数，系统将该连接信息从半连接队列中删除。注意，每次重传等待的时间不一定相同。
3. 半连接存活时间：是指半连接队列的条目存活的最长时间，也即服务从收到SYN包到确认这个报文无效的最长时间，该时间值是所有重传请求包的最长等待时间总和。有时我们也称半连接存活时间为Timeout时间、SYN_RECV存活时间

#### udp是怎么工作的
[回到顶部](#tcp对比udp有什么不同之处)

udp采用一种简单的传输方式，没有隐含的握手机制用来对数据传输进行排序、保证可靠性和完整性；同时为了避免在网络接口中增加开销，udp默认错误检测以及纠正行为不重要，或者让其在程序中自行处理；udp也兼容数据包的广播(broadcast)和组播(multicasting)；

#### tcp与udp的特性
[回到顶部](#tcp对比udp有什么不同之处)

tcp：
- 需要发送确认（ACK）；
- 可复用；
- 当网络阻塞时延迟传输；
- 简单的错误捕获机制；

udp：
- 支持可容忍丢包的带宽(bandwidth)密集型应用程序；
- 低延迟；
- 支持同时发送大量数据包；
- 存在数据丢包问题；
- 允许小型事务处理(如：DNS 查找)；

#### tcp与udp之间的不同
[回到顶部](#tcp对比udp有什么不同之处)

|tcp|udp| 备注 |
|:--:|:--:|:--:|
|面向连接的协议|无连接协议| |
|将数据读取为字节流，and the message is transmitted to segment boundaries|udp消息包含着数据包，一个接一个发送，达到时检测完整性| |
|tcp消息通过网络（Internet）从一台计算机传输到另一台计算机|udp不是基于连接的，所以应用程序可以一次性发送大量数据包给另一方| |
|tcp会对数据包按照指定的顺序重排|udp不会干预数据包顺序，仅仅取决于数据包本身| |
|Request Header 限制大小20字节|Request Header 限制大小8 字节| |
|tcp是重量级协议，正式数据发送之前需要三次握手建立连接|udp是轻量级的，没有连接追踪，数据排序等机制| |
|tcp有错误的处理和恢复机制|udp执行错误检测，但是会废弃错误的数据包| |
|ACK机制|没有ACK机制| |
|tcp是可靠的，保证数据传送到目标路由|udp无法保证数据传输到指定路由目标| |
|tcp提供了广泛的错误检测机制，进行数据流的控制和确认（ACK）|udp只有一个用来统计数据包总数的错误检测机制| |

#### tcp的应用
[回到顶部](#tcp对比udp有什么不同之处)

- 帮助在不同类型计算机之间建立连接；
- 支持局域网单位间网络互联互通；（It enables the internetworking between the organizations.）
- 支持两台特定计算机之间建立网络连接；


#### udp的应用
[回到顶部](#tcp对比udp有什么不同之处)

- udp协议主要用于对时间敏感的应用程序以及处理那些来自大流量的请求的小查询的服务器；
- udp用于在整个网络上发送和多播发送数据包广播兼容；
- udp也用于域名系统（Domain Name System）、Voice over IP（VoIp）、在线游戏等应用；

#### tcp的优势
[回到顶部](#tcp对比udp有什么不同之处)

- 在不同类型计算机建建立连接；
- 独立于操作系统运行；
- 支持多路有协议；
- 支持局域网单位间建立连接；
- tcp/ip 协议支持高可扩展CS架构；

#### udp的优势
[回到顶部](#tcp对比udp有什么不同之处)

- udp从不要求应用程序使用基于连接的通信模型，这也是分布式应用程序启动低延迟的原因；
- 使用udp协议的数据包接收方是的数据包不受管理，which also includes block boundaries.
- 可以使用udp进行广播或多播传输；
- 小型事务支持（DNS 查询）；
- 对能忍受数据丢失的带宽密集型应用程序友好；

#### tcp的劣势
[回到顶部](#tcp对比udp有什么不同之处)

- tcp 不会在没有明确所有的数据包确认的情况结束传输任务；
- 不支持广播或多播；
- 


#### udp的劣势
[回到顶部](#tcp对比udp有什么不同之处)

#### 什么时候使用tcp和udp
[回到顶部](#tcp对比udp有什么不同之处)

