/**
 * Module: Router
 * 路由配置 - 独立路由模块
 */

import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'home', component: () => import('@/views/HomePage.vue') },
  { path: '/quiz', name: 'quiz', component: () => import('@/views/QuizSessionPage.vue') },
  { path: '/browse', name: 'browse', component: () => import('@/views/QuestionBankPage.vue') },
  { path: '/collection', name: 'collection', component: () => import('@/views/FavoritesPage.vue') },
  { path: '/stats', name: 'stats', component: () => import('@/views/StatisticsPage.vue') },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})
