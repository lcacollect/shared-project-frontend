import { MockedResponse } from '@apollo/client/testing'
import {
  GetProjectGroupsForTeamCardDocument,
  GetProjectMembersForTeamCardDocument,
  GetProjectsDocument,
  GetReportingSchemasDocument,
  GetSingleProjectDocument,
  GetTasksDocument,
} from '../dataAccess'
import getProjectGroupsForTeamCardResponse from './getProjectGroupsForTeamCard'
import getProjectsResponse from './getProjects'
import getReportingSchemasResponse from './getReportingSchemas'
import getSingleProjectResponse from './getSingleProject'
import getTasksResponse from './getTasks'

export const projectLandingPageMock: MockedResponse[] = [
  {
    request: {
      query: GetProjectsDocument,
    },
    result: getProjectsResponse,
  },
  {
    request: {
      query: GetSingleProjectDocument,
      variables: { id: 'acfa456f-6628-4c0d-a0c8-1a53b1a46785' },
    },
    result: getSingleProjectResponse,
  },
  {
    request: {
      query: GetReportingSchemasDocument,
      variables: { projectId: 'acfa456f-6628-4c0d-a0c8-1a53b1a46785' },
    },
    result: getReportingSchemasResponse,
  },
  {
    request: {
      query: GetTasksDocument,
      variables: { reportingSchemaId: '246ac998-e3d2-431f-a8b2-c0c53bfb20d5' },
    },
    result: getTasksResponse,
  },
  {
    request: {
      query: GetProjectGroupsForTeamCardDocument,
      variables: { projectId: 'acfa456f-6628-4c0d-a0c8-1a53b1a46785' },
    },
    result: getProjectGroupsForTeamCardResponse,
  },
  {
    request: {
      query: GetProjectMembersForTeamCardDocument,
      variables: { projectId: 'acfa456f-6628-4c0d-a0c8-1a53b1a46785' },
    },
    result: { data: { projectMembers: [] } },
  },
]
