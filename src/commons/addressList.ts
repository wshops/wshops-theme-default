import { createApp } from "vue";

export function useAddressList() {
  createApp({
    compilerOptions: {
      delimiters: ["${", "}"],
      comments: true,
    },
    data: () => ({
      filter: {
        count: 10, // 页大小
        page: 1, // 当前页
      },
    }),
    components: {},
    computed: {},
    watch: {},
    methods: {
      init() {
        this.getAddress();
      },
      // 获取收藏列表
      getAddress() {
        let params = {
          page_size: this.filter.count, // 页大小
          current_page: this.filter.page, // 当前页
        };
        this.loading = true;
        window.$wshop
          .api()
          .get("/api/v1/capi/address", params)
          .then((res: any) => {
            if (res !== null && res !== undefined) {
            }
            this.loading = false;
          })
          .catch((err: string) => {
            this.loading = false;
            window.$notify.error(err);
          });
      },
    },
    mounted() {
      this.init();
    },
    unmounted() {},
  }).mount("#wshop-addressList");
}
