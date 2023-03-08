import "./style.less";
import WshopUtils from "@wshops/utils";
import { useNotify } from "../../utils/notify";
import { useNavMenu } from "../../commons/navmenu";
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

useNavMenu();
createApp({
  compilerOptions: {
    delimiters: ["${", "}"],
    comments: true,
  },
  data: () => ({
    imgArr: [
      "/public/assets/images/banner4.jpg",
      "/public/assets/images/login-background.jpg",
      "/public/assets/images/pic.png",
    ],
    index: 0,
    timer: null,
  }),
  components: {},
  computed: {},
  watch: {},
  methods: {
    prev() {
      if (this.index === 0) {
        this.index = this.imgArr.length - 1;
      } else {
        this.index--;
      }
    },
    next() {
      if (this.index === this.imgArr.length - 1) {
        this.index = 0;
      } else {
        this.index++;
      }
    },
    // 获取购物车
    getShopCarts() {
      window.$wshop
        .api()
        .get("/api/v1/capi/cart/item")
        .then((res: any) => {
          if (res !== null && res !== undefined) {
            this.cartsNumber = res.data.data.length;
            localStorage.setItem("cartNum", res.data.data.length);
          }
        })
        .catch((err: string) => {
          window.$notify.error(err);
        });
    },
    // 加入购物车
    addShopCart(item: any, variant_id: string) {
      let params = {
        product_id: item.id,
        variant_id: variant_id ? variant_id : "",
        quantity: 1,
      };
      window.$wshop
        .api()
        .post("/api/v1/capi/cart/item", params)
        .then((res: any) => {
          if (res !== null && res !== undefined) {
            window.$notify.success(res.message);
            localStorage.setItem("cartNum", "3");
            variant_id ? this.closeVariantsModel() : "";
          }
        })
        .catch((err: string) => {
          window.$notify.error(err);
        });
    },
  },
  mounted() {
    this.getShopCarts();
    this.timer = setInterval(() => {
      this.next();
    }, 4000);
  },
  unmounted() {
    clearInterval(this.timer);
  },
}).mount("#product_detail");
