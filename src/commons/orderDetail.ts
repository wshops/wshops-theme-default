import { createApp } from "vue";
import { timeFormat } from "../utils/day";
export function useOrderDetail() {
  createApp({
    compilerOptions: {
      delimiters: ["${", "}"],
      comments: true,
    },
    data: () => ({
      orderList: [],
      totalNum: 1,
      page: 1,
      pageSize: 8,
      loading: false,
      orderItem: null,
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
      // 获取订单状态标识
      getOrderStatusText(type: number) {
        let text = "";
        switch (type) {
          case 0:
            text = "创建";
            break;
          case 2:
            text = "待定";
            break;
          case 3:
            text = "已确认";
            break;
          case 4:
            text = "搁置";
            break;
          case 5:
            text = "派送中";
            break;
          case 6:
            text = "出货";
            break;
          case 7:
            text = "已送达";
            break;
          case 8:
            text = "已取消";
            break;
          case 9:
            text = "退货";
            break;
          case 10:
            text = "退款";
            break;
          case 11:
            text = "已完成";
            break;
        }
        return text;
      },
      init() {
        this.getOrder();
      },
      toProductDetail(item: any) {
        localStorage.setItem("productId", item.id);
        location.assign("product_detail");
      },
      onPage(page: any) {
        this.page = page.page;
        this.getOrder();
      },
      selectPage(n: number) {
        if (n === this.page) return;
        if (typeof n === "string") return;
        this.page = n;
        this.getOrder();
      },
      // 获取收藏列表
      getOrder() {
        let params = {
          current_page: this.page,
          page_size: this.pageSize,
        };
        this.loading = true;
        window.$wshop
          .api()
          .get("/api/v1/capi/order", params)
          .then((res: any) => {
            if (
              res !== null &&
              res !== undefined &&
              res.data.data?.data_count > 0
            ) {
              this.orderList = res.data.data.data;
              this.orderList.forEach((item: any) => {
                if (item.create_time) {
                  item.create_time = timeFormat(item.create_time, "YYYY-MM-DD");
                }
              });
              this.totalNum = res.data.data.data_count;
            } else {
              this.orderList = [];
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
  }).mount("#wshop-orderDetail");
}
