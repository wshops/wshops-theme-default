// 所有样式都在这个文件，包括引入 tailwindcss
import "./style.less";

import Alpine from "alpinejs";

window.Alpine = Alpine;
declare const window: Window & { topNav: Function };
type PageState = {
  test: string;
};

let state: PageState = {
  test: "Hello World",
};

window.topNav = function () {
  return {
    droDownshow: false,
    mobileShow: false,
    show: false,
    toSearch() {
      location.assign("search");
    },
    toCart() {
      location.assign("cart");
    },
    toCheckout() {
      location.assign("checkout");
    },
    // 商品类别下拉列表
    open() {
      this.show = true;
    },
    close() {
      this.show = false;
    },
    isOpen() {
      return this.show === true;
    },
    back() {
      history.back();
    },
    // 个人中心下拉列表
    droDownOpen() {
      if (this.droDownshow) {
        this.droDownshow = false;
      } else {
        this.droDownshow = true;
      }
    },
    droDownClose() {
      this.droDownshow = false;
    },
    isDroDownOpen() {
      return this.droDownshow === true;
    },
    // 购物车展示弹窗
    shopingCartshow: false,
    openShopingCart() {
      if (this.shopingCartshow) {
        this.shopingCartshow = false;
      } else {
        this.shopingCartshow = true;
      }
    },
    closeShopingCart() {
      this.shopingCartshow = false;
    },
    isOpenShopingCart() {
      return this.shopingCartshow === true;
    },
    // 手机端控制
    mobileOpen() {
      this.mobileShow = true;
    },
    mobileClose() {
      this.mobileShow = false;
    },
    mobileIsOpen() {
      return this.mobileShow === true;
    },
  };
};
Alpine.store("page-index", state);

//业务逻辑？？？(alpine 用起来跟 VUE 差不多？)

Alpine.start();
