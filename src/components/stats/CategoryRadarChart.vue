<script setup lang="ts">
/**
 * Component: CategoryRadarChart
 * 分类掌握度雷达图组件
 */
import { computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { RadarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  RadarComponent,
} from 'echarts/components'
import VChart from 'vue-echarts'
import type { CategoryStats } from '@/types'
import { CATEGORIES } from '@/config/categories'

use([
  CanvasRenderer,
  RadarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  RadarComponent,
])

const props = defineProps<{
  stats: Record<string, CategoryStats>
}>()

const option = computed(() => {
  const indicators = CATEGORIES.map(cat => ({
    name: cat.name,
    max: 100,
  }))

  const data = CATEGORIES.map(cat => {
    const stat = props.stats[cat.id]
    return stat ? Math.round(stat.accuracy) : 0
  })

  return {
    title: {
      text: '各分类掌握度',
      left: 'center',
      textStyle: {
        color: '#e2e8f0',
        fontSize: 16,
      },
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      borderColor: '#334155',
      textStyle: {
        color: '#e2e8f0',
      },
    },
    radar: {
      indicator: indicators,
      center: ['50%', '55%'],
      radius: '65%',
      axisName: {
        color: '#94a3b8',
        fontSize: 12,
      },
      splitArea: {
        areaStyle: {
          color: ['rgba(30, 41, 59, 0.5)', 'rgba(15, 23, 42, 0.5)'],
        },
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(148, 163, 184, 0.3)',
        },
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(148, 163, 184, 0.3)',
        },
      },
    },
    series: [
      {
        name: '掌握度',
        type: 'radar',
        data: [
          {
            value: data,
            name: '当前掌握度',
            areaStyle: {
              color: 'rgba(99, 102, 241, 0.3)',
            },
            lineStyle: {
              color: '#6366f1',
              width: 2,
            },
            itemStyle: {
              color: '#6366f1',
            },
          },
        ],
      },
    ],
  }
})
</script>

<template>
  <div class="w-full h-80">
    <v-chart :option="option" autoresize />
  </div>
</template>
