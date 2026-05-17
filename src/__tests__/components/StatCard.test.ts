import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StatCard from '@/components/common/StatCard.vue'

describe('StatCard', () => {
  it('renders label and value', () => {
    const wrapper = mount(StatCard, {
      props: { label: '总题数', value: 4500 },
    })
    expect(wrapper.text()).toContain('总题数')
    expect(wrapper.text()).toContain('4500')
  })

  it('renders with icon', () => {
    const wrapper = mount(StatCard, {
      props: { label: '正确率', value: '85%', icon: '✅' },
    })
    expect(wrapper.text()).toContain('✅')
  })

  it('has role="status" for accessibility', () => {
    const wrapper = mount(StatCard, {
      props: { label: 'Test', value: 100 },
    })
    expect(wrapper.find('[role="status"]').exists()).toBe(true)
  })
})
