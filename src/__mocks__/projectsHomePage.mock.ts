import getProjectsResponse from './getProjects'
import getAccountResponse from './getAccount'
import { MockedResponse } from '@apollo/client/testing'
import { GetAccountDocument, GetProjectsDocument } from '../dataAccess'

export const projectsHomePageMock: MockedResponse[] = [
  {
    request: {
      query: GetProjectsDocument,
    },
    result: getProjectsResponse,
  },
  {
    request: {
      query: GetAccountDocument,
    },
    result: getAccountResponse,
  },
]
