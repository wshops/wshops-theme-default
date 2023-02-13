// 所有样式都在这个文件，包括引入 tailwindcss
import "./style.less";

import Alpine from "alpinejs";
import { Tabs, Modal } from "flowbite";
import type { TabsOptions, TabsInterface, TabItem } from "flowbite";
import WshopUtils, { FormValidationResult } from "@wshops/utils";
import { useNotify } from "../../utils/notify";
useNotify({
  position: "top-right",
});

window.Alpine = Alpine;
/****** 初始化 ******/
const wshop: WshopUtils = new WshopUtils({
  feedbacks: {
    formValidationFeedbacks: {
      onValid: (result: FormValidationResult): void => {
        if (
          (result.inputElement as HTMLInputElement).labels !== null &&
          (result.inputElement as HTMLInputElement).labels!.length > 0
        ) {
          (result.inputElement as HTMLInputElement).labels![0].className =
            "block mb-2 text-sm font-medium text-green-700 dark:text-green-500";
        }
        result.inputElement.className =
          "bg-green-50 border border-green-500 text-green-900 dark:text-green-400 placeholder-green-700 dark:placeholder-green-500 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-green-500";
        if (document.getElementById(result.inputElement.id + "-error") !== null)
          document.getElementById(result.inputElement.id + "-error")!.remove();
      },
      onInvalid: (result: FormValidationResult): void => {
        if (
          (result.inputElement as HTMLInputElement).labels !== null &&
          (result.inputElement as HTMLInputElement).labels!.length > 0
        ) {
          (result.inputElement as HTMLInputElement).labels![0].className =
            "block mb-2 text-sm font-medium text-red-700 dark:text-red-500";
        }
        result.inputElement.className =
          "bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 block w-full p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500";
        if (result.message !== null) {
          if (
            document.getElementById(result.inputElement.id + "-error") ===
              null ||
            document.getElementById(result.inputElement.id + "-error") ===
              undefined
          ) {
            result.inputElement.insertAdjacentHTML(
              "afterend",
              `<p class="mt-2 text-sm text-red-600 dark:text-red-500" id="${result.inputElement.id}-error">${result.message}</p>`
            );
          } else {
            document.getElementById(
              result.inputElement.id + "-error"
            )!.innerHTML = <string>result.message;
          }
        }
      },
    },
    apiFeedbacks: {
      onError: (message: string): void => {
        window.$notify.closable().error(message);
      },
      onInfo: (message: string): void => {
        window.$notify.closable().info(message);
      },
      onWarning: (message: string): void => {
        window.$notify.closable().warn(message);
      },
      onUnAuthorized: (): void => {
        window.location.assign("/auth/register");
      },
      onSuccess: (message: string): void => {
        window.$notify.closable().success(message);
      },
    },
  },
});

// n.closable().info('hello world')

/************ UI交互及动效逻辑 ************/
//页面交互业务逻辑？？？(alpine 用起来跟 VUE 差不多？)

/***************** 结束 *****************/

/************ 表单验证配置 ************/
// 初始化验证器实例并定义表单验证规则（如果开启 async 模式则声明完规则自动开始校验每一次的输入）
let c = wshop.vd(true).init([
  {
    element: document.getElementById("mobilePhone")!,
    rules: [
      {
        validatorName: "required",
        invalidMessage: "手机号不能为空",
      },
    ],
  },
]);

/*************** 结束 ****************/

// set the modal menu element
const $targetEl = document.getElementById("modalEl");

// options with default values
const optionsModal: any = {
  placement: "center-center",
  backdrop: "dynamic",
  backdropClasses:
    "bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40",
  closable: false,
  onHide: () => {
    console.log("modal is hidden");
    c = wshop.vd(true).init([
      {
        element: document.getElementById("mobilePhone")!,
        rules: [
          {
            validatorName: "required",
            invalidMessage: "手机号不能为空",
          },
        ],
      },
    ]);
    codeCheck = {};
    (document.getElementById("code") as HTMLInputElement).value = "";
    (document.getElementById("mobilePhone") as HTMLInputElement).value = "";
  },
  onShow: () => {
    console.log("modal is shown");
  },
  onToggle: () => {
    console.log("modal has been toggled");
  },
};

const modalMobile = new Modal($targetEl, optionsModal);

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
    // 打开修改手机号弹窗
    openMobileModal() {
      document.getElementById("mobileContent")!.style.display = "block";
      document.getElementById("codeContent")!.style.display = "none";
      modalMobile.show();
    },
    hideMobileModal() {
      document.getElementById("mobileContent")!.style.display = "block";
      document.getElementById("codeContent")!.style.display = "none";
      modalMobile.hide();
    },
  };
};
let codeCheck: any;
document.getElementById("mobile-form")!.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!c.validate().getResult()) {
    return;
  }

  const formData = wshop.formDataToObject("mobile-form");
  if (
    formData["h-captcha-response"] !== undefined &&
    formData["h-captcha-response"] !== null &&
    formData["h-captcha-response"] !== ""
  ) {
    formData["captcha_token"] = formData["h-captcha-response"];
    delete formData["h-captcha-response"];
    delete formData["g-recaptcha-response"];
  }
  // wshop
  //   .api()
  //   .post("/api/v1/capi/auth/login", formData)
  //   .then((res) => {
  //     if (res !== null && res !== undefined) {
  //       console.log(res);
  //       //has valid response
  //       location.assign("login");
  //     }
  //   })
  //   .catch((err) => {
  //     window.$notify.error(err).then(() => {
  //      hcaptcha.reset('hcaptcha-block')
  //   })
  //   });
  console.log(formData);
  document.getElementById("mobileContent")!.style.display = "none";
  document.getElementById("codeContent")!.style.display = "block";
  (document.getElementById("code") as HTMLInputElement)
    ? (codeCheck = wshop.vd(true).init([
        {
          element: document.getElementById("code")!,
          rules: [
            {
              validatorName: "required",
              invalidMessage: "验证码不能为空",
            },
          ],
        },
      ]))
    : "";
});

document.getElementById("code-form")!.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!codeCheck.validate().getResult()) {
    return;
  }
  const formData = wshop.formDataToObject("code-form");
  wshop
    .api()
    .post("/api/v1/capi/auth/login", formData)
    .then((res) => {
      if (res !== null && res !== undefined) {
        console.log(formData);
        document.getElementById("mobileContent")!.style.display = "block";
        document.getElementById("codeContent")!.style.display = "none";
        modalMobile.hide();
      }
    })
    .catch((err) => {
      window.$notify.error(err);
    });
});

Alpine.store("page-index", state);

//业务逻辑？？？(alpine 用起来跟 VUE 差不多？)

Alpine.start();
