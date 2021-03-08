> Insert Vue component into root component for Vue 3.

## `$insert(options)`
- `options.component` `{Component}` **required**. 
- `options.props` `{object}` Merge to `options.component`'s props.
- `options.callback(...args1)` `{function}` When exec `$uninsert(...args2)` this function will be fired. The `args1` is from `args2`

## Usage
```js
import insertComponent from 'vue-insert-component'
import App from './App.vue'

insertComponent(App).mount('#app')
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