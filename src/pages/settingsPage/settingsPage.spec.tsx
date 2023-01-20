import { MockedProvider } from '@apollo/client/testing'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { projectSettingsMock } from '../../__mocks__/projectSettings.mock'
import { ProjectSettingsPage } from './settingsPage'

describe('Project Settings Page', () => {
  it('should render successfully', async () => {
    const { baseElement } = render(
      <MockedProvider mocks={projectSettingsMock} addTypename={false}>
        <MemoryRouter initialEntries={['/projects/acfa456f-6628-4c0d-a0c8-1a53b1a46785/settings']}>
          <Routes>
            <Route path='/projects/:projectId/settings' element={<ProjectSettingsPage />} />
          </Routes>
        </MemoryRouter>
      </MockedProvider>,
    )

    expect(baseElement).toBeDefined()
    expect(await screen.findByTestId('project-information-table')).toBeInTheDocument()
    expect(await screen.findByText('Project Name')).toBeInTheDocument()
    expect(screen.getByTestId('domain-information-table')).toBeInTheDocument()
    expect(await screen.findByTestId('stages-table')).toBeInTheDocument()
  })
})
