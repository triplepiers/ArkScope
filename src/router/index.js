import { createRouter, createWebHashHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import { loadDemoPage } from './loaders.js'

const routes = [
  { path: '/demo/news-list', name: 'news-list-demo', component: () => import('../components/showcases/NewsListShowcase.vue') },
  { path: '/', name: 'home', component: HomePage },
  { path: '/demo', name: 'demo', component: loadDemoPage },
]

export default createRouter({ history: createWebHashHistory(), routes })
