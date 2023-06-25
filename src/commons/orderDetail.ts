import { createApp } from "vue";
import { timeFormat } from "../utils/day";
export function useOrderDetail() {
  createApp({
    compilerOptions: {
      delimiters: ["${", "}"],
      comments: true,
    },
    data: () => ({
      loading: false,
      orderItem: {
        items: [],
      },
    }),
    components: {},
    computed: {},
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
      // 展示地址列表弹窗
      showOrderDetail() {
        this.orderItem = window.orderItem;
        if (this.orderItem) {
          this.orderItem.create_time = timeFormat(
            this.orderItem.create_time,
            "YYYY-MM-DD"
          );
          this.orderItem.payment_info.pay_time = timeFormat(
            this.orderItem.payment_info.pay_time,
            "YYYY-MM-DD"
          );
          this.orderItem.shipping_info
            ? (this.orderItem.shipping_info.order_complete_time = timeFormat(
                this.orderItem.shipping_info.order_complete_time,
                "YYYY-MM-DD"
              ))
            : "";
          this.orderItem.shipping_info
            ? (this.orderItem.shipping_info.shipping_time = timeFormat(
                this.orderItem.shipping_info.shipping_time,
                "YYYY-MM-DD"
              ))
            : "";
          this.orderItem.shipping_info
            ? (this.orderItem.shipping_info.received_time = timeFormat(
                this.orderItem.shipping_info.received_time,
                "YYYY-MM-DD"
              ))
            : "";
        }
      },
    },
    mounted() {
      window.showOrderDetail = this.showOrderDetail;
      // this.init();
    },
    unmounted() {},
  }).mount("#wshop-orderDetail");
}
