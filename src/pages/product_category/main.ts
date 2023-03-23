// 所有样式都在这个文件，包括引入 tailwindcss
import './style.less'
import WshopUtils from '@wshops/utils'
import { useNotify } from '../../utils/notify'
import { useNavMenu } from '../../commons/navmenu'
import { useProductList } from '../../commons/productList'

useNotify({
  position: 'top-right',
})

new WshopUtils({
  feedbacks: {
    apiFeedbacks: {
      onError: (message: string): void => {
        window.$notify.closable().error(message)
      },
      onInfo: (message: string): void => {
        window.$notify.closable().info(message)
      },
      onWarning: (message: string): void => {
        window.$notify.closable().warn(message)
      },
      onUnAuthorized: (): void => {
        window.location.assign('/auth/register')
      },
      onSuccess: (message: string): void => {
        window.$notify.closable().success(message)
      },
    },
  },
})

useNavMenu()
useProductList()
