import { Card, CardActionArea, CardContent, CardMedia, Divider, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import React from 'react'
import { GraphQlProject } from '../../dataAccess'
import { ProjectLogoPlaceholder } from '../../assets'

export interface RecentProjectCardProps {
  project?: GraphQlProject
  height?: number | string
  width?: number | string
  maxWidth?: number | string
}

export const RecentProjectCard: React.FC<RecentProjectCardProps> = ({ project, height, width = '100%', maxWidth }) => {
  const navigate = useNavigate()

  if (!project) {
    return null
  }

  const { imageUrl } = project
  return (
    <Card sx={{ height: height ? height : 350, width, borderRadius: 5, maxWidth: maxWidth ? maxWidth : width }}>
      <CardActionArea onClick={() => navigate(`/projects/${project.id}`)}>
        {imageUrl !== null ? (
          <CardMedia component='img' src={imageUrl} height='160' />
        ) : (
          <ProjectLogoPlaceholder
            sx={{
              fontSize: '70px',
              display: 'block',
              margin: 'auto',
              height: '90px',
              paddingTop: '40px',
              paddingBottom: '14px',
              opacity: '0.2',
            }}
          />
        )}
        <CardContent sx={{ height: 300 }}>
          <Typography gutterBottom variant='subtitle1' component='div'>
            {project.name}
          </Typography>
          <Divider />
          <Typography fontSize={11}>{`Project ID: ${project.projectId}`}</Typography>
          <Typography fontSize={11}>{`Client: ${project.client}`}</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
