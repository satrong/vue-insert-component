定义一个容器组件，可以通过调用 API 的方式将任意组件插入到容器组件中。
> 主要用于处理对话框（模态弹窗）的场景

[English](./README.md) | 简体中文

## `insertComponent(App, ContainerComponent?)`
> `App` component __必须在根组件下设置一个默认插槽__.

_App.vue_:
```html
<template>
  <div></div>
  <slot /> <!-- 必须在根组件下设置一个默认插槽 -->
</template>
```

## `$insert(options, ContainerComponent?)`
- `options.component` `{Component}` **必须**. 
- `options.props` `{object}` 将会以 props 的形式传递给 `options.component` 的 props
- `options.callback(...args1)` `{function}` 当执行 `$pluck(...args2)` 后会触发 `callback` （参数 `args1` 来自于 `args2`）

## 使用例子

```js
import { createApp } from 'vue'
import insertComponent from 'vue-insert-component'
import App from './App.vue'

createApp(insertComponent(App)).mount('#app')
```

### Options API 使用方式

_Foo.vue_ component:
```html
<template>
  <button @click="add">insert DialogForm to root component</button>
</template>

<script>
import { defineComponent } from 'vue'
import DialogForm from './DialogForm.vue'

export default defineComponent({
  methods: {
    add() {
      this.$insert({
        component: DialogForm,
        props: {
          name: 'Vue'
        },
        callback(a, b) {
          console.log(a, b) // hi, Vue
        }
      })
    }
  }
})
</script>
```

_DialogForm.vue_ component:
```html
<template>
  <button @click="remove">remove this component from root component</button>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    name: String
  },
  methods: {
    remove() {
      this.$pluck('hi', this.name)
    }
  }
})
</script>
```

### Composition API 使用方式

```html
<template>
  <button @click="onAdd">insert DialogForm to root component</button>
</template>

<script setup>
import { useInsert } from 'vue-insert-component'
import DialogForm from './DialogForm.vue'

function onAdd() {
  useInsert({
    component: DialogForm,
    props: {
      name: 'Vue'
    },
    callback(a, b) {
      console.log(a, b) // hi, Vue
    }
  })
}
</script>
```

_DialogForm.vue_ component:
```html
<template>
  <button @click="onClose">remove this component from root component</button>
</template>

<script setup>
import { usePluck } from 'vue-insert-component'

const pluck = usePluck()

function onClose() {
  pluck('hi', 'vue')
}
</script>
```

## 给所有插入的组件添加一个容器组件

```js
import { createApp } from 'vue'
import insertComponent from 'vue-insert-component'
import App from './App.vue'
import ContainerComponent from './ContainerComponent.vue'

createApp(insertComponent(App, ContainerComponent)).mount('#app')
```

_ContainerComponent.vue_ 文件

```html
<template>
  <!-- 这里可以使用第三方组件库的对话框组件，如 ElementPlus 的 `ElDialog` 组件 -->
  <ElDialog v-model="visible" @closed="onClosed">
    <slot />
  </ElDialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const emits = defineEmits(['close'])

const visible = ref(false)
let closeArgs = []

onMounted(() => {
  visible.value = true
})

defineExpose({
  // 提供一个 `close` 方法，给 vue-insert-component 使用
  // 之所以这样做是为了在关闭的时候保留动画效果
  // 也可以不提供该方法，只是在关闭对话框的时候没有动画效果
  close(...args) {
    visible.value = false
    // 将接受的参数缓存起来，以便在 `onClosed` 事件中使用
    closeArgs = args
  }
})

function onClosed() {
  emits('close', ...closeArgs)
}
</script>
```