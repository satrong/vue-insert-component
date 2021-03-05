> Insert Vue component into root component for Vue 3.

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
      this.$insert(DialogForm)
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
  methods: {
    remove() {
      this.$uninsert()
      // or
      // this.$emit('uninsert', this) // must pass `this`
    }
  }
})
</script>
```