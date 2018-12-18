import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export function createRouter() {
  const router = new Router({
    mode: "history",
    scrollBehavior(to, from, savedPosition) {
      if (savedPosition) {
        return savedPosition;
      } else if (to.hash) {
        return {
          selector: to.hash,
          offset: { x: 0, y: 0 }
        };
      }
      return { x: 0, y: 0 };
    },
    routes: [
      {
        path: "/",
        name: "index",
        component: () => import("@/views/index/Index")
      },
      {
        path: "/notFound",
        name: "notFound",
        component: () => import("@/views/notFound/notFound")
      }
    ]
  });

  return router;
}
