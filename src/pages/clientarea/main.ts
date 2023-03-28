import "./style.less";
import { Tabs, Modal } from "flowbite";
import type { TabsOptions, TabsInterface, TabItem } from "flowbite";
import WshopUtils, { FormValidationResult } from "@wshops/utils";
import { useNotify } from "../../utils/notify";
import { useNavMenu } from "../../commons/navmenu";
import { useCollectList } from "../../commons/collectList";
import { useAddressList } from "../../commons/addressList";

useNotify({
  position: "top-right",
});

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
useNavMenu();

// 初始化验证器实例并定义表单验证规则（如果开启 async 模式则声明完规则自动开始校验每一次的输入）
// 手机号弹窗校验
let c = wshop.newFormValidation().init([
  {
    element: document.getElementById("mobile")!,
    rules: [
      {
        validatorName: "required",
        invalidMessage: "手机号不能为空",
      },
    ],
  },
]);
// 修改密码表单校验
let password_c = wshop.newFormValidation().init([
  {
    element: document.getElementById("old_password")!,
    rules: [
      {
        validatorName: "required",
        invalidMessage: "旧密码不能为空",
      },
    ],
  },
  {
    element: document.getElementById("new_password")!,
    rules: [
      {
        validatorName: "required",
        invalidMessage: "新密码不能为空",
      },
    ],
  },
]);

// 修改地址信息表单校验
let address_c = wshop.newFormValidation().init([
  {
    element: document.getElementById("full_name")!,
    rules: [
      {
        validatorName: "required",
        invalidMessage: "顾客名称不能为空",
      },
    ],
  },
  {
    element: document.getElementById("mobile_number")!,
    rules: [
      {
        validatorName: "required",
        invalidMessage: "手机号码不能为空",
      },
    ],
  },
  // {
  //   element: document.getElementById("full_address")!,
  //   rules: [
  //     {
  //       validatorName: "required",
  //       invalidMessage: "收货地址不能为空",
  //     },
  //   ],
  // },
  // {
  //   element: document.getElementById("mobile_country_code")!,
  //   rules: [
  //     {
  //       validatorName: "required",
  //       invalidMessage: "国家号不能为空",
  //     },
  //   ],
  // },
  // {
  //   element: document.getElementById("country")!,
  //   rules: [
  //     {
  //       validatorName: "required",
  //       invalidMessage: "国家不能为空",
  //     },
  //   ],
  // },
]);

// 修改用户信息表单验证
let userInfo_c = wshop.newFormValidation().init([
  {
    element: document.getElementById("username")!,
    rules: [
      {
        validatorName: "required",
        invalidMessage: "用户名称不能为空",
      },
    ],
  },
  {
    element: document.getElementById("birthday")!,
    rules: [
      {
        validatorName: "required",
        invalidMessage: "出生日期不能为空",
      },
    ],
  },
  {
    element: document.getElementById("billing_address")!,
    rules: [
      {
        validatorName: "required",
        invalidMessage: "地址不能为空",
      },
    ],
  },
]);

const $targetEl = document.getElementById("modalEl");
const optionsModal: any = {
  placement: "center-center",
  backdrop: "dynamic",
  backdropClasses:
    "bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40",
  closable: false,
  onHide: () => {
    c = wshop.vd(true).init([
      {
        element: document.getElementById("mobile")!,
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
    (document.getElementById("mobile") as HTMLInputElement).value = "";
  },
  onShow: () => {
    setTimeout(() => {
      // 手机号验证
      document
        .getElementById("mobile-form")!
        .addEventListener("submit", (e) => {
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
            formData["captcha"] = formData["h-captcha-response"];
            delete formData["h-captcha-response"];
            delete formData["g-recaptcha-response"];
          }
          wshop
            .api()
            .patch("/api/v1/capi/user/mobile/verify", formData)
            .then((res) => {
              if (res !== null && res !== undefined) {
                console.log(formData);
                document.getElementById("mobileContent")!.style.display =
                  "none";
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
              }
            })
            .catch((err) => {
              window.$notify.error(err).then(() => {
                hcaptcha.reset("hcaptcha-block");
              });
            });
        });
    }, 300);
  },
  onToggle: () => {},
};
const modalMobile = new Modal($targetEl, optionsModal); // 修改手机号弹窗

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
const options: TabsOptions = {
  defaultTabId: "settings",
  activeClasses:
    "text-blue-600 hover:text-blue-600 dark:text-blue-500 dark:hover:text-blue-400 border-blue-600 dark:border-blue-500",
  inactiveClasses:
    "text-gray-500 hover:text-gray-600 dark:text-gray-400 border-gray-100 hover:border-gray-300 dark:border-gray-700 dark:hover:text-gray-300",
  onShow: () => {},
};
const tabs: TabsInterface = new Tabs(tabElements, options);
tabs.show("settings");

let codeCheck: any;

// 获取验证码
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

// 确认修改手机号
document.getElementById("mobile-bt")!.addEventListener("click", () => {
  document.getElementById("mobileContent")!.style.display = "block";
  document.getElementById("codeContent")!.style.display = "none";
  modalMobile.show();
});

// 关闭手机号验证弹窗
document.getElementById("mobileModalCloseBt")!.addEventListener("click", () => {
  document.getElementById("mobileContent")!.style.display = "block";
  document.getElementById("codeContent")!.style.display = "none";
  modalMobile.hide();
});

// tab页面切换
document.getElementById("collect-tab")!.addEventListener("click", () => {
  tabs.show("collect");
});
document.getElementById("myOrder-tab")!.addEventListener("click", () => {
  tabs.show("myOrder");
});
document.getElementById("changePw-tab")!.addEventListener("click", () => {
  tabs.show("changePw");
});
document.getElementById("address-tab")!.addEventListener("click", () => {
  tabs.show("address");
});

// 展示隐藏头像
document.getElementById("imgUpload")!.addEventListener("mouseover", () => {
  document.getElementById("isShowImgUpload")!.style.display = "block";
});

document.getElementById("imgUpload")!.addEventListener("mouseleave", () => {
  document.getElementById("isShowImgUpload")!.style.display = "none";
});

// 修改密码
document.getElementById("password-form")!.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!password_c.validate().getResult()) {
    return;
  }
  const formData = wshop.formDataToObject("password-form");
  // if (
  //   formData["h-captcha-response"] !== undefined &&
  //   formData["g-recaptcha-response"] !== undefined
  // ) {
  //   formData["captcha"] = formData["h-captcha-response"];
  //   delete formData["h-captcha-response"];
  //   delete formData["g-recaptcha-response"];
  // }
  formData["old_password"] = wshop.md5(formData["old_password"] as string);
  formData["new_password"] = wshop.md5(formData["new_password"] as string);
  wshop
    .api()
    .patch("/api/v1/capi/user/password", formData)
    .then((res) => {
      if (res !== null && res !== undefined) {
        window.$notify.success("修改成功");
        (document.getElementById("old_password") as HTMLInputElement).value =
          "";
        (document.getElementById("new_password") as HTMLInputElement).value =
          "";
      }
    })
    .catch((err) => {
      window.$notify.error(err);
    });
});

// 更新用户
document.getElementById("userInfo-form")!.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!userInfo_c.validate().getResult()) {
    return;
  }
  const formData = wshop.formDataToObject("userInfo-form");
  formData.birthday = dayjs(formData.birthday).valueOf();
  formData.nick_name = "admin";
  formData.real_name = "admin";
  formData.avatar_url =
    "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg";
  wshop
    .api()
    .patch("/api/v1/capi/user", formData)
    .then((res) => {
      if (res !== null && res !== undefined) {
        window.$notify.success("修改成功");
        getUserInfo();
      }
    })
    .catch((err) => {
      window.$notify.error(err);
    });
});

// 更新地址
document.getElementById("address-form")!.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!address_c.validate().getResult()) {
    return;
  }
  const formData = wshop.formDataToObject("address-form");
  console.log(formData);
  if (
    (document.getElementById("address-title") as HTMLBaseElement).innerHTML ===
    "新增地址"
  ) {
    window.$wshop
      .api()
      .post("/api/v1/capi/address", formData)
      .then((res: any) => {
        if (res !== null && res !== undefined) {
          window.$notify.success("新增地址成功");
          window.refreshAddressList();
        }
      })
      .catch((err: string) => {
        window.$notify.error(err);
      });
  } else {
    formData.id = window.addressId;
    window.$wshop
      .api()
      .patch("/api/v1/capi/address/" + formData.id, formData)
      .then((res: any) => {
        if (res !== null && res !== undefined) {
          window.$notify.success("修改地址成功");
          window.refreshAddressList();
        }
      })
      .catch((err: string) => {
        window.$notify.error(err);
      });
  }
});

// 获取用户信息
function getUserInfo() {
  document.getElementById("user-loading")!.style.display = "block";
  document.getElementById("user-info-content")!.style.display = "none";
  window.$wshop
    .api()
    .get("/api/v1/capi/user")
    .then((res: any) => {
      if (res !== null && res !== undefined) {
        document.getElementById("user-loading")!.style.display = "none";
        document.getElementById("user-info-content")!.style.display = "block";
        let userInfo = res.data.data;
        (document.getElementById("mobilePhone") as HTMLInputElement).value =
          userInfo.mobile ? userInfo.mobile : "";
        (document.getElementById("username") as HTMLInputElement).value =
          userInfo.username;
        (document.getElementById("avatar_url") as HTMLInputElement).src =
          userInfo.avatar_url;
        (document.getElementById("email") as HTMLInputElement).value =
          userInfo.email ? userInfo.email : "";
        (document.getElementById("gender") as HTMLInputElement).value =
          userInfo.gender;
        (document.getElementById("birthday") as HTMLInputElement).value =
          userInfo.birthday && userInfo.birthday > 0
            ? dayjs(userInfo.birthday).format("YYYY-MM-DD")
            : "1990-01-01"; // todo
        (document.getElementById("billing_address") as HTMLInputElement).value =
          userInfo.billing_address;
      }
    })
    .catch((err: string) => {
      document.getElementById("user-loading")!.style.display = "none";
      document.getElementById("user-info-content")!.style.display = "block";
      window.$notify.error(err);
    })
    .finally(() => {
      document.getElementById("user-loading")!.style.display = "none";
      document.getElementById("user-info-content")!.style.display = "block";
    });
}

// 获取用户信息
getUserInfo();

// 收藏列表
useCollectList();

// 地址列表
useAddressList(address_c);
