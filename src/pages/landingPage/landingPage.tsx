import { Grid } from '@mui/material'

import {
  LandingPageResultsCard,
  LandingPageStatisticsCard,
  LandingPageTeamCard,
  RecentProjectCard,
} from '../../components'

import { useGetSingleProjectQuery } from '../../dataAccess'
import { CardTitle, DataFetchWrapper, PaperPage } from '@lcacollect/components'
import { useParams } from 'react-router-dom'

export const ProjectLandingPage = () => {
  const { projectId } = useParams()
  const { data, loading, error } = useGetSingleProjectQuery({
    variables: { id: projectId as string },
    skip: !projectId,
  })

  return (
    <PaperPage data-testid='project-landing-page'>
      <CardTitle title={'Project Page'} size={'large'} />
      <DataFetchWrapper error={error} loading={loading}>
        <Grid container rowSpacing={4} columnSpacing={3} sx={{ paddingTop: '15px' }}>
          <Grid item xs={3}>
            <RecentProjectCard key={projectId} project={data?.projects[0]} height={'100%'} width={'100%'} />
          </Grid>
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
      </DataFetchWrapper>
    </PaperPage>
  )
}
