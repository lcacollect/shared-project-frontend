import { render } from '@testing-library/react'
import { LandingPageStatisticsCard } from '.'

describe('LCA project statistics card', () => {
  it('should render the component properly', () => {
    const { baseElement } = render(<LandingPageStatisticsCard />)
    expect(baseElement).toBeTruthy()
  })
})
