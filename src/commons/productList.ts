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
const modal = new Modal($modalElement, modalOptions);

export function useProductList() {
  createApp({
    // 修改模板字符串
    compilerOptions: {
      delimiters: ["${", "}"],
      comments: true,
    },
    data: () => ({
      mobileSearchShow: false,
      priceShow: false,
      sortDropDownShow: false,
      categoryShow: false,
      tagShow: false,
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
      productTagList: [],
      price_List: [
        {
          id: 1,
          price_name: "￥50 以内",
        },
        {
          id: 2,
          price_name: "￥50 - ￥100",
        },
        {
          id: 3,
          price_name: "￥100 - ￥150",
        },
        {
          id: 4,
          price_name: "￥150 - ￥250",
        },
        {
          id: 5,
          price_name: "￥250 - ￥400",
        },
        {
          id: 6,
          price_name: "￥400 - ￥600",
        },
        {
          id: 7,
          price_name: "￥600 及以上",
        },
      ],
      goToPage: "",
      pageSizeList: [20, 30, 50, 100],
      // showOption: false,
      categoryName: !document.getElementById("search-input")
        ? localStorage.getItem("categoryName")
        : "",
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
        this.loadCategoryData();
        this.loadProductTagData();
      },
      mobileClear() {
        let inputDom = document.getElementsByTagName("input");
        for (let i = 0; i < inputDom.length; i++) {
          let obj = inputDom[i];
          if (
            obj.type == "checkbox" &&
            obj.checked &&
            obj.id.includes("tag_")
          ) {
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
      clearTagSelect() {
        let inputDom = document.getElementsByTagName("input");
        for (let i = 0; i < inputDom.length; i++) {
          let obj = inputDom[i];
          if (
            obj.type == "checkbox" &&
            obj.checked &&
            obj.id.includes("tag_")
          ) {
            obj.checked = false;
          }
        }
      },
      clearCategorySelect() {
        let inputDom = document.getElementsByTagName("input");
        for (let i = 0; i < inputDom.length; i++) {
          let obj = inputDom[i];
          if (
            obj.type == "radio" &&
            obj.checked &&
            obj.id.includes("category_")
          ) {
            obj.checked = false;
          }
        }
      },
      // 加载标签
      loadProductTagData() {
        window.$wshop
          .api()
          .get("/api/v1/capi/product/tags")
          .then((res) => {
            if (res !== null && res !== undefined && res.data.data.length > 0) {
              this.productTagList = res.data.data;
            }
          })
          .catch((err) => {
            window.$notify.error(err);
          });
      },
      // 首次加载分类
      loadCategoryData() {
        let param = {
          page_size: this.filter.count, // 页大小
          current_page: this.filter.page, // 当前页
          // level: 1,
        };
        window.$wshop
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
      updateCategoryData() {
        let param = {
          page_size: this.filter.count, // 页大小
          current_page: this.filter.page, // 当前页
          // level: 1,
        };
        window.$wshop
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
          e.target.offsetHeight + e.target.scrollTop - e.target.scrollHeight ===
          0
        ) {
          if (this.isUpdate) {
            this.filter.page += 1;
            this.updateCategoryData();
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
          if (obj.type == "checkbox" && obj.checked) {
            check.push(obj.id);
          }
        }
        let by_hits = 0;
        let by_deals = 0;
        let low_price = -1;
        let high_price = -1;
        let category_id = "";
        let tags = "";
        for (let i = 0; i < check.length; i++) {
          if (check[i].includes("category_")) {
            category_id = check[i].split("_")[1];
          }
          if (check[i].includes("tag_")) {
            tags = tags + check[i].split("_")[1] + ",";
          }
          switch (check[i] as string) {
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
            case "price_0":
              low_price = -1;
              high_price = -1;
              break;
            case "price_1":
              low_price = 0;
              high_price = 50;
              break;
            case "price_2":
              low_price = 50;
              high_price = 100;
              break;
            case "price_3":
              low_price = 100;
              high_price = 150;
              break;
            case "price_4":
              low_price = 150;
              high_price = 250;
              break;
            case "price_5":
              low_price = 250;
              high_price = 400;
              break;
            case "price_6":
              low_price = 400;
              high_price = 600;
              break;
            case "price_7":
              low_price = 600;
              high_price = -1;
              break;
            default:
              break;
          }
        }
        tags.length > 0
          ? (tags = tags.substring(0, tags.lastIndexOf(",")))
          : "";
        window.$wshop
          .api()
          .get("/api/v1/capi/product/conditions", {
            current_page: this.page,
            page_size: this.pageSize,
            high_price: high_price,
            by_hits: by_hits,
            by_deals: by_deals,
            category_id: !document.getElementById("search-input")
              ? localStorage.getItem("categoryId")
              : category_id,
            low_price: low_price,
            tags: tags,
            word: (document.getElementById("search-input") as HTMLInputElement)
              ? (document.getElementById("search-input") as HTMLInputElement)
                  .value
              : "",
          })
          .then((res) => {
            if (
              res !== null &&
              res !== undefined &&
              res.data.data.data.length > 0
            ) {
              this.productList = res.data.data.data;
              this.totalNum = res.data.data.data_count;
            } else {
              this.productList = [];
            }
            this.loading = false;
          })
          .catch((err) => {
            window.$notify.error(err);
            this.loading = false;
          });
      },
      // prevOrNext(n: number) {
      //   this.page += n;
      //   this.page <= 1
      //     ? (this.page = 1)
      //     : this.page > this.pageTotalNum
      //     ? (this.page = this.pageTotalNum)
      //     : null;
      // },
      selectPage(n: number) {
        if (n === this.page) return;
        if (typeof n === "string") return;
        this.page = n;
        this.queryShowProduct();
      },
      // handleGoToPage() {
      //   this.page =
      //     this.goToPage <= 1
      //       ? 1
      //       : this.goToPage - 0 >= this.pageTotalNum - 0
      //       ? this.pageTotalNum
      //       : this.goToPage;
      //   this.goToPage = this.page;
      // },
      hiddenClick() {
        this.sortDropDownShow = false;
        this.tagShow = false;
        this.priceShow = false;
        this.categoryShow = false;
      },
      toProductDetail(item: any) {
        localStorage.setItem("productId", item.id);
        location.assign("product_detail");
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
        modal.show();
        this.variantsModel = true;
      },
      // 关闭购物车弹窗
      closeVariantsModel() {
        this.variantsModel = false;
        modal.hide();
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
              localStorage.setItem("cartNum", res.data.data.product_items.length);
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
      this.queryShowProduct();
      document.addEventListener("click", this.hiddenClick);
    },
    unmounted() {
      document.removeEventListener("click", this.hiddenClick);
    },
  }).mount("#productList");
}
