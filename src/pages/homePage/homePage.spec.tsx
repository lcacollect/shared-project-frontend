import '@testing-library/jest-dom'
import { MockedProvider } from '@apollo/client/testing'
import { render, screen } from '@testing-library/react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ProjectsHomePage } from './index'
import { projectsHomePageMock } from '../../__mocks__/projectsHomePage.mock'

describe('Projects Home Page', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <MockedProvider mocks={projectsHomePageMock} addTypename={false}>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<ProjectsHomePage />} />
          </Routes>
        </BrowserRouter>
      </MockedProvider>,
    )
    expect(baseElement).toBeTruthy()
    expect(screen.getByTestId('projects-table')).toBeInTheDocument()
    expect(screen.getByTestId('recent-projects')).toBeInTheDocument()
  })
})
