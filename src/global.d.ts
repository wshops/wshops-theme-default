import { Alpine as AlpineType } from "alpinejs";
import { Notify } from "./utils/notify";
import WshopUtils from "@wshops/utils";
import "@hcaptcha/types";

declare global {
  interface Window {
    Alpine: AlpineType;

    $notify: Notify;

    $wshop: WshopUtils;
    refreshAddressList: Function;
    addressId: "";
  }
}
