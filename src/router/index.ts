import {createRouter, createWebHistory, type RouteRecordRaw} from "vue-router"

// 配置 vue-router

const routes: RouteRecordRaw[] = [{
    path: "/",
    component: () => import("@/views/Home.vue")
}]

export default createRouter({
    history: createWebHistory(),
    routes
})