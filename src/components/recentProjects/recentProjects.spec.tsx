import { render } from '@testing-library/react'
import { RecentProjectsPaper } from './index'
import { MockedProvider } from '@apollo/client/testing'
import { projectsHomePageMock } from '../../__mocks__/projectsHomePage.mock'

describe('Recent Projects', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <MockedProvider mocks={projectsHomePageMock}>
        <RecentProjectsPaper />
      </MockedProvider>,
    )

    expect(baseElement).toBeTruthy()
  })
})
