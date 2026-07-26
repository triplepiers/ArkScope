import { createRouter, createWebHashHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'

const routes = [
  { path: '/', name: 'home', component: HomePage },
  { path: '/demo', name: 'demo', component: () => import('../views/DemoPage.vue') },
]

export default createRouter({ history: createWebHashHistory(), routes })
