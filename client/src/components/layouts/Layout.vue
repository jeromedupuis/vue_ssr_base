<template>
  <div class="layout-app">
    <layout-topbar />
    <layout-header />

    <div class="layout-wrapper">
      <div class="layout-body"><slot /></div>
    </div>
    <layout-footer />
    <layout-copyright />
  </div>
</template>

<script>
import LayoutTopbar from "./Topbar";
import LayoutHeader from "./Header";
import LayoutFooter from "./Footer";
import LayoutCopyright from "./Copyright";

export default {
  components: {
    LayoutTopbar,
    LayoutHeader,
    LayoutFooter,
    LayoutCopyright
  }
};
</script>
