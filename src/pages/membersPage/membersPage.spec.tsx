import { MockedProvider } from '@apollo/client/testing'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { membersPageMock } from '../../__mocks__/membersPage.mock'
import { MembersPage } from './index'

describe('Project Member Page', () => {
  it('should render successfully', async () => {
    const { baseElement } = render(
      <MockedProvider mocks={membersPageMock} addTypename={false}>
        <MemoryRouter initialEntries={['/projects/acfa456f-6628-4c0d-a0c8-1a53b1a46785/members']}>
          <Routes>
            <Route path='/projects/:projectId/members' element={<MembersPage />} />
          </Routes>
        </MemoryRouter>
      </MockedProvider>,
    )
    expect(baseElement).toBeDefined()
    expect(await screen.findByTestId('member-table')).toBeInTheDocument()
    expect(await screen.findByTestId('group-table')).toBeInTheDocument()
  })
})
