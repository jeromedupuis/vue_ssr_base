<template>
  <layout-app class="page-index">
    <div class="layout-page_body page--inner">{{ getText }}</div>
  </layout-app>
</template>

<script>
import { mapGetters } from "vuex";
import LayoutApp from "@/components/layouts/Layout";

export default {
  components: {
    LayoutApp
  },
  asyncData({ store }) {
    store.dispatch("setText", "Hello, World !!");
  },
  computed: {
    ...mapGetters(["getText"])
  }
};
</script>
