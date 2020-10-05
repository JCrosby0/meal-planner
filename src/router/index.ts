import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";
import BrowseMeals from "../views/BrowseMeals.vue";
import ThisWeek from "../views/ThisWeek.vue";
import ShoppingList from "../views/ShoppingList.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/meals",
    name: "BrowseMeals",
    component: BrowseMeals
  },
  {
    path: "/week",
    name: "ThisWeek",
    component: ThisWeek
  },
  {
    path: "/shopping",
    name: "ShoppingList",
    component: ShoppingList
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
