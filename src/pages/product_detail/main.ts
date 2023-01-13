// 所有样式都在这个文件，包括引入 tailwindcss
import "./style.less";

import Alpine from "alpinejs";

window.Alpine = Alpine;
declare const window: Window & { topNav: Function };
type PageState = {
  test: string;
};

let state: PageState = {
  test: "Hello World",
};

window.topNav = function () {
  return {
    back() {
      history.back();
    },
  };
};
Alpine.store("page-index", state);

//业务逻辑？？？(alpine 用起来跟 VUE 差不多？)

Alpine.start();
