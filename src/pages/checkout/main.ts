// 所有样式都在这个文件，包括引入 tailwindcss
import "./style.less";
import WshopUtils, { FormValidationResult } from "@wshops/utils";
import { useNotify } from "../../utils/notify";
import { useNavMenu } from "../../commons/navmenu";

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

// 修改地址信息表单校验
let order_c = wshop.newFormValidation().init([
  {
    element: document.getElementById("receiver_name")!,
    rules: [
      {
        validatorName: "required",
        invalidMessage: "收件人姓名不能为空",
      },
    ],
  },
  {
    element: document.getElementById("receiver_mobile_number")!,
    rules: [
      {
        validatorName: "required",
        invalidMessage: "收件人手机号码不能为空",
      },
      {
        customValidator: (value: string): boolean => {
          return /^\d{11}$/.test(value);
        },
        invalidMessage: "收件人手机号格式不正确",
      },
    ],
  },
  {
    element: document.getElementById("receiver_full_address")!,
    rules: [
      {
        validatorName: "required",
        invalidMessage: "收货地址不能为空",
      },
    ],
  },
  {
    element: document.getElementById("receiver_country")!,
    rules: [
      {
        validatorName: "required",
        invalidMessage: "收货人国家不能为空",
      },
    ],
  },
  {
    element: document.getElementById("receiver_mobile_country_code")!,
    rules: [
      {
        validatorName: "required",
        invalidMessage: "收货人国家号不能为空",
      },
    ],
  },
  {
    element: document.getElementById("receiver_zip_code")!,
    rules: [
      {
        validatorName: "required",
        invalidMessage: "收货人邮编不能为空",
      },
    ],
  },
  {
    element: document.getElementById("buyer_name")!,
    rules: [
      {
        validatorName: "required",
        invalidMessage: "购买人姓名不能为空",
      },
    ],
  },
  {
    element: document.getElementById("buyer_mobile")!,
    rules: [
      {
        validatorName: "required",
        invalidMessage: "购买人手机号码不能为空",
      },
      {
        customValidator: (value: string): boolean => {
          return /^\d{11}$/.test(value);
        },
        invalidMessage: "购买人手机号格式不正确",
      },
    ],
  },
  {
    element: document.getElementById("buyer_address")!,
    rules: [
      {
        validatorName: "required",
        invalidMessage: "购买人地址不能为空",
      },
    ],
  },
  {
    element: document.getElementById("remark")!,
    rules: [
      {
        validatorName: "required",
        invalidMessage: "备注不能为空",
      },
    ],
  },
  {
    element: document.getElementById("buyer_company_name")!,
    rules: [
      {
        validatorName: "required",
        invalidMessage: "购买人公司名称不能为空",
      },
    ],
  },
]);

// 获取国家号
function getCountryCode() {
  wshop
    .api()
    .get("/assets/phone.json", {})
    .then((res) => {
      if (res !== null && res !== undefined) {
        let phoneList = res.data;
        let reg_select = document.getElementById(
          "receiver_mobile_country_code"
        ); //找到select标签
        let frag = document.createDocumentFragment(); //创建文档片段，文档片段的作用就是让for循环中创建的标签先放到文档片段中，待for循环结束后直接将文档片段插入制定的标签元素内，可以减少dom的操作
        for (let i = 0; i < phoneList.length; i++) {
          let option = document.createElement("option"); //创建option标签
          option.value = phoneList[i].dial_code_num; //设置正在创建的option的value属性
          option.innerHTML = phoneList[i].dial_code_str;
          frag.appendChild(option); //将设置好的 option插入文档片段。
        }
        reg_select!.appendChild(frag);
      }
    })
    .catch((err) => {
      window.$notify.error(err);
    });
}
getCountryCode();

// 更新确认订单
document.getElementById("order-form")!.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!order_c.validate().getResult()) {
    return;
  }
  const formData = wshop.formDataToObject("order-form");
  console.log(formData);
  formData.receiver_mobile_country_code = Number(
    formData.receiver_mobile_country_code
  );
  window.$wshop
    .api()
    .post("/api/v1/capi/order", formData)
    .then((res: any) => {
      if (res !== null && res !== undefined) {
        window.$notify.success("订单确认成功");
      }
    })
    .catch((err: string) => {
      window.$notify.error(err);
    });
});

// 重置表单
document.getElementById("reset-order")!.addEventListener("click", () => {
  document.getElementById("order-form")!.reset();
});
