import { MockedProvider } from '@apollo/client/testing'
import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import getProjectMembersResponse from '../../__mocks__/getProjectMembers'
import { membersTableMock } from '../../__mocks__/membersTable.mock'
import { MembersTable } from './index'

describe('Members Table', () => {
  beforeEach(() => {
    const { baseElement } = render(
      <MockedProvider mocks={membersTableMock} addTypename={false}>
        <MemoryRouter initialEntries={['/projects/acfa456f-6628-4c0d-a0c8-1a53b1a46785/members']}>
          <Routes>
            <Route path='/projects/:projectId/members' element={<MembersTable />} />
          </Routes>
        </MemoryRouter>
      </MockedProvider>,
    )
    expect(baseElement).toBeTruthy()
  }, 10000)
  it('should render the component properly', async () => {
    expect(await screen.findByTestId('member-table')).toBeInTheDocument()
    expect(await screen.getByRole('columnheader', { name: /Name/i })).toBeInTheDocument()
    expect(await screen.getByRole('columnheader', { name: /Email/i })).toBeInTheDocument()
    expect(await screen.getByRole('columnheader', { name: /Groups/i })).toBeInTheDocument()
    const existingProjectMember = getProjectMembersResponse.data.projectMembers[0]
    expect(await screen.findByText(existingProjectMember.name)).toBeInTheDocument()
    expect(await screen.findByText(existingProjectMember.email)).toBeInTheDocument()
    expect(await screen.findByText(existingProjectMember.projectGroups[0].name)).toBeInTheDocument()
  })
  it('should allow sorting project members', async () => {
    const columHeader = await screen.getByRole('columnheader', { name: /Name/i })
    expect(columHeader).toHaveAttribute('aria-sort', 'none')
    fireEvent.click(columHeader)
    expect(columHeader).toHaveAttribute('aria-sort', 'ascending')
    fireEvent.click(columHeader)
    expect(columHeader).toHaveAttribute('aria-sort', 'descending')
    fireEvent.click(columHeader)
    expect(columHeader).toHaveAttribute('aria-sort', 'none')
  })
  it('should allow filtering project members', async () => {
    // Hover columnheader
    const columHeader = await screen.getByRole('columnheader', { name: /Name/i })
    fireEvent.mouseOver(columHeader)
    // Click triple dot menu icon
    const columnMenu = await screen.getAllByTestId('TripleDotsVerticalIcon')[0]
    fireEvent.click(columnMenu)
    expect(await screen.getByRole('button', { expanded: true })).toBeVisible()
    // Click 'Filter' menuitem in opened menu
    const filterMenuItem = await screen.getAllByRole('menuitem')[3]
    expect(filterMenuItem).toBeEnabled()
    fireEvent.click(filterMenuItem)
    // Type text into input
    const filterTooltip = await screen.getByTestId('sentinelStart')
    expect(filterTooltip).toBeVisible()
    const filterInput = await screen.getByPlaceholderText('Filter value')
    expect(filterInput).not.toHaveValue()
    fireEvent.change(filterInput, { target: { value: 'Test' } })
    expect(filterInput).toHaveValue('Test')
  })
})
