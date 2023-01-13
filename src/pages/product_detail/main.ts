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
    // 价格区间下拉列表
    priceShow: false,
    priceOpen() {
      this.priceShow = true;
    },
    priceClose() {
      this.priceShow = false;
    },
    priceIsOpen() {
      return this.priceShow === true;
    },
    // 产品标签下拉列表
    tagShow: false,
    tagOpen() {
      this.tagShow = true;
    },
    tagClose() {
      this.tagShow = false;
    },
    tagIsOpen() {
      return this.tagShow === true;
    },
    // 尺寸大小下拉列表
    sizeShow: false,
    sizeOpen() {
      this.sizeShow = true;
    },
    sizeClose() {
      this.sizeShow = false;
    },
    sizeIsOpen() {
      return this.sizeShow === true;
    },
    clearSizeSelect() {
      var txts: any = document.getElementById("XL");
      txts.value = "";
    },
    // 排序下拉列表
    sortDropDownshow: false,
    sortDropDownOpen() {
      this.sortDropDownshow = true;
    },
    sortDropDownClose() {
      this.sortDropDownshow = false;
    },
    isSortDropDownOpen() {
      return this.sortDropDownshow === true;
    },
  };
};
Alpine.store("page-index", state);

//业务逻辑？？？(alpine 用起来跟 VUE 差不多？)

Alpine.start();
