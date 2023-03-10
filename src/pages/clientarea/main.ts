import "./style.less";
import { Tabs, Modal } from "flowbite";
import type { TabsOptions, TabsInterface, TabItem } from "flowbite";
import WshopUtils, { FormValidationResult } from "@wshops/utils";
import { useNotify } from "../../utils/notify";
import { useNavMenu } from "../../commons/navmenu";
import { useCollectList } from "../../commons/collectList";
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
  onShow: () => {},
  onToggle: () => {},
};

const modalMobile = new Modal($targetEl, optionsModal);

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

document.getElementById("mobile-bt")!.addEventListener("click", () => {
  document.getElementById("mobileContent")!.style.display = "block";
  document.getElementById("codeContent")!.style.display = "none";
  modalMobile.show();
});

document.getElementById("mobileModalCloseBt")!.addEventListener("click", () => {
  document.getElementById("mobileContent")!.style.display = "block";
  document.getElementById("codeContent")!.style.display = "none";
  modalMobile.hide();
});

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

document.getElementById("imgUpload")!.addEventListener("mouseover", () => {
  document.getElementById("isShowImgUpload")!.style.display = "block";
});

document.getElementById("imgUpload")!.addEventListener("mouseleave", () => {
  document.getElementById("isShowImgUpload")!.style.display = "none";
});

useCollectList();
