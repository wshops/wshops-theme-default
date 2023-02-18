// 所有样式都在这个文件，包括引入 tailwindcss
import './style.less'
import WshopUtils from '@wshops/utils'
import { useNotify } from '../../utils/notify'
import Alpine from 'alpinejs'
import { createApp } from 'vue'

useNotify({
  position: 'top-right',
})
const wshop: WshopUtils = new WshopUtils({
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
window.Alpine = Alpine
declare const window: Window & {
  topNav: Function
  product: Function
}
window.topNav = function () {
  return {
    droDownshow: false,
    mobileShow: false,
    show: false,
    // 商品类别下拉列表
    open () {
      this.show = true
    },
    close () {
      this.show = false
    },
    isOpen () {
      return this.show === true
    },
    back () {
      history.back()
    },
    // 个人中心下拉列表
    droDownOpen () {
      if (this.droDownshow) {
        this.droDownshow = false
      } else {
        this.droDownshow = true
      }
    },
    droDownClose () {
      this.droDownshow = false
    },
    isDroDownOpen () {
      return this.droDownshow === true
    },
    // 购物车展示弹窗
    shopingCartshow: false,
    openShopingCart () {
      if (this.shopingCartshow) {
        this.shopingCartshow = false
      } else {
        this.shopingCartshow = true
      }
    },
    closeShopingCart () {
      this.shopingCartshow = false
    },
    isOpenShopingCart () {
      return this.shopingCartshow === true
    },
    // 手机端控制
    mobileOpen () {
      this.mobileShow = true
    },
    mobileClose () {
      this.mobileShow = false
    },
    mobileIsOpen () {
      return this.mobileShow === true
    },
    // 价格区间下拉列表
    priceShow: false,
    priceOpen () {
      this.priceShow = true
    },
    priceClose () {
      this.priceShow = false
    },
    priceIsOpen () {
      return this.priceShow === true
    },
    // 产品标签下拉列表
    tagShow: false,
    tagOpen () {
      this.tagShow = true
    },
    tagClose () {
      this.tagShow = false
    },
    tagIsOpen () {
      return this.tagShow === true
    },
    // 尺寸大小下拉列表
    sizeShow: false,
    sizeOpen () {
      this.sizeShow = true
    },
    sizeClose () {
      this.sizeShow = false
    },
    sizeIsOpen () {
      return this.sizeShow === true
    },
    clearSizeSelect () {
      var txts: any = document.getElementById('XL---')
      txts.checked = false
    },
    // 排序下拉列表
    sortDropDownshow: false,
    sortDropDownOpen () {
      this.sortDropDownshow = true
    },
    sortDropDownClose () {
      this.sortDropDownshow = false
    },
    isSortDropDownOpen () {
      return this.sortDropDownshow === true
    },
  }
}
Alpine.start()

createApp({
  data: () => ({
    productList: [],
  }),
  methods: {
    queryShowProduct (): any {
      wshop
        .api()
        .get('/api/v1/capi/product/conditions', {
          current_page: 1,
          page_size: 5,
          high_price: 120000,
          low_price: 0,
          word: '',
        })
        .then((res) => {
          if (res !== null && res !== undefined) {
            this.productList = res.data.data.data
          }
        }).catch((err) => {
        window.$notify.error(err)
      })
    }
  },
  mounted () {
    this.queryShowProduct()
  }
}).mount('#product-list')