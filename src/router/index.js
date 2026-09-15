import { createRouter, createWebHashHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import { loadDemoPage } from './loaders.js'

const routes = [
  { path: '/demo/operator-list', name: 'operator-list-demo', component: () => import('../components/showcases/OperatorListShowcase.vue') },
  { path: '/demo/endfield-sidebar', name: 'endfield-sidebar-demo', component: () => import('../components/showcases/EndfieldSidebarShowcase.vue') },
  { path: '/demo/operator-carousel', name: 'operator-carousel-demo', component: () => import('../components/showcases/OperatorCarouselShowcase.vue') },
  { path: '/demo/arknights-operator-carousel', name: 'arknights-operator-carousel-demo', component: () => import('../components/showcases/ArknightsOperatorCarouselShowcase.vue') },
  { path: '/demo/news-list', name: 'news-list-demo', component: () => import('../components/showcases/NewsListShowcase.vue') },
  { path: '/', name: 'home', component: HomePage },
  { path: '/demo', name: 'demo', component: loadDemoPage },
]

export default createRouter({ history: createWebHashHistory(), routes })
