import '../../commons/tailwindbase.less'
import Alpine from 'alpinejs'

/****** 初始化 ******/
window.Alpine = Alpine
// n.closable().info('hello world')

/************ UI交互及动效逻辑 ************/
//页面交互业务逻辑？？？(alpine 用起来跟 VUE 差不多？)
window.Alpine = Alpine
declare const window: Window & { topNav: Function }

window.topNav = function () {
  return {
    toLogin () {
      location.assign('login')
    },
    toRegister () {
      location.assign('register')
    },
  }
}
Alpine.start()
/*************** 结束 ****************/
