---
layout: post
title: "Map 及 WeakMap 对象"
category: javascript
---

### Map
Map 对象保存键值对，并且能够记住键的原始插入顺序；任何值(对象或者是原始值)都可以作为一个键或值；在对map新增或者移除 key 之后原有的顺序是不会受影响的，使用for..of 循环迭代时，都会按顺序返回一个 形式为 [key, value]的数组；
 
**Map 判断键值相等的逻辑**

在Map中键的判断相等逻辑除了 -0 与 0 是相等之外，其他的都是与Object.is相同（NaN 是 等于 NaN的 在这里）；
 
**Objects 与 Map的比较**
 
Map 在使用时不会出现键名污染，Object因为有原型链的原因可能会出现冲突的情况，不过在ES5 新增的Object.create(null)可以解决这个问题；Map的键值可以是任意类型的，Object则必须是String or Symbol；在ES6之前我们对 二者进行迭代的话key的顺序Object
的是不能保证的，但是ES6版本及之后Object 的 key 顺序是可以保证的；
Map的性能是优于Object的；

#### Map 与数组的关系

Map 的构造函数可以直接传入一个 数组 初始化，格式为 [[k1, v1], [k2, v2]]

Map 转数组可以使用 ... 解构或者 Array.from 方法

```js
const arrKV = [['key1', 'value1'], ['key2', 'value2']];

const map = new Map(arrKV);

map.get('key1'); // "value1"

Array.from(map); //  [['key1', 'value1'], ['key2', 'value2']];
console.log([...map]) ; //  [['key1', 'value1'], ['key2', 'value2']];
```

**Map 的复制与合并**
Map的复制即在构造函数中传入一个已存在Map 实例即可；
Map的合并与 结构语法合并对象是一致的；


**注意：**

在代码中可以显示为Map 实例添加属性，但是会有意想不到的bug或者混乱产生；

```js
const map = new Map();

map['key1'] = 'value1';

map.set('key2', 'value2');

map.get('key1'); // false
map.delete('key1'); // false

map.hasOwnProperty('key1'); // true
map.hasOwnProperty('key2'); // false

```

### WeakMap
WeakMap对象是一组键值对的集合，其中键是弱引用的。键必须是一个非基础类型的对象，但是值可以是任意类型的；

**语法**

```js
new WeakMap([iterable]) // 构造函数有一个可选参参数可迭代对象（二元数组）
```

**Why WeakMap？**

在 JavaScript 里，map API 可以通过使其四个 API 方法共用两个数组(一个存放键,一个存放值)来实现。 给这种 map 设置值时会同时将键和值添加到这两个数组的末尾。从而使得键和值的索引在两个数组中相对应。当从该 map 取值的时候，需要遍历所有的键，然后使用索引从存储值的数组中检索出相应的值。但这样的实现会有两个很大的缺点，首先赋值和搜索操作都是 O(n) 的时间复杂度( n 是键值对的个数)，因为这两个操作都需要遍历全部整个数组来进行匹配。另外一个缺点是可能会导致内存泄漏，因为数组会一直引用着每个键和值。 这种引用使得垃圾回收算法不能回收处理他们，即使没有其他任何引用存在了。相比之下，原生的 WeakMap 持有的是每个键对象的“弱引用”，这意味着在没有其他引用存在时垃圾回收能正确进行。原生 WeakMap 的结构是特殊且有效的，其用于映射的 key 只有在其没有被回收时才是有效的。正由于这样的弱引用，WeakMap 的 key 是不可枚举的 (没有方法能给出所有的 key)。 如果key 是可枚举的话，其列表将会受垃圾回收机制的影响，从而得到不确定的结果。因此，如果你想要这种类型对象的 key 值的列表，你应该使用 Map。 基本上，如果你要往对象上添加数据，又不想干扰垃圾回收机制，就可以使用 WeakMap。