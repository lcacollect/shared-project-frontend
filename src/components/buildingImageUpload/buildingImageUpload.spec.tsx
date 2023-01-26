import { MockedProvider } from '@apollo/client/testing'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import getSingleProjectResponse from '../../__mocks__/getSingleProject'
import { projectSettingsMock } from '../../__mocks__/projectSettings.mock'
import { BuildingImageUpload } from './buildingImageUpload'

describe('Building Image Upload', () => {
  const user = userEvent.setup()
  const projectId = getSingleProjectResponse.data.projects[0].projectId
  it('should render successfully', async () => {
    const { baseElement } = render(
      <MockedProvider mocks={projectSettingsMock} addTypename={false}>
        <MemoryRouter initialEntries={[`/projects/${projectId}/settings`]}>
          <Routes>
            <Route path='/projects/:projectId/settings' element={<BuildingImageUpload />} />
          </Routes>
        </MemoryRouter>
      </MockedProvider>,
    )

    expect(baseElement).toBeDefined()
    expect(await screen.findByTestId('image-upload')).toBeInTheDocument()
    expect(await screen.findByText('Image')).toBeInTheDocument()
    expect(await screen.findByTestId('upload-building-image-icon')).toBeVisible()
    const file = new File(['hello'], 'hello.png', { type: 'image/png' })
    const uploadButton = screen.getByRole('button', { name: 'UPLOAD' })
    expect(uploadButton).toBeInTheDocument()
    user.click(uploadButton)
    const uploadInput = screen.getByTestId('project-image-upload')
    expect(uploadInput).not.toBeVisible()
    user.upload(uploadInput, file)
  })
})
