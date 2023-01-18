import { render } from '@testing-library/react'
import { LandingPageNotificationsCard } from './notificationsCard'

describe('LCA project Notifications card', () => {
  it('should render the component properly', () => {
    const { baseElement } = render(<LandingPageNotificationsCard />)
    expect(baseElement).toBeTruthy()
  })
})
