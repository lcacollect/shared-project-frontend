import { MockedResponse } from '@apollo/client/testing'
import { GetSingleProjectDocument, UpdateProjectDocument } from '../dataAccess'
import getSingleProjectResponse from './getSingleProject'
import updateProjectResponse from './updateProject'

const projectId = getSingleProjectResponse.data.projects[0].id

export const projectInformationMock: MockedResponse[] = [
  {
    request: {
      query: GetSingleProjectDocument,
      variables: { id: projectId },
    },
    result: getSingleProjectResponse,
  },
  {
    request: {
      query: UpdateProjectDocument,
      variables: {
        name: '',
        projectId: null,
        client: null,
        address: null,
        city: null,
        country: null,
        domain: null,
        metaFields: null,
        file: null,
        public: null,
        id: projectId,
      },
    },
    result: updateProjectResponse,
  },
]
