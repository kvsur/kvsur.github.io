---
layout: post
title: "前端开发重用linux 命令"
category: tools
---

```bash
ps -aux | grep nginx
ps -ef | grep nginx 
ps -auxf | grep nginx
netstat -tunlp
tail -f -n x fileanme
# nginx path 在哪儿
which nginx
# grep 查找
grep Vue app.js

kill -9 pid

# kill 参数 -x
# HUP 1 终端断线
# INT 2 中断（同 Ctrl + C）
# QUIT 3 退出（同 Ctrl + \）
# TERM 15 终止
# KILL 9 强制终止
# CONT 18 继续（与STOP相反， fg/bg命令）
# STOP 19 暂停（同 Ctrl + Z）

# 列出所有文件查看
find dirname

# -o filename -I justheader
curl localhost:80/path -o file.log

top 

# -b, --bytes        byte为单位展示
# -k, --kilo            k为单位展示
# -m, --mega       m为单位展示
# -g, --giga           g为单位展示
free -m 
```


> [Linux常用命令 & 实用命令万字总结](https://juejin.cn/post/6844904194072117261)

> [前端&后端程序员必备的Linux基础知识](https://juejin.cn/post/6844903634036064269)
