import "./style.less";
import WshopUtils from "@wshops/utils";
import { useNotify } from "../../utils/notify";
import { useNavMenu } from "../../commons/navmenu";
import { createApp } from "vue";
import { Modal } from "flowbite";

useNotify({
  position: "top-right",
});

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

new WshopUtils({
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

useNavMenu();
createApp({
  compilerOptions: {
    delimiters: ["${", "}"],
    comments: true,
  },
  data: () => ({
    imgArr: [
      // "/assets/images/banner4.jpg",
      // "/assets/images/login-background.jpg",
      // "/assets/images/banner4.jpg",
    ],
    index: 0,
    timer: null,
    productDetail: {},
    loading: false,
    variantsList: [],
    variantsModel: false,
    itemNum: 1,
  }),
  components: {},
  computed: {},
  watch: {},
  methods: {
    prev() {
      clearInterval(this.timer);
      if (this.index === 0) {
        this.index = this.imgArr.length - 1;
      } else {
        this.index--;
      }
      this.timer = setInterval(() => {
        this.next();
      }, 3000);
    },
    next() {
      clearInterval(this.timer);
      if (this.index === this.imgArr.length - 1) {
        this.index = 0;
      } else {
        this.index++;
      }
      this.timer = setInterval(() => {
        this.next();
      }, 3000);
    },
    // 获取产品详情
    getProductDetail() {
      this.loading = true;
      let params = {
        word: localStorage.getItem("productId"),
      };
      window.$wshop
        .api()
        .get("/api/v1/capi/product/detail/" + params.word)
        .then((res: any) => {
          if (res !== null && res !== undefined) {
            this.productDetail = res.data.data;
            this.imgArr = this.productDetail.pictures;
          }
        })
        .catch((err: string) => {
          window.$notify.error(err);
        })
        .finally(() => {
          this.loading = false;
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
        quantity: this.itemNum,
      };
      window.$wshop
        .api()
        .post("/api/v1/capi/cart/item", params)
        .then((res: any) => {
          if (res !== null && res !== undefined) {
            window.$notify.success("添加购物车成功");
            localStorage.setItem("cartNum", res.data.data.total_quantity);
            variant_no ? this.closeVariantsModel() : "";
          }
        })
        .catch((err: string) => {
          window.$notify.error(err);
        });
    },
  },
  mounted() {
    this.getProductDetail();
    this.timer = setInterval(() => {
      this.next();
    }, 3000);
  },
  unmounted() {
    clearInterval(this.timer);
  },
}).mount("#product_detail");
