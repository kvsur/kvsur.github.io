---
layout: post
title: "Vue 组件之间的通信"
category: vue
---

Vue 组件间的通信方式

---
1. props
2. vuex
3. $emit
4. eventbus
5. provide && inject
---

### EventBus 简介
**EventBus** 又称为事件总线。在Vue中可以使用 **EventBus** 来作为沟通桥梁的概念，就像是所有组件共用相同的事件中心，可以向该中心注册发送事件或接收事件，所以组件都可以上下平行地通知其他组件，但也就是太方便所以若使用不慎，就会造成难以维护的灾难，因此才需要更完善的Vuex作为状态管理中心，将通知的概念上升到共享状态层次。

##### 1. 全局bus
直接将bus挂载到Vue.prototype上

#####2. 局部bus
通过导出一个bus在需要的组件中引入使用的方式

---

### provide && inject
在**Reac**t中有一个上下文**Context**，组件可以通过**Context**向任意后代传值，而**Vue**的**provide与inject**的作用于**Context**的作用基本一样

自动表单组件
```vue
<template>
  <form class="custom-form">
    <slot></slot>
  </form>
</template>
<script>
export default {
  props: {
    // 控制表单元素的大小
    size: {
      type: String,
      default: 'default',
      // size 只能是下面的四个值
      validator(value) {
        return ['default', 'large', 'small', 'mini'].includes(value)
      }
    },
    // 控制表单元素的禁用状态
    disabled: {
      type: Boolean,
      default: false
    }
  },
  // 通过provide将当前表单实例传递到所有后代组件中
  provide() {
    return {
      customForm: this
    }
  }
}
</script>
```

自定义表单项
```vue
<template>
  <div class="custom-form-item">
    <label class="custom-form-item__label">{{ label }}</label>
    <div class="custom-form-item__content">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    label: {
      type: String,
      default: ''
    }
  }
}
</script>
```

最后自定义输入框
```vue
<template>
  <div
    class="custom-input"
    :class="[
      `custom-input--${getSize}`,
      getDisabled && `custom-input--disabled`
    ]"
  >
    <input class="custom-input__input" :value="value" @input="$_handleChange" />
  </div>
</template>
<script>
/* eslint-disable vue/require-default-prop */
export default {
  props: {
    // 这里用了自定义v-model
    value: {
      type: String,
      default: ''
    },
    size: {
      type: String
    },
    disabled: {
      type: Boolean
    }
  },
  // 通过inject 将form组件注入的实例添加进来
  inject: ['customForm'],
  computed: {
    // 通过计算组件获取组件的size, 如果当前组件传入，则使用当前组件的，否则是否form组件的
    getSize() {
      return this.size || this.customForm.size
    },
    // 组件是否禁用
    getDisabled() {
      const { disabled } = this
      if (disabled !== undefined) {
        return disabled
      }
      return this.customForm.disabled
    }
  },
  methods: {
    // 自定义v-model
    $_handleChange(e) {
      this.$emit('input', e.target.value)
    }
  }
}
</script>
```
**Inject**的写法不止一种方式，还有下面的写法：
```js
{
	inject: {
		injectAttr: {
			default: () => ({ value: 12})
		}
	},
	inject: {
		injectAttr: {
			from: 'originInjectAttr',
			defualt: () => ({value: false})
		}
	}
}
```