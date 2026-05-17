import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProgressCard from '@/components/common/ProgressCard.vue'

describe('ProgressCard', () => {
  it('renders label and detail', () => {
    const wrapper = mount(ProgressCard, {
      props: { label: 'AI基础', pct: 50, detail: '50/100' },
    })
    expect(wrapper.text()).toContain('AI基础')
    expect(wrapper.text()).toContain('50/100')
  })

  it('renders percentage via progressbar aria-valuenow', () => {
    const wrapper = mount(ProgressCard, {
      props: { label: 'Test', pct: 30 },
    })
    const bar = wrapper.find('[role="progressbar"]')
    expect(bar.exists()).toBe(true)
    expect(bar.attributes('aria-valuenow')).toBe('30')
  })

  it('has progressbar role for accessibility', () => {
    const wrapper = mount(ProgressCard, {
      props: { label: 'Test', pct: 50 },
    })
    expect(wrapper.find('[role="progressbar"]').exists()).toBe(true)
  })

  it('handles zero percentage gracefully', () => {
    const wrapper = mount(ProgressCard, {
      props: { label: 'Test', pct: 0 },
    })
    const bar = wrapper.find('[role="progressbar"]')
    expect(bar.exists()).toBe(true)
    expect(bar.attributes('aria-valuenow')).toBe('0')
  })
})
