import { TaskStatus } from '../dataAccess'

export default {
  data: {
    tasks: [
      {
        status: TaskStatus.Pending,
        assignee: {
          __typename: 'GraphQLProjectMember',
          projectGroups: [
            {
              name: 'Group 1',
            },
          ],
        },
      },
      {
        status: TaskStatus.Completed,
        assignee: {
          __typename: 'GraphQLProjectMember',
          projectGroups: [
            {
              name: 'Group 1',
            },
          ],
        },
      },
      {
        status: TaskStatus.Approved,
        assignee: {
          __typename: 'GraphQLProjectMember',
          projectGroups: [
            {
              name: 'Group 1',
            },
          ],
        },
      },
      {
        status: TaskStatus.Pending,
        assignee: {
          __typename: 'GraphQLProjectGroup',
          name: 'Group 1',
        },
      },
      {
        status: TaskStatus.Completed,
        assignee: {
          __typename: 'GraphQLProjectGroup',
          name: 'Group 1',
        },
      },
      {
        status: TaskStatus.Approved,
        assignee: {
          __typename: 'GraphQLProjectGroup',
          name: 'Group 1',
        },
      },
    ],
  },
}
