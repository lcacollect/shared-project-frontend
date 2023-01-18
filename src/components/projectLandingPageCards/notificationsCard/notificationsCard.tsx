import { Paper, Typography } from '@mui/material'
import React from 'react'

export const LandingPageNotificationsCard: React.FC = () => {
  return (
    <Paper
      sx={{
        borderRadius: 3,
        height: '367px',
        padding: '20px',
      }}
    >
      <Typography id='lca-recent-projects-landing-page-statistics-title' fontWeight={'bold'} fontSize={24}>
        Notifications
      </Typography>
    </Paper>
  )
}
