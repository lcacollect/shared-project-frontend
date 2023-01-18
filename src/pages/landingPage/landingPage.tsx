import { Grid } from '@mui/material'
import { useCallback, useMemo } from 'react'

import {
  LandingPageStatisticsCard,
  LandingPageTeamCard,
  LandingPageResultsCard,
  RecentProjectCard,
} from '../../components'

import { useGetProjectsQuery, GraphQlProject } from '../../dataAccess'
import { CardTitle, ErrorMessage, PaperPage } from '@lcacollect/components'
import { useParams } from 'react-router-dom'

export const ProjectLandingPage = () => {
  const params = useParams()

  const { data: projectData, error: projectError } = useGetProjectsQuery()

  const projectToRender = useMemo(() => {
    return projectData?.projects.find((project: GraphQlProject) => project.id === params['projectId'])
  }, [projectData?.projects, params])

  const renderProjectCard = useCallback(() => {
    if (projectToRender === undefined || projectError) {
      return (
        <Grid item xs={3}>
          <ErrorMessage error={projectError} />
        </Grid>
      )
    }

    return (
      <Grid item xs={3}>
        <RecentProjectCard key={params.projectId} project={projectToRender} height={'100%'} width={'100%'} />
      </Grid>
    )
  }, [projectError, projectToRender])

  return (
    <PaperPage data-testid='project-landing-page'>
      <CardTitle title={'Project Page'} size={'large'} />
      <Grid container rowSpacing={4} columnSpacing={3} sx={{ paddingTop: '15px' }}>
        {renderProjectCard()}
        <Grid item xs={9}>
          <LandingPageStatisticsCard />
        </Grid>
        <Grid item xs={3}>
          <LandingPageTeamCard />
        </Grid>
        <Grid item xs={9}>
          <LandingPageResultsCard />
        </Grid>
      </Grid>
    </PaperPage>
  )
}
