import { createApp } from "vue";
import { Modal } from "flowbite";
const $modalElement = document.getElementById("address-modal");
const modalOptions: any = {
  placement: "center-center",
  backdrop: "dynamic",
  backdropClasses:
    "bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40",
  closable: false,
  onHide: () => {},
  onShow: () => {},
  onToggle: () => {},
};

document
  .getElementById("addressModalCloseBt")!
  .addEventListener("click", function () {
    addressModel.hide();
  });

document
  .getElementById("addressModalCancel")!
  .addEventListener("click", function () {
    addressModel.hide();
  });
const addressModel = new Modal($modalElement, modalOptions); // 款式弹窗

export function useAddressList(address_c: any) {
  createApp({
    compilerOptions: {
      delimiters: ["${", "}"],
      comments: true,
    },
    data: () => ({
      addressList: [],
      totalNum: 1,
      page: 1,
      pageSize: 8,
      loading: false,
      addressItemList: {
        full_name: "",
        address_countries: "",
        mobile_number: "",
        country: "",
        full_address: "",
        remark: "",
      },
      addressModel: false,
      title: "新增地址",
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
        let c: number = this.page;
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
        this.getAddressList();
      },
      onPage(page: any) {
        this.page = page.page;
        this.getAddressList();
      },
      selectPage(n: number) {
        if (n === this.page) return;
        if (typeof n === "string") return;
        this.page = n;
        this.getAddressList();
      },
      // 获取收藏列表
      refreshAddressList() {
        this.closeAddressModel();
        this.page = 1;
        let params = {
          current_page: 1,
          page_size: this.pageSize,
        };
        this.loading = true;
        window.$wshop
          .api()
          .get("/api/v1/capi/address", params)
          .then((res: any) => {
            if (
              res !== null &&
              res !== undefined &&
              res.data.data.data_count > 0
            ) {
              this.addressList = res.data.data.data;
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
      // 获取收藏列表
      getAddressList() {
        let params = {
          current_page: this.page,
          page_size: this.pageSize,
        };
        this.loading = true;
        window.$wshop
          .api()
          .get("/api/v1/capi/address", params)
          .then((res: any) => {
            if (
              res !== null &&
              res !== undefined &&
              res.data.data.data_count > 0
            ) {
              this.addressList = res.data.data.data;
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
      // 展示地址列表弹窗
      showAddressModal(item: any) {
        if (item) {
          this.addressItemList = item;
          window.addressId = this.addressItemList.id;
          addressModel.show();
          this.addressModel = true;
          setTimeout(() => {
            (document.getElementById("full_name") as HTMLInputElement).value =
              this.addressItemList.full_name;
            (document.getElementById("country") as HTMLInputElement).value =
              this.addressItemList.country;
            (
              document.getElementById("mobile_number") as HTMLInputElement
            ).value = this.addressItemList.mobile_number;
            (
              document.getElementById("address_countries") as HTMLInputElement
            ).value = this.addressItemList.address_countries;
            (
              document.getElementById("full_address") as HTMLInputElement
            ).value = this.addressItemList.full_address;
            (document.getElementById("remark") as HTMLInputElement).value =
              this.addressItemList.remark;
            (
              document.getElementById("address-title") as HTMLBaseElement
            ).innerHTML = "编辑地址";
            address_c.validate();
          }, 10);
        } else {
          this.addressItemList = {
            full_name: "",
            address_countries: "",
            mobile_number: "",
            country: "",
            full_address: "",
            remark: "",
          };
          addressModel.show();
          this.addressModel = true;
          setTimeout(() => {
            (document.getElementById("full_name") as HTMLInputElement).value =
              "";
            (document.getElementById("country") as HTMLInputElement).value = "";
            (
              document.getElementById("mobile_number") as HTMLInputElement
            ).value = "";
            (
              document.getElementById("address_countries") as HTMLInputElement
            ).value = "";
            (
              document.getElementById("full_address") as HTMLInputElement
            ).value = "";
            (document.getElementById("remark") as HTMLInputElement).value = "";

            (
              document.getElementById("address-title") as HTMLBaseElement
            ).innerHTML = "新增地址";
          }, 5);
        }
      },
      // 关闭地址列表弹窗
      closeAddressModel() {
        this.addressModel = false;
        addressModel.hide();
      },
      deleteAddress(item: any) {
        window.$wshop
          .api()
          .del("/api/v1/capi/address/" + item.id)
          .then((res: any) => {
            if (res !== null && res !== undefined) {
              window.$notify.success("删除地址成功");
              this.page = 1;
              this.getAddressList();
            }
          })
          .catch((err: string) => {
            window.$notify.error(err);
          });
      },
      // submitAddress() {
      //   if (this.title === "新增地址") {
      //     window.$wshop
      //       .api()
      //       .post("/api/v1/capi/address", this.addressItemList)
      //       .then((res: any) => {
      //         if (res !== null && res !== undefined) {
      //           window.$notify.success("新增地址成功");
      //           this.closeAddressModel();
      //           this.page = 1;
      //           this.getAddressList();
      //         }
      //       })
      //       .catch((err: string) => {
      //         window.$notify.error(err);
      //       });
      //   } else {
      //     window.$wshop
      //       .api()
      //       .patch(
      //         "/api/v1/capi/address/" + this.addressItemList.id,
      //         this.addressItemList
      //       )
      //       .then((res: any) => {
      //         if (res !== null && res !== undefined) {
      //           window.$notify.success("修改地址成功");
      //           this.closeAddressModel();
      //           this.page = 1;
      //           this.getAddressList();
      //         }
      //       })
      //       .catch((err: string) => {
      //         window.$notify.error(err);
      //       });
      //   }
      // },
    },
    mounted() {
      this.init();
      window.refreshAddressList = this.refreshAddressList;
    },
    unmounted() {},
  }).mount("#wshop-addressList");
}
