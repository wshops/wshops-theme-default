import "./style.less";
import Alpine from "alpinejs";
import WshopUtils, { FormValidationResult } from "@wshops/utils";
import { useNotify } from "../../utils/notify";

useNotify({
  position: "top-right",
});
/****** 初始化 ******/
window.Alpine = Alpine;
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

Alpine.start();
/***************** 结束 *****************/

/************ 表单验证配置 ************/
// 初始化验证器实例并定义表单验证规则（如果开启 async 模式则声明完规则自动开始校验每一次的输入）
let c = wshop.vd(true).init([
  {
    element: document.getElementById("username")!,
    rules: [
      {
        validatorName: "required",
        invalidMessage: "用户名不能为空",
      },
    ],
  },
  {
    element: document.getElementById("password")!,
    rules: [
      {
        validatorName: "required",
        invalidMessage: "密码不能为空",
      },
      {
        customValidator: (value: string): boolean => {
          return value.length >= 6;
        },
        invalidMessage: "密码长度不能小于6位",
      },
    ],
  },
  {
    element: document.getElementById("email")!,
    rules: [
      {
        validatorName: "required",
        invalidMessage: "邮箱不能为空",
      },
      {
        validatorName: "email",
        invalidMessage: "邮箱格式不正确",
      },
    ],
  },
  {
    element: document.getElementById("code")!,
    rules: [
      {
        validatorName: "required",
        invalidMessage: "验证码不能为空",
      },
    ],
  },
]);
/*************** 结束 ****************/

document.getElementById("register-form")!.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!c.validate().getResult()) {
    return;
  }
  const formData = wshop.formDataToObject("register-form");
  if (
    formData["h-captcha-response"] !== undefined &&
    formData["h-captcha-response"] !== null &&
    formData["h-captcha-response"] !== ""
  ) {
    formData["captcha_token"] = formData["h-captcha-response"];
    delete formData["h-captcha-response"];
    delete formData["g-recaptcha-response"];
  }
  formData["password"] = wshop.md5(formData["password"] as string);
  wshop
    .api()
    .post("/api/v1/capi/auth/login", formData)
    .then((res) => {
      if (res !== null && res !== undefined) {
        console.log(res);
        //has valid response
        location.assign("login");
      }
    })
    .catch((err) => {
      window.$notify.error(err).then(() => {
        hcaptcha.reset("hcaptcha-block");
      });
    });
});
