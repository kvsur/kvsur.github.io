---
layout: post
title: "Web Component"
category: javascript
---

Web Component 是一套封装 **自定义** 可重用 HTML 定制元素的技术；其核心技术主要包括：
1. Custom Elements
2. Shadow DOM
3. Template && Slot


### 基本定义方式

1. CustomElementsRegistry.define(name, Clazz, options)
2. Clazz 可以有两种方式
    1. 自主定制元素：必须继承 HTMLElement 类， 使用方式为<defined-name></defined-name>
    2. 自定义内置元素：可以继承 HTMLDIVElement、HTMLHTMLParagraphElement 等，使用方式为 <div is='defined-name'></div>
3. 以上两种方式都可以使用 template && slot
4. 最终需要 通过attachShadow 返回的shadow 和document 进行conenct

### 关于自定义元素的name 参数
1. 需要满足特定规则
2. 特定规则参考 [html.spec.whatwg.org](https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name)

### CustomElementsRegistry 实例方法
1. define(name： 自定义元素名称， constructor：自定义元素构造器，options：{ extends: 指定继承已创建好的元素}): void
2. get: (name: 已经通过define 自定义的元素的名称): 返回对应的的构造器，如果未曾定义则返回undefined
3. upgrade:(rootNode：已经通过document.createElement 定义的节点): void; 在该节点通过define定义前后皆可通过upgrade 进行升级
4. whenDefine(name): Promise<any>; 如果name 不满足规则， 会reject 一个 SyntaxError 
5. 以上方法都不能通过构造实例使用，会提示Illegal Error，在全局对象customElements 中可以直接使用；

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <button id="upgrade">upgrade</button>
    <licheng-hello id="hello">hello world!!!</licheng-hello>
    <script src="./main.js"></script>
</body>
</html>
```

```javascript
const btn = document.getElementById('upgrade');
const helloEl = document.getElementById('hello');

class Hello extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        const style = document.createElement('style');
        style.textContent = `
            .hello {
                color: orange;
                background-color: grey;
                padding: 5px 15px;
                border-radius: 4px;
                display: inline-block;
                width: 200px;
                text-align: center;
            }
        `;

        const div = document.createElement('div');
        div.classList.add('hello');
        div.innerHTML = '<span>(hello licheng ^_^)</span>';

        shadow.appendChild(style);
        shadow.appendChild(div);
    }
}

// whenDefine
customElements.whenDefined('licheng-hello').then(res => {
    console.log('when define licheng-hello', res);

    // upgrade
    customElements.upgrade(helloEl);
}).catch(reason=> {
    console.error(reason);
});

btn.onclick = e => {
    // get
    const definedHello = customElements.get('licheng-hello');

    if (typeof definedHello === 'function') return;
    // define
    customElements.define('licheng-hello', Hello);
}
```


### Web Component 生命周期
1. connectedCallback: 自定义元素第一次被连接（挂载）到DOM 时调用；
2. disconnectedCallback: 当自定义元素于DOM 文档断开连接时调用；
3. adoptedCallback: 当自定义元素被移动到新文档时被调用
4. attributeChangedCallback: 当自定义元素的一个属性被增加、移除或更改时被调用

> MDN 官方生命周期使用DEMO [life-cycle-callbacks](https://github.com/mdn/web-components-examples/blob/master/life-cycle-callbacks/main.js)




