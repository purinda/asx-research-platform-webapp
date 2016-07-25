var Router = require('vue-router')
var Vue = require('vue')

// Install vue router
Vue.use(Router)

// Get an instance of the router
var router = new Router({
    saveScrollPosition: true,
    transitionOnLoad: true
})

router.map({
    '*': {
        component: require('src/components/not-found.vue')
    },
    '/': {
        component: require('src/components/dashboard.vue')
    },
    '/announcements': {
        component: require('src/components/announcements/index.vue')
    },
    '/announcements/recent': {
        component: require('src/components/announcements/index.vue')
    },
    '/announcements/sector': {
        component: require('src/components/announcements/sector.vue')
    },
    '/announcements/sector-charts/:sector': {
        component: require('src/components/announcements/sector-charts.vue')
    },
    '/screener': {
        component: require('src/components/screener/screener.vue')
    }
})

export default router