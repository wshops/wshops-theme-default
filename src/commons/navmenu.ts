import { createApp } from "vue";

export function useNavMenu() {
  createApp({
    compilerOptions: {
      delimiters: ["${", "}"],
      comments: true,
    },
    data: () => ({
      mobileShow: false,
      navCategaryshow: false,
      userDroDownshow: false,
      // 购物车展示弹窗
      shopingCartshow: false,
      filter: {
        count: 50, // 页大小
        page: 1, // 当前页
      },
      isUpdate: true, // 是否到底-最后一页
      categoryList: [],
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
      // 首次加载分类
      loadCategaryData() {
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
      updateCategaryData() {
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
            this.updateCategaryData();
          }
        }
      },
      hiddenclick() {
        this.userDroDownshow = false;
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
  }).mount("#wshop-nav-menu");
}
