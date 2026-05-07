import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Student from "../views/Student.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: Home,
    },
    {
      path: "/students/:id",
      component: Student,
    },
  ],
});

export default router;