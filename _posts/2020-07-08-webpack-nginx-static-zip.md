---
layout: post
title: "webpack 配合nginx 做静态压缩"
category: tools
---

[https://www.nginx.cn/doc/optional/gzipstatic.html](https://www.nginx.cn/doc/optional/gzipstatic.html)

1. webpack 使用 compression-webpack-plugin 压缩大文件；
2. nginx 默认不安装 gzip_static 模块；
3. 进入nginx 源码安装目录
4. ./configure ${oldConfigure} --with-http_gzip_static_module
5. make ngxin
6. stop 当前运行的nginx并备份，拷贝最新nginx 到当前nginx 目录
7. 重启