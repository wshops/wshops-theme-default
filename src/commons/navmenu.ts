import { createApp } from 'vue'

export function useNavMenu(){
  createApp({
    compilerOptions: {
      delimiters: ['${', '}'],
      comments: true
    }
  }).mount('#wshop-nav-menu')
}