> Insert Vue component into root component for Vue 3.

## `insertComponent(App, ContainerComponent?)`
> `App` component __must include default slot__.

_App.vue_:
```vue
<template>
  <div></div>
  <slot /> <!-- must use default slot -->
</template>
```

## `$insert(options, ContainerComponent?)`
- `options.component` `{Component}` **required**. 
- `options.props` `{object}` Merge to `options.component`'s props.
- `options.callback(...args1)` `{function}` When exec `$uninsert(...args2)` this function will be fired. The `args1` is from `args2`

## Usage
```js
import { createApp } from 'vue'
import insertComponent from 'vue-insert-component'
import App from './App.vue'

createApp(insertComponent(App)).mount('#app')
```

`Foo.vue` component:
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

`DialogForm.vue` component:
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
      this.$uninsert('hi', this.name)
    }
  }
})
</script>
```

## Composition API
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

`DialogForm.vue` component:
```html
<template>
  <button @click="onClose">remove this component from root component</button>
</template>

<script setup>
import { useUninsert } from 'vue-insert-component'

const uninsert = useUninsert()

function onClose() {
  uninsert('hi', 'vue')
}
</script>
```
