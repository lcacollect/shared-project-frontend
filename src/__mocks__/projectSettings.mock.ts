import getSingleProjectResponse from './getSingleProject'
import { MockedResponse } from '@apollo/client/testing'
import { GetSingleProjectDocument } from '../dataAccess'
import { projectStagesMock } from './projectStage.mock'

export const projectSettingsMock: MockedResponse[] = [
  {
    request: {
      query: GetSingleProjectDocument,
      variables: { id: 'acfa456f-6628-4c0d-a0c8-1a53b1a46785' },
    },
    result: getSingleProjectResponse,
  },
  ...projectStagesMock,
]
