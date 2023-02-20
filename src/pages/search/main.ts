// 所有样式都在这个文件，包括引入 tailwindcss
import "./style.less";
import WshopUtils from "@wshops/utils";
import { useNotify } from "../../utils/notify";
import Alpine from "alpinejs";
import { createApp } from "vue";
import PhPager from "ph-pager";

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
window.Alpine = Alpine;
declare const window: Window & {
  topNav: Function;
  product: Function;
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
      var txts: any = document.getElementById("XL---");
      txts.checked = false;
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

createApp({
  data: () => ({
    productList: [],
    loading: false,
    page: 1,
    totalNum: 1,
    pageSize: 8,
    isUpdate: true, // 是否到底-最后一页
    filter: {
      count: 10, // 页大小
      page: 1, // 当前页
    },
    categoryList: [], // 列表数据集合
    total: 0, // 一共有多少条数据
  }),
  components: {
    PhPager,
  },
  methods: {
    // 首次加载
    loadData() {
      let param = {
        page_size: this.filter.count, // 页大小
        current_page: this.filter.page, // 当前页
        level: 1,
      };
      wshop
        .api()
        .get("/api/v1/capi/product_category", param)
        .then((res) => {
          if (res !== null && res !== undefined && res.data.data.length > 0) {
            this.categoryList = res.data.data;
            this.total = res.data.total;
          }
        })
        .catch((err) => {
          window.$notify.error(err);
        });
    },
    // 下拉数据更新加载
    updateData() {
      let param = {
        page_size: this.filter.count, // 页大小
        current_page: this.filter.page, // 当前页
        level: 1,
      };
      wshop
        .api()
        .get("/api/v1/capi/product_category", param)
        .then((res) => {
          if (res !== null && res !== undefined && res.data.data.length > 0) {
            let list = this.categoryList;
            res.data.data.forEach(function (item: any) {
              list.push(item);
            });
            this.categoryList = list;
            this.total = res.data.total;
          } else {
            this.filter.page -= 1;
            if (res.data.data.length == 0) {
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
    scrollEvent(e: any) {
      if (
        e.srcElement.offsetHeight +
          e.srcElement.scrollTop -
          e.srcElement.scrollHeight ===
        0
      ) {
        if (this.isUpdate) {
          this.filter.page += 1;
          this.updateData();
        } else {
          console.log("到底了");
        }
      }
    },
    onPage(page: any) {
      this.page = page.page;
      this.queryShowProduct();
    },
    queryShowProduct(): any {
      this.loading = true;
      let inputDom = document.getElementsByTagName("input");
      let check = [];
      for (let i = 0; i < inputDom.length; i++) {
        let obj = inputDom[i];
        if (obj.type == "radio" && obj.checked) {
          check.push(obj.value);
        }
      }
      let by_hits = 0;
      let by_deals = 0;
      switch (check[0]) {
        case "default":
          by_hits = 0;
          by_deals = 0;
          break;
        case "hitNum-low-high":
          by_hits = 1;
          break;
        case "hitNum-high-low":
          by_hits = -1;
          break;
        case "deals-low-hight":
          by_deals = 1;
          break;
        case "deals-hight-low":
          by_deals = -1;
          break;
        default:
          break;
      }
      wshop
        .api()
        .get("/api/v1/capi/product/conditions", {
          current_page: this.page,
          page_size: this.pageSize,
          high_price: 120000,
          by_hits: by_hits,
          by_deals: by_deals,
          low_price: 0,
          word: (document.getElementById("search-input") as HTMLInputElement)
            .value,
        })
        .then((res) => {
          if (res !== null && res !== undefined) {
            this.productList = res.data.data.data;
            this.totalNum = res.data.data.data_count;
          }
          this.loading = false;
        })
        .catch((err) => {
          window.$notify.error(err);
          this.loading = false;
        });
    },
  },
  mounted() {
    this.queryShowProduct();
    this.loadData();
  },
}).mount("#product-list");
Alpine.start();
