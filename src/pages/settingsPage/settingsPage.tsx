import React from 'react'
import { Divider, Grid, Paper, Stack, TextField, Typography } from '@mui/material'
import { ProjectInformation, ProjectStages } from '../../components'
import { useParams } from 'react-router-dom'
import { useGetSingleProjectQuery } from '../../dataAccess'
import { DataFetchWrapper, PaperPage } from '@lcacollect/components'

export const ProjectSettingsPage = () => {
  const { projectId } = useParams()

  const { data, loading, error } = useGetSingleProjectQuery({
    variables: { id: projectId as string },
    skip: !projectId,
  })

  return (
    <PaperPage>
      <DataFetchWrapper loading={loading} error={error}>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <ProjectInformation project={data?.projects[0]} />
          </Grid>
          <Grid item xs={9}>
            <ProjectStages projectId={projectId} />
          </Grid>
          <Grid item xs={3}>
            <DomainInformation />
          </Grid>
        </Grid>
      </DataFetchWrapper>
    </PaperPage>
  )
}

const DomainInformation = () => {
  return (
    <Paper elevation={5} sx={{ borderRadius: 3, padding: 2 }} data-testid='domain-information-table'>
      <Typography variant='h5'>Domain Information</Typography>
      <Divider sx={{ marginBottom: 2 }} />
      <Stack spacing={2}>
        <TextField id='type' label='Type' variant='standard' />
        <TextField id='floors' label='Floors' variant='standard' />
      </Stack>
    </Paper>
  )
}
