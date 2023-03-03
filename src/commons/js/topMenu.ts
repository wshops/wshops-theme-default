// 所有样式都在这个文件，包括引入 tailwindcss
import "./style.less";
import WshopUtils from "@wshops/utils";
import { useNotify } from "../../utils/notify";
import { createApp } from "vue";

useNotify({
  position: "top-right",
});
const wshop: WshopUtils = new WshopUtils({
  feedbacks: {
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

createApp({
  // 修改模板字符串
  compilerOptions: {
    delimiters: ["${", "}"],
    comments: true,
  },
  data: () => ({
    mobileShow: false,
    mobileSearchShow: false,
    show: false,
    droDownshow: false,
    // 购物车展示弹窗
    shopingCartshow: false,
  }),
  components: {},
  computed: {},
  watch: {},
  methods: {
    init() {
      this.loadCategaryData();
    },
    toSearch() {
      location.assign("search");
    },
    mobileClear() {
      let inputDom = document.getElementsByTagName("input");
      for (let i = 0; i < inputDom.length; i++) {
        let obj = inputDom[i];
        if (obj.type == "checkbox" && obj.checked && obj.id.includes("tag_")) {
          obj.checked = false;
        }
        if (
          (obj.type == "radio" &&
            obj.checked &&
            obj.id.includes("category_")) ||
          obj.id.includes("low")
        ) {
          obj.checked = false;
        }
      }
    },
    // 首次加载分类
    loadCategaryData() {
      let param = {
        page_size: this.filter.count, // 页大小
        current_page: this.filter.page, // 当前页
        level: 1,
      };
      wshop
        .api()
        .get("/api/v1/capi/product_category", param)
        .then((res) => {
          if (
            res !== null &&
            res !== undefined &&
            res.data.data.data.length > 0
          ) {
            this.categoryList = res.data.data.data;
            this.total = res.data.data.data_count;
          }
        })
        .catch((err) => {
          window.$notify.error(err);
        });
    },
    // 下拉分类数据更新加载
    updateCategaryData() {
      let param = {
        page_size: this.filter.count, // 页大小
        current_page: this.filter.page, // 当前页
        level: 1,
      };
      wshop
        .api()
        .get("/api/v1/capi/product_category", param)
        .then((res) => {
          if (
            res !== null &&
            res !== undefined &&
            res.data.data.data.length > 0
          ) {
            let list = this.categoryList;
            res.data.data.data.forEach(function (item: any) {
              list.push(item);
            });
            this.categoryList = list;
            this.total = res.data.data.data_count;
          } else {
            this.filter.page -= 1;
            if (res.data.data.data.length == 0) {
              this.isUpdate = false;
            } else {
              window.$notify.error("加载失败");
            }
          }
        })
        .catch((err) => {
          this.filter.page -= 1;
          window.$notify.error(err);
        });
    },
    // 监听下拉事件
    scrollEvent(e: any) {
      if (
        e.srcElement.offsetHeight +
          e.srcElement.scrollTop -
          e.srcElement.scrollHeight ===
        0
      ) {
        if (this.isUpdate) {
          this.filter.page += 1;
          this.updateCategaryData();
        }
      }
    },
    hiddenclick() {
      this.droDownshow = false;
      this.shopingCartshow = false;
    },
  },
  mounted() {
    this.init();
    document.addEventListener("click", this.hiddenclick);
  },
  unmounted() {
    document.removeEventListener("click", this.hiddenclick);
  },
}).mount("#topMenu");
