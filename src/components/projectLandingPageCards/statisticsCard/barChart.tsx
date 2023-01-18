import { DataFetchWrapper, theme } from '@lcacollect/components'
import React, { useMemo } from 'react'
import Chart from 'react-google-charts'
import { GetTasksQuery, TaskStatus, useGetReportingSchemasQuery, useGetTasksQuery } from '../../../dataAccess'

type Tasks = GetTasksQuery['tasks']

export const LandingPageStatisticsBarChart: React.FC<{ projectId: string }> = (props) => {
  const { projectId } = props

  const { data } = useGetReportingSchemasQuery({
    variables: {
      projectId,
    },
  })

  const {
    data: tasksData,
    loading: tasksLoading,
    error: tasksError,
  } = useGetTasksQuery({
    variables: {
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain, @typescript-eslint/no-non-null-assertion
      reportingSchemaId: data?.reportingSchemas[0].id!,
    },
    skip: !data?.reportingSchemas,
  })

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const chartData = useMemo(() => {
    if (!tasksData) return null
    const tasks = tasksData.tasks
    const aggregatedTasks = aggregateTasksByAssignedGroupName(tasks)
    const data = sumCategoriesByStatus(aggregatedTasks)
    const chartData = [['Task', 'Pending', 'Done', 'Approved'], ...data]

    return chartData
  }, [tasksData])!

  return (
    <DataFetchWrapper error={tasksError} loading={tasksLoading || !chartData}>
      <Chart
        chartType='BarChart'
        width='100%'
        style={{
          display: 'flex',
          flexGrow: 1,
        }}
        data={chartData}
        options={{
          isStacked: true,
          legend: {
            position: 'bottom',
            alignment: 'center',
            maxLines: 3,
          },
          colors: [theme.palette.error.main, theme.palette.warning.main, theme.palette.success.main],
        }}
      />
    </DataFetchWrapper>
  )
}

function aggregateTasksByAssignedGroupName(tasks: Tasks) {
  const emptyAggregatedTasks: Record<string, Tasks> = {}
  return tasks.reduce<Record<string, Tasks>>((aggregated: Record<string, Tasks>, current) => {
    const category =
      current.assignee.__typename === 'GraphQLProjectGroup'
        ? current.assignee.name
        : current.assignee.projectGroups?.[0]?.name ?? 'Unassigned'
    const newArray = aggregated[category] ?? []
    newArray.push(current)
    return {
      ...aggregated,
      [category]: newArray,
    }
  }, emptyAggregatedTasks)
}

/**
 *
 * @param aggregatedTasks
 * @returns [Category, sumPending, sumDone, sumApproved]
 */

function sumCategoriesByStatus(aggregatedTasks: Record<string, Tasks>): [string, number, number, number][] {
  return Object.entries(aggregatedTasks).map(([category, tasks]) => {
    const { PENDING, COMPLETED, APPROVED } = sumTasksByStatus(tasks)
    return [category, PENDING, COMPLETED, APPROVED]
  })
}

function sumTasksByStatus(tasks: Tasks) {
  const emptyAggregation: Record<TaskStatus, number> = {
    APPROVED: 0,
    COMPLETED: 0,
    PENDING: 0,
  }
  return tasks.reduce<Record<TaskStatus, number>>((aggregated: Record<TaskStatus, number>, current) => {
    if (!current.status) return aggregated
    const tasksOfSameStatus = (aggregated[current.status] ?? 0) + 1

    return {
      ...aggregated,
      [current.status]: tasksOfSameStatus,
    }
  }, emptyAggregation)
}
