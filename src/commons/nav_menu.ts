import { createApp } from 'vue'

export function UseNavMenu(){
  createApp({
    compilerOptions: {
      delimiters: ['${', '}'],
      comments: true
    }
  }).mount('#wshop-nav-menu')
}