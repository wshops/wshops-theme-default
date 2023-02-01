// 所有样式都在这个文件，包括引入 tailwindcss
import "./style.less";

import Alpine from "alpinejs";
import { Tabs } from "flowbite";
import type { TabsOptions, TabsInterface, TabItem } from "flowbite";

window.Alpine = Alpine;
declare const window: Window & { topNav: Function };
type PageState = {
  test: string;
};

let state: PageState = {
  test: "Hello World",
};

const tabElements: TabItem[] = [
  {
    id: "settings",
    triggerEl: document.querySelector("#settings-tab") as HTMLElement,
    targetEl: document.querySelector("#settings") as HTMLElement,
  },
  {
    id: "collect",
    triggerEl: document.querySelector("#collect-tab") as HTMLElement,
    targetEl: document.querySelector("#collect") as HTMLElement,
  },
  {
    id: "myOrder",
    triggerEl: document.querySelector("#myOrder-tab") as HTMLElement,
    targetEl: document.querySelector("#myOrder") as HTMLElement,
  },
  {
    id: "changePw",
    triggerEl: document.querySelector("#changePw-tab") as HTMLElement,
    targetEl: document.querySelector("#changePw") as HTMLElement,
  },
  {
    id: "address",
    triggerEl: document.querySelector("#address-tab") as HTMLElement,
    targetEl: document.querySelector("#address") as HTMLElement,
  },
];

// options with default values
const options: TabsOptions = {
  defaultTabId: "settings",
  activeClasses:
    "text-blue-600 hover:text-blue-600 dark:text-blue-500 dark:hover:text-blue-400 border-blue-600 dark:border-blue-500",
  inactiveClasses:
    "text-gray-500 hover:text-gray-600 dark:text-gray-400 border-gray-100 hover:border-gray-300 dark:border-gray-700 dark:hover:text-gray-300",
  onShow: () => {
    console.log("tab is shown");
  },
};

/*
 * tabElements: array of tab objects
 * options: optional
 */
const tabs: TabsInterface = new Tabs(tabElements, options);

// open tab item based on id
tabs.show("settings");
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
    toSearch() {
      location.assign("search");
    },
    toCollect() {
      tabs.show("collect");
    },
    toMyOrder() {
      tabs.show("myOrder");
    },
    toChangePw() {
      tabs.show("changePw");
    },
    toAddress() {
      tabs.show("address");
    },
    imgUploadShow: false,
    isShowImgUpload() {
      return this.imgUploadShow === true;
    },
    showImgUpload() {
      this.imgUploadShow = true;
    },
    hideImgUpload() {
      this.imgUploadShow = false;
    },
  };
};
Alpine.store("page-index", state);

//业务逻辑？？？(alpine 用起来跟 VUE 差不多？)

Alpine.start();
