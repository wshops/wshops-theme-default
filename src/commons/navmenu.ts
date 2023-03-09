import { debug } from "console";
import { createApp } from "vue";

// 监听内部存储
let localStorageMock = (function (win) {
  let storage = win.localStorage;
  return {
    setItem: function (key: string, value: string) {
      let setItemEvent: any = new Event("setItemEvent");
      let oldValue = storage[key];
      setItemEvent.key = key;
      // 新旧值深度判断，派发监听事件
      if (oldValue !== value) {
        setItemEvent.newValue = value;
        setItemEvent.oldValue = oldValue;
        win.dispatchEvent(setItemEvent);
        storage[key] = value;
        return true;
      }
      return false;
    },
    getItem: function (key: string) {
      return storage[key];
    },
    removeItem: function (key: string) {
      storage[key] = null;
      return true;
    },
    clear: function () {
      storage.clear();
      return true;
    },
    key: function (index: number) {
      return storage.key(index);
    },
  };
})(window);

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
  writable: true,
});

export function useNavMenu() {
  createApp({
    compilerOptions: {
      delimiters: ["${", "}"],
      comments: true,
    },
    data: () => ({
      mobileShow: false,
      categoryListShow: false,
      userDroDownShow: false,
      // 购物车展示弹窗
      cartShow: false,
      filter: {
        count: 50, // 页大小
        page: 1, // 当前页
      },
      isUpdate: true, // 是否到底-最后一页
      categoryList: [],
      cartsNumber: 0,
      cartsList: [],
      loading: false,
    }),
    components: {},
    computed: {},
    watch: {},
    methods: {
      init() {
        this.loadCategoryData();
      },
      toProductCategory(item: any) {
        localStorage.setItem("categoryId", item.id);
        localStorage.setItem("categoryName", item.category_name);
        location.assign("product_category");
      },
      toSearch() {
        location.assign("search");
      },
      // 首次加载分类
      loadCategoryData() {
        let param = {
          page_size: this.filter.count, // 页大小
          current_page: this.filter.page, // 当前页
          level: 1,
        };
        window.$wshop
          .api()
          .get("/api/v1/capi/product_category", param)
          .then((res: any) => {
            if (
              res !== null &&
              res !== undefined &&
              res.data.data.data.length > 0
            ) {
              this.categoryList = res.data.data.data;
              this.total = res.data.data.data_count;
            }
          })
          .catch((err: string) => {
            window.$notify.error(err);
          });
      },
      // 下拉分类数据更新加载
      updateCategoryData() {
        let param = {
          page_size: this.filter.count, // 页大小
          current_page: this.filter.page, // 当前页
          level: 1,
        };
        window.$wshop
          .api()
          .get("/api/v1/capi/product_category", param)
          .then((res: any) => {
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
          .catch((err: string) => {
            this.filter.page -= 1;
            window.$notify.error(err);
          });
      },
      // 监听下拉事件
      scrollEvent(e: any) {
        if (
          e.target.offsetHeight + e.target.scrollTop - e.target.scrollHeight ===
          0
        ) {
          if (this.isUpdate) {
            this.filter.page += 1;
            this.updateCategoryData();
          }
        }
      },
      hiddenClick() {
        this.userDroDownShow = false;
        this.cartShow = false;
      },
      // 获取购物车
      getShopCarts(loading: boolean) {
        this.loading = loading;
        window.$wshop
          .api()
          .get("/api/v1/capi/cart/item")
          .then((res: any) => {
            if (res !== null && res !== undefined) {
              this.cartsNumber = res.data.data.length;
              this.cartsList = res.data.data.length > 0 ? res.data.data : [];
              localStorage.setItem("cartNum", res.data.data.length);
            }
            this.loading = false;
          })
          .catch((err: string) => {
            this.loading = false;
            window.$notify.error(err);
          });
      },
      toProductDetail(item: any) {
        localStorage.setItem("productId", item.product_id);
        location.assign("product_detail");
      },
      // 删除购物车
      delShopCarts(item: any) {
        let params = [
          {
            product_id: item.product_id,
            variant_id: item.variant_id,
          },
        ];
        window.$wshop
          .api()
          .del("/api/v1/capi/cart/item", params)
          .then((res: any) => {
            if (res !== null && res !== undefined) {
              window.$notify.success("移除成功");
              this.getShopCarts(true);
            }
          })
          .catch((err: string) => {
            window.$notify.error(err);
          });
      },
      // 编辑购物车
      editShopCarts(item: any) {
        let params = {
          product_id: item.product_id,
          variant_id: item.variant_id ? item.variant_id : "",
          quantity: item.quantity,
          new_variant_id: item.variant_id ? item.variant_id : "",
        };
        window.$wshop
          .api()
          .patch("/api/v1/capi/cart/item", params)
          .then((res: any) => {
            if (res !== null && res !== undefined) {
              window.$notify.success("更新购物车成功");
              // this.getShopCarts();
            }
          })
          .catch((err: string) => {
            window.$notify.error(err);
          });
      },
      cutCartCount(item: any) {
        item.quantity = item.quantity - 1;
        this.editShopCarts(item);
      },
      addCartCount(item: any) {
        item.quantity = item.quantity + 1;
        this.editShopCarts(item);
      },
    },
    mounted() {
      this.init();
      this.getShopCarts(true);
      document.addEventListener("click", this.hiddenClick);
      // window.addEventListener("storage", (e) => {
      //   console.log("别的浏览器页签storage发生变化啦:", e);
      // });
      window.addEventListener("setItemEvent", (e: any) => {
        if (e.key === "cartNum") {
          this.cartsNumber = e.newValue;
        }
      });
    },
    unmounted() {
      document.removeEventListener("click", this.hiddenClick);
    },
  }).mount("#wshop-nav-menu");
}
