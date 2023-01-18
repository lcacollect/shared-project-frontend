import { render } from '@testing-library/react'
import { LandingPageTeamCard } from '.'
import { MockedProvider } from '@apollo/client/testing'

describe('LCA project team card', () => {
  it('should render the component properly', () => {
    const { baseElement } = render(
      <MockedProvider>
        <LandingPageTeamCard members={[]} />
      </MockedProvider>,
    )
    expect(baseElement).toBeDefined()
  })
})
