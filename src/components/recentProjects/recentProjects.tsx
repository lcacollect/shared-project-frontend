import { Stack } from '@mui/material'
import { RecentProjectCard } from '../recentProjectCard'
import React from 'react'
import { useGetProjectsQuery } from '../../dataAccess'
import { CardTitle, DataFetchWrapper, PaperPage } from '@lcacollect/components'

export const RecentProjectsPaper = () => {
  const recentProjects = localStorage.getItem('recentProjects')?.split(',')
  const { data, error, loading } = useGetProjectsQuery()
  const projects = data?.projects
  return (
    <PaperPage data-testid='recent-projects' sx={{ marginTop: 5 }}>
      <CardTitle title='Recent Projects' size='large' data-testid='recent-projects-title' />
      <DataFetchWrapper error={error} loading={loading}>
        <Stack spacing={3} direction={'row'} justifyContent={'center'} sx={{ mt: 1 }}>
          {recentProjects?.slice(0, 5)?.map((projectId) => (
            <RecentProjectCard
              key={projectId}
              project={projects?.filter((project) => project.id === projectId)[0]}
              maxWidth='20%'
            />
          ))}
        </Stack>
      </DataFetchWrapper>
    </PaperPage>
  )
}
