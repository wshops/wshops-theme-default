// 所有样式都在这个文件，包括引入 tailwindcss
import "./style.less";
import WshopUtils from "@wshops/utils";
import { useNotify } from "../../utils/notify";
import { useNavMenu } from "../../commons/navmenu";
import { createApp } from "vue";
useNotify({
  position: "top-right",
});

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
      "/assets/images/banner4.jpg",
      "/assets/images/login-background.jpg",
      "/assets/images/pic.png",
    ],
    index: 0,
    timer: null,
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
  },
  mounted() {
    this.timer = setInterval(() => {
      this.next();
    }, 3000);
  },
  unmounted() {
    clearInterval(this.timer);
  },
}).mount("#product_show");
