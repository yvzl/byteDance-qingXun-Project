import {isMobileDevice} from '@/utils'
import {createRouter, createWebHistory} from 'vue-router'
import Home from '@/views/Home.vue'
import Phone from '@/views/Phone.vue'
import NotFound from '@/views/NotFound.vue'

const routes = [{
    path: '/',
    name: 'Home',
    component: Home,
}, {
    path: '/phone',
    name: 'Phone',
    component: Phone,
}, {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
}]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, _, next) => {
    const isMobile = import.meta.env.MODE === 'production' && isMobileDevice()
    if (to.path === '/') {
        if (isMobile) return next('/phone')
        return next()
    }
    if (to.path === '/phone') {
        if (!isMobile) return next('/')
        return next()
    }
    return next()
})

export default router;