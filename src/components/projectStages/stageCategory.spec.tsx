import '@testing-library/jest-dom'
import { MockedProvider } from '@apollo/client/testing'
import { render, screen } from '@testing-library/react'
import { StageCategory } from './stageCategory'
import projectStages from '../../__mocks__/getProjectStages'
import lifeCycleStages from '../../__mocks__/getLifeCycleStages'
import { GraphQlLifeCycleStage, GraphQlProjectStage } from '../../dataAccess'

describe('Stage Category', () => {
  it('should render successfully', () => {
    const projectId = 'acfa456f-6628-4c0d-a0c8-1a53b1a46785'
    const stages = [projectStages.data.projectStages[0]] as GraphQlProjectStage[]

    const { baseElement } = render(
      <MockedProvider>
        <StageCategory
          categoryName={stages[0].category}
          stages={lifeCycleStages.data.lifeCycleStages as GraphQlLifeCycleStage[]}
          projectStages={stages}
          projectId={projectId}
        />
      </MockedProvider>,
    )
    expect(baseElement).toBeDefined()

    expect(screen.getByTestId(`project-stage-category-${stages[0].category}`)).toBeDefined()
  })
})
