<script setup lang="ts">
/**
 * Component: LearningTrendChart
 * 学习趋势折线图组件
 */
import { computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from 'echarts/components'
import VChart from 'vue-echarts'

use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
])

const props = defineProps<{
  dailyStats: { date: string; count: number; correct: number }[]
}>()

const option = computed(() => {
  const dates = props.dailyStats.map(s => s.date.slice(5)) // MM-DD
  const counts = props.dailyStats.map(s => s.count)
  const accuracies = props.dailyStats.map(s => 
    s.count > 0 ? Math.round((s.correct / s.count) * 100) : 0
  )

  return {
    title: {
      text: '近7天学习趋势',
      left: 'center',
      textStyle: {
        color: '#e2e8f0',
        fontSize: 16,
      },
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      borderColor: '#334155',
      textStyle: {
        color: '#e2e8f0',
      },
    },
    legend: {
      data: ['刷题数量', '正确率'],
      bottom: 0,
      textStyle: {
        color: '#94a3b8',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: dates,
      axisLine: {
        lineStyle: {
          color: 'rgba(148, 163, 184, 0.3)',
        },
      },
      axisLabel: {
        color: '#94a3b8',
      },
    },
    yAxis: [
      {
        type: 'value',
        name: '题数',
        position: 'left',
        axisLine: {
          lineStyle: {
            color: 'rgba(148, 163, 184, 0.3)',
          },
        },
        axisLabel: {
          color: '#94a3b8',
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(148, 163, 184, 0.1)',
          },
        },
      },
      {
        type: 'value',
        name: '正确率%',
        position: 'right',
        max: 100,
        axisLine: {
          lineStyle: {
            color: 'rgba(148, 163, 184, 0.3)',
          },
        },
        axisLabel: {
          color: '#94a3b8',
          formatter: '{value}%',
        },
        splitLine: {
          show: false,
        },
      },
    ],
    series: [
      {
        name: '刷题数量',
        type: 'line',
        data: counts,
        smooth: true,
        lineStyle: {
          color: '#6366f1',
          width: 3,
        },
        itemStyle: {
          color: '#6366f1',
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(99, 102, 241, 0.4)' },
              { offset: 1, color: 'rgba(99, 102, 241, 0.05)' },
            ],
          },
        },
      },
      {
        name: '正确率',
        type: 'line',
        yAxisIndex: 1,
        data: accuracies,
        smooth: true,
        lineStyle: {
          color: '#10b981',
          width: 3,
        },
        itemStyle: {
          color: '#10b981',
        },
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
