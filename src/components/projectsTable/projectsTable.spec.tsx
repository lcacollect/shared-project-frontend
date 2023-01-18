import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ProjectsTable } from '.'
import { MockedProvider } from '@apollo/client/testing'
import { projectsHomePageMock } from '../../__mocks__/projectsHomePage.mock'

describe('ProjectsList', () => {
  it('should display a child element for each project', async () => {
    render(
      <BrowserRouter>
        <MockedProvider mocks={projectsHomePageMock} addTypename={false}>
          <ProjectsTable />
        </MockedProvider>
      </BrowserRouter>,
    )

    expect(await screen.findByTestId('projects-table')).toBeInTheDocument()
    expect(await screen.findAllByRole('row')).toHaveLength(1)
  })
})
