<template>
  <div class="min-h-screen bg-slate-950 text-slate-100" :class="{ 'dark': isDark }">
    <!-- Toast Notifications -->
    <ToastContainer />

    <!-- Mobile Header -->
    <header class="sticky top-0 z-50 bg-slate-950/92 backdrop-blur-lg border-b border-slate-800 md:hidden">
      <div class="max-w-3xl mx-auto flex items-center justify-between px-4 py-3">
        <div class="flex items-center gap-2 font-bold text-sm">
          <span class="text-lg">🧠</span>
          <span>面试刷题</span>
        </div>
        <div class="flex items-center gap-3">
          <button
            @click="setTheme(theme === 'dark' ? 'light' : 'dark')"
            class="text-lg hover:scale-110 transition-transform"
            :title="theme === 'dark' ? '切换亮色模式' : '切换暗色模式'"
          >{{ theme === 'dark' ? '☀️' : '🌙' }}</button>
          <div class="flex gap-4 text-xs text-slate-400">
            <span>已做 <b class="text-amber-400">{{ stats.done }}</b></span>
            <span>正确率 <b class="text-amber-400">{{ stats.accuracy }}%</b></span>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-3xl mx-auto px-4 pb-24 md:pb-8 md:pt-4">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Bottom Nav (Mobile) / Top Nav (Desktop) -->
    <nav class="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800
                md:fixed md:bottom-auto md:top-0 md:border-t-0 md:border-b border-slate-800">
      <div class="max-w-3xl mx-auto flex md:justify-center">
        <router-link
          v-for="item in navItems"
          :key="item.route"
          :to="item.route"
          :aria-label="item.label"
          class="flex-1 md:flex-none flex flex-col md:flex-row items-center justify-center gap-0.5 md:gap-2
                 px-2 py-2 md:px-5 md:py-3 text-slate-500 hover:text-primary-400 transition-colors
                 text-[0.68rem] md:text-sm font-medium"
          active-class="!text-primary-400"
        >
          <span class="text-xl md:text-base">{{ item.icon }}</span>
          <span>{{ item.label }}</span>
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useQuizStore } from '@/stores/quiz-session'
import { useTheme } from '@/composables/use-theme'
import ToastContainer from '@/components/common/ToastContainer.vue'

const store = useQuizStore()
const stats = computed(() => store.globalStats)
const { isDark, theme, setTheme } = useTheme()

const navItems = [
  { route: '/', icon: '🏠', label: '首页' },
  { route: '/quiz', icon: '✏️', label: '刷题' },
  { route: '/browse', icon: '📖', label: '题库' },
  { route: '/collection', icon: '⭐', label: '收藏' },
  { route: '/stats', icon: '📊', label: '统计' },
]
</script>
