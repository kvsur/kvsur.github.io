---
layout: post
title: "Regular Sort"
category: algorithm
---

```javascript
let result = [];

function uglifySort(list) {
    if (!list || list.length < 2) {
        return [...(list || [])];
    }

    // 循环♻️每一个项作为入口，然后检测是否能满足条件
    for (let index = 0; index < list.length; index++) {
        result = [];
        if (checkLoad(list[index], index, [...list])) return [...result];
    }

    return [];
}

/**
 * 
 * @param {number} item 
 * @param {number} index 
 * @param {[]} copyList 
 * @returns 
 */
function checkLoad(item, index, copyList) {
    result.push(item);
    // 当数组清空时则所有项满足条件 返回
    if (copyList.length <= 1) return true;

    const double = item * 2, oneThird = item / 3;

    copyList.splice(index, 1);

    if (copyList.includes(double)) {
        // 通过递归操作判断下个符合条件的项
        return checkLoad(double, copyList.indexOf(double), copyList);
    } else if (copyList.includes(oneThird)) {
        // 通过递归操作判断下个符合条件的项
        return checkLoad(oneThird, copyList.indexOf(oneThird), copyList);
    }

    return false;
}

const list = [6,3,4,12,9,8];

console.log(uglifySort(list))

```
