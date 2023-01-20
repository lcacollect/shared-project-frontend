import { MockedProvider } from '@apollo/client/testing'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import getProjectGroupsForTeamCardResponse from '../../__mocks__/getProjectGroupsForTeamCard'
import { projectLandingPageMock } from '../../__mocks__/projectLandingPage.mock'
import { ProjectLandingPage } from './index'

describe('Project Landing Page', () => {
  const existingGroupWithMembers = getProjectGroupsForTeamCardResponse.data.projectGroups[0]

  it('should render successfully', async () => {
    const { baseElement } = render(
      <MockedProvider mocks={projectLandingPageMock}>
        <MemoryRouter initialEntries={['/projects/acfa456f-6628-4c0d-a0c8-1a53b1a46785']}>
          <Routes>
            <Route path='/projects/:projectId' element={<ProjectLandingPage />} />
          </Routes>
        </MemoryRouter>
      </MockedProvider>,
    )
    expect(baseElement).toBeTruthy()
    expect(await screen.findByTestId('project-landing-page')).toBeInTheDocument()
    expect(await screen.findByText('Team')).toBeInTheDocument()
    expect(await screen.findByText(existingGroupWithMembers.name)).toBeInTheDocument()
    expect(await screen.findByText(existingGroupWithMembers.members[0].name)).toBeInTheDocument()
    expect(await screen.findByText('Tasks')).toBeInTheDocument()
  })
})
