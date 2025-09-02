import { render, screen } from '@testing-library/react'
import { waitFor } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import BlurText from './BlurText'

describe('BlurText', () => {
  it('animates words and removes blur/opacity', async () => {
    render(<BlurText text="Hola mundo místico" animateBy="words" delay={0} stepDuration={0} />)
    const wrapper = screen.getByLabelText('Hola mundo místico') as HTMLElement

    await waitFor(() => {
      const allSpans = Array.from(wrapper.querySelectorAll('span[aria-hidden="true"]'))
      const tokenSpans = allSpans.filter((el) => (el as HTMLElement).style.display === 'inline-block')
      expect(tokenSpans.length).toBeGreaterThan(0)
      tokenSpans.forEach((el) => {
        const s = (el as HTMLElement).style
        expect(s.opacity).toBe('1')
        expect(s.filter).toBe('blur(0px)')
      })
    })
  })

  it('supports char-by-char animation', async () => {
    render(<BlurText text="Oráculo" animateBy="chars" delay={0} stepDuration={0} />)
    const wrapper = screen.getByLabelText('Oráculo') as HTMLElement
    const spans = wrapper.querySelectorAll('span[aria-hidden="true"]')
    expect(spans.length).toBeGreaterThanOrEqual(2)
  })
})
