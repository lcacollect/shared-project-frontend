import { MockedResponse } from '@apollo/client/testing'
import {
  GetAccountDocument,
  GetProjectGroupsDocument,
  GetProjectMembersDocument,
  GetSingleProjectDocument,
} from '../dataAccess'
import getAccountResponse from './getAccount'
import getProjectGroupsResponse from './getProjectGroups'
import getProjectMembersResponse from './getProjectMembers'
import getSingleProjectResponse from './getSingleProject'

const projectId = getSingleProjectResponse.data.projects[0].id

export const membersTableMock: MockedResponse[] = [
  {
    request: {
      query: GetSingleProjectDocument,
      variables: { id: projectId },
    },
    result: getSingleProjectResponse,
  },
  {
    request: {
      query: GetAccountDocument,
    },
    result: getAccountResponse,
  },
  {
    request: {
      query: GetProjectMembersDocument,
      variables: { projectId: projectId },
    },
    result: getProjectMembersResponse,
  },
  {
    request: {
      query: GetProjectGroupsDocument,
      variables: { projectId: projectId },
    },
    result: getProjectGroupsResponse,
  },
]
