---
layout: post
title: "Simple URL Parser"
category: algorithm
---


```js
/**
 * 
 * @param { string } url 地址
 * @param { boolean } urlEncoded url是否已被 decodeURI 操作
 * 参数传入一个URL 对URL进行解析
 * 
 */
function parse(url, urlDecoded = true) {
    if (!url) return {};

    if (!urlDecoded) {
        url = decodeURI(url);
    }
    const regex = /^([^:]*)?(?::\/\/)?([^\/:]+)(?::([0-9]+))?([^?#]+)(?:\?([^#]+))?(#[^?]+)?(?:\?([^#]+))?/;
    const paramRegex = /([^=&]+)=([^&]+)/;

    const matched = url.match(regex);

    const [match, protocol = '', host = '', port = '', pathname = '', query1 = '', hash = '', query2 = ''] = matched;

    const query = query1 || query2;

    const hostname = host + ':' + port;

    let params = {};

    if (query) {
        const queries = query.match(new RegExp(paramRegex, 'g'));
        queries.reduce((pre, item) => {
            const [_, key, value=''] = item.match(paramRegex);
            pre[key] = value;
            return pre;
        }, params);
    }

    return {
        url: match,
        protocol,
        host,
        hostname,
        port,
        pathname,
        query,
        hash,
        params,
    };
}
```