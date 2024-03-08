import { MockedProvider } from '@apollo/client/testing'
import { MenuItem, Select } from '@mui/material'
import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { ProjectDomain } from '../../dataAccess'
import getSingleProjectResponse from '../../__mocks__/getSingleProject'
import { projectInformationMock } from '../../__mocks__/projectInformation.mock'
import { ProjectInformation } from './index'

describe('Project Information', () => {
  const existingProject = getSingleProjectResponse.data.projects[0]

  beforeEach(() => {
    const { baseElement } = render(
      <MockedProvider mocks={projectInformationMock} addTypename={false}>
        <MemoryRouter initialEntries={['/projects/acfa456f-6628-4c0d-a0c8-1a53b1a46785/settings']}>
          <Routes>
            <Route path='/projects/:projectId/settings' element={<ProjectInformation project={existingProject} />} />
          </Routes>
        </MemoryRouter>
      </MockedProvider>,
    )
    expect(baseElement).toBeTruthy()
  })
  it('should render the component properly', async () => {
    expect(await screen.findByTestId('project-information-table')).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Project Name' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Project Id' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Client' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Address' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'City' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Country' })).toBeInTheDocument()
  })
  it('should show allow updating input', async () => {
    const projectNameInput = screen.getByRole('textbox', { name: 'Project Name' })
    fireEvent.focus(projectNameInput)
    fireEvent.change(projectNameInput, { target: { value: '' } })
    fireEvent.blur(projectNameInput)
    expect(await projectNameInput).toHaveValue('')
  })
})

describe('Project Information | selectionDropdown', () => {
  const existingProject = getSingleProjectResponse.data.projects[0]
  const projectDomains = Object.values(ProjectDomain)
  const selectionDropdown = (
    <Select data-testid='select-domain' labelId='select-domain' value='' label='domain'>
      {projectDomains.map((domain, index) => (
        <MenuItem key={index} value={domain} data-testid={`MenuItem-${domain}`}>
          {domain.charAt(0).toUpperCase() + domain.slice(1)}
        </MenuItem>
      ))}
    </Select>
  )

  beforeEach(() => {
    const { baseElement } = render(
      <MockedProvider mocks={projectInformationMock} addTypename={false}>
        <MemoryRouter initialEntries={['/projects/acfa456f-6628-4c0d-a0c8-1a53b1a46785/settings']}>
          <Routes>
            <Route
              path='/projects/:projectId/settings'
              element={<ProjectInformation project={existingProject} selectionDropdown={selectionDropdown} />}
            />
          </Routes>
        </MemoryRouter>
      </MockedProvider>,
    )
    expect(baseElement).toBeTruthy()
  })
  it('should render the component with a special selectionDropdown', async () => {
    expect(await screen.findByTestId('project-information-table')).toBeInTheDocument()
    projectDomains.map(async (domain) => expect(await screen.findByTestId(`MenuItem-${domain}`)).toBeInTheDocument())
    expect(await screen.findAllByTestId('ArrowDropDownIcon')).toHaveLength(2)
    const dropdownElement = screen.getByTestId('select-domain')
    expect(dropdownElement).toBeInTheDocument()
    fireEvent.click(dropdownElement)
  })
})
