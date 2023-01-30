import React from 'react'
import { DataFetchWrapper } from '@lcacollect/components'
import { Stack, Paper, Typography } from '@mui/material'
import { useParams } from 'react-router-dom'
import { LandingPageStatisticsBarChart } from './barChart'

export const LandingPageStatisticsCard: React.FC = () => {
  const { projectId = '' } = useParams()

  return (
    <Paper
      sx={{
        height: '100%',
        boxSizing: 'border-box',
        padding: '20px',
        borderRadius: 3,
      }}
    >
      <Typography id='lca-recent-projects-landing-page-statistics-title' fontWeight={'bold'} fontSize={24}>
        Tasks
      </Typography>
      <Stack
        direction={'column'}
        sx={{
          height: '100%',
          justifyContent: 'center',
          display: 'flex',
        }}
      >
        <DataFetchWrapper loading={!projectId} error={undefined}>
          <LandingPageStatisticsBarChart projectId={projectId} />
        </DataFetchWrapper>
      </Stack>
    </Paper>
  )
}
