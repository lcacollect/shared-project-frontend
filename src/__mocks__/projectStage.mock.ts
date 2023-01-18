import getProjectStagesResponse from './getProjectStages'
import getLifeCycleStagesResponse from './getLifeCycleStages'
import { MockedResponse } from '@apollo/client/testing'
import { GetLifeCycleStagesDocument, GetProjectStagesDocument } from '../dataAccess'

export const projectStagesMock: MockedResponse[] = [
  {
    request: {
      query: GetProjectStagesDocument,
      variables: { projectId: 'acfa456f-6628-4c0d-a0c8-1a53b1a46785' },
    },
    result: getProjectStagesResponse,
  },
  {
    request: {
      query: GetLifeCycleStagesDocument,
    },
    result: getLifeCycleStagesResponse,
  },
]
