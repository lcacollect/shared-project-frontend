import '@testing-library/jest-dom'
import { MockedProvider } from '@apollo/client/testing'
import { render, screen } from '@testing-library/react'
import { ProjectStages } from './projectStages'
import { projectStagesMock } from '../../__mocks__/projectStage.mock'
import React from 'react'

describe('Project Stages', () => {
  it('should render successfully', async () => {
    const projectId = 'acfa456f-6628-4c0d-a0c8-1a53b1a46785'

    const { baseElement } = render(
      <MockedProvider mocks={projectStagesMock} addTypename={false}>
        <ProjectStages projectId={projectId} />
      </MockedProvider>,
    )

    expect(baseElement).toBeDefined()
    expect(await screen.findByTestId('stages-table')).toBeInTheDocument()
  })

  it('should be loading', async () => {
    const projectId = 'acfa456f-6628-4c0d-a0c8-1a53b1a46785'

    const { baseElement } = render(
      <MockedProvider mocks={projectStagesMock} addTypename={false}>
        <ProjectStages projectId={projectId} />
      </MockedProvider>,
    )

    expect(baseElement).toBeDefined()
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
  })
})
