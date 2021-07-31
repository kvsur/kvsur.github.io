---
layout: post
title: "小程序开发记录"
category: others
---

![https://res.wx.qq.com/wxdoc/dist/assets/img/page-lifecycle.2e646c86.png](https://res.wx.qq.com/wxdoc/dist/assets/img/page-lifecycle.2e646c86.png)

#### App 生命周期

> [https://developers.weixin.qq.com/miniprogram/dev/api/base/app/life-cycle/wx.getLaunchOptionsSync.html](https://developers.weixin.qq.com/miniprogram/dev/api/base/app/life-cycle/wx.getLaunchOptionsSync.html)

```ts
interface AppOptions {
    onLanuch({ path: string, sence: number, query: object, [x: string]: any });
    onShow({ path: string, sence: number, query: object, [x: string]: any });
    onHide();
    onError(error: string);
    onPageNotFound({ path: string, query: object, isEntryPage: boolean });
    onUnhandledRejection({ reason: string, promise: Promise<any> });
    onThemeChange({ theme: 'light'|'dark' })
}
```

### Page 生命周期

```ts
interface PageOptoins {
    data: {[x: string]: any };
    onLoad({ query: object});
    onShow();
    onReady();
    onHide();
    onUnload();
}
```

### Component 生命周期

```ts
interface ComponentOptions {
    properties: {[x: string]: any};
    data: {[x: string]: any };
    observers: {[x: string]: Function};
    behaviors: ComponentLikable;
    created();
    attached();
    ready();
    moved();
    detached();
    error();
}

type lifetimes = ComponentOptions;

interface pageLifetimes { // 组件所在页面生命周期
    show();
    hide();
    resize();
}
```