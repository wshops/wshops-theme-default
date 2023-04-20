import { createApp } from "vue";
import { Modal } from "flowbite";
const $modalElement = document.getElementById("crypto-modal");
const modalOptions: any = {
  placement: "center-center",
  backdrop: "dynamic",
  backdropClasses:
    "bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40",
  closable: true,
  onHide: () => {},
  onShow: () => {},
  onToggle: () => {},
};
const modalVariant = new Modal($modalElement, modalOptions); // 款式弹窗

export function useCollectList() {
  createApp({
    compilerOptions: {
      delimiters: ["${", "}"],
      comments: true,
    },
    data: () => ({
      collectList: [],
      totalNum: 1,
      page: 1,
      pageSize: 8,
      loading: false,
      variantsList: [],
      variantsModel: false,
    }),
    components: {},
    computed: {
      pageTotalNum: function () {
        return this.totalNum % this.pageSize == 0
          ? this.totalNum / this.pageSize
          : Math.floor(this.totalNum / this.pageSize) + 1;
      },
      pages: function () {
        // 每次最多显示5个页码
        let c = this.page;
        let t: number = this.pageTotalNum;
        let p = [];
        for (let i = 1; i <= t; i++) {
          p.push(i);
        }
        let l = p.length;
        if (l <= 5) {
          // 总页数<=5，显示全部页码
          return p;
        } else if (l > 5 && c <= 3) {
          // 总页数>5 && 当前页面<=3
          return [1, 2, 3, 4, "...", t];
        } else if (l > 5 && c > 3 && c <= l - 2) {
          // 总页数 > 5 && 当前页面 > 3 && 当前页 < 总页数 - 3
          return [1, "...", c - 2, c - 1, c, "...", t];
        } else {
          // 总页数 > 5 && 当前页面 > 3 && 当前页 > 总页数 - 3
          return [1, "...", t - 3, t - 2, t - 1, t];
        }
      },
    },
    watch: {
      pageSize() {
        this.page = 1;
      },
    },
    methods: {
      init() {
        this.getFavorite();
      },
      toProductDetail(item: any) {
        localStorage.setItem("productId", item.id);
        location.assign("product_detail");
      },
      onPage(page: any) {
        this.page = page.page;
        this.getFavorite();
      },
      selectPage(n: number) {
        if (n === this.page) return;
        if (typeof n === "string") return;
        this.page = n;
        this.getFavorite();
      },
      // 获取收藏列表
      getFavorite() {
        let params = {
          current_page: this.page,
          page_size: this.pageSize,
        };
        this.loading = true;
        window.$wshop
          .api()
          .get("/api/v1/capi/favorite", params)
          .then((res: any) => {
            if (res !== null && res !== undefined) {
              this.collectList = res.data.data.data;
              this.totalNum = res.data.data.data_count;
            } else {
              this.collectList = [];
            }

            this.loading = false;
          })
          .catch((err: string) => {
            this.loading = false;
            window.$notify.error(err);
          });
      },
      // 判断有无款式，有则弹窗
      isShowVariantModal(item: any) {
        if (item.variants) {
          this.showVariantModal(item);
        } else {
          this.addShopCart(item, "");
        }
      },
      // 展示购物车弹窗
      showVariantModal(item: any) {
        this.variantsList = item;
        modalVariant.show();
        this.variantsModel = true;
      },
      // 关闭购物车弹窗
      closeVariantsModel() {
        this.variantsModel = false;
        modalVariant.hide();
      },
      // 加入购物车
      addShopCart(item: any, variant_no: string) {
        let params = {
          product_id: item.id,
          variant_no: variant_no ? variant_no : "",
          quantity: 1,
        };
        window.$wshop
          .api()
          .post("/api/v1/capi/cart/item", params)
          .then((res: any) => {
            if (res !== null && res !== undefined) {
              window.$notify.success("添加购物车成功");
              localStorage.setItem(
                "cartNum",
                res.data.data.total_quantity
              );
              variant_no ? this.closeVariantsModel() : "";
            }
          })
          .catch((err: string) => {
            window.$notify.error(err);
          });
      },
    },
    mounted() {
      this.init();
    },
    unmounted() {},
  }).mount("#wshop-collectList");
}
