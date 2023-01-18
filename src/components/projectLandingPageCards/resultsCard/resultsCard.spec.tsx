import { render } from '@testing-library/react'
import { LandingPageResultsCard } from './resultsCard'

describe('LCA project Results card', () => {
  it('should render the component properly', () => {
    const { baseElement } = render(<LandingPageResultsCard />)
    expect(baseElement).toBeTruthy()
  })
})
