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
  { path: '/docs', name: 'docs', component: () => import('@/views/DocsPage.vue') },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

// Route guard: confirm before leaving quiz session
router.beforeEach((to, from) => {
  if (from.name === 'quiz' && to.name !== 'quiz') {
    const session = sessionStorage.getItem('__quiz_active__')
    if (session === 'true') {
      const confirmed = window.confirm('刷题进行中，确定要离开吗？未保存的进度将会丢失。')
      if (!confirmed) return false
      sessionStorage.removeItem('__quiz_active__')
    }
  }
  return true
})
