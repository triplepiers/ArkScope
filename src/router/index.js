import { createRouter, createWebHashHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import { loadDemoPage } from './loaders.js'

const routes = [
  { path: '/', name: 'home', component: HomePage },
  { path: '/demo', name: 'demo', component: loadDemoPage },
]

export default createRouter({ history: createWebHashHistory(), routes })
