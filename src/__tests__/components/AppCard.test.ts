import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppCard from '@/components/common/AppCard.vue'

describe('AppCard', () => {
  it('renders slot content', () => {
    const wrapper = mount(AppCard, {
      slots: { default: 'Card Content' },
    })
    expect(wrapper.text()).toContain('Card Content')
  })

  it('applies custom class', () => {
    const wrapper = mount(AppCard, {
      props: { class: 'custom-class' },
      slots: { default: 'Content' },
    })
    expect(wrapper.classes()).toContain('custom-class')
  })
})
