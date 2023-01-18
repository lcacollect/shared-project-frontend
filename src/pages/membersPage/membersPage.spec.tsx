import '@testing-library/jest-dom'
import { MockedProvider } from '@apollo/client/testing'
import { render, screen } from '@testing-library/react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MembersPage } from './index'

describe('Project Member Page', () => {
  it('should render successfully', async () => {
    const { baseElement } = render(
      <MockedProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<MembersPage />} />
          </Routes>
        </BrowserRouter>
      </MockedProvider>,
    )
    expect(baseElement).toBeDefined()
    expect(await screen.findByTestId('member-table')).toBeInTheDocument()
    expect(await screen.findByTestId('group-table')).toBeInTheDocument()
  })
})
