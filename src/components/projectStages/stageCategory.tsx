import {
  GraphQlLifeCycleStage,
  GraphQlProjectStage,
  useAddProjectStageMutation,
  useDeleteProjectStageMutation,
} from '../../dataAccess'
import React from 'react'
import { Box, Grid, Typography } from '@mui/material'
import { theme } from '@lcacollect/components'

interface StageCategoryProps {
  stages: GraphQlLifeCycleStage[]
  categoryName: string
  projectStages: Omit<GraphQlProjectStage, 'projectId'>[]
  projectId?: string
}

export const StageCategory: React.FC<StageCategoryProps> = ({ categoryName, stages, projectStages, projectId }) => {
  const stagesGridColumns = ['']
  for (let i = 0; i < stages.length; i++) {
    stagesGridColumns.push(`vertical${i}`)
  }

  return (
    <Grid
      container
      spacing={2}
      data-testid={`project-stage-category-${categoryName}`}
      sx={{ width: 'auto%', maxWidth: '306px', marginLeft: 'unset', flexDirection: 'column', alignItems: 'center' }}
    >
      <StageHeader name={categoryName} />
      <Grid item>
        <Grid
          container
          spacing={2}
          justifyContent='flex-start'
          data-testid='test-width'
          sx={{
            display: 'grid',
            gridTemplateAreas:
              stages.length > 4
                ? '"vertical0 vertical1 vertical2 vertical3 vertical4" "horizontal5 horizontal5 horizontal5 horizontal5 horizontal5 " "horizontal6 horizontal6 horizontal6 horizontal6 horizontal6 "'
                : `"${stagesGridColumns.toString().split(',').join(' ')}"`,
            gridTemplateRows: stages.length > 4 ? '242px 40px 40px 40px' : '242px',
            gridTemplateColumns:
              stages.length > 4 ? '49px 49px 49px 49px' : `${stagesGridColumns.toString().split(',').join(' ')}`,
            marginLeft: 'unset',
            gridGap: '10px',
            '&>.MuiGrid-item': {
              paddingLeft: 'unset',
              paddingTop: 'unset',
            },
          }}
        >
          {stages.map((stage, index) => (
            <StageElement
              key={index}
              currentStage={index}
              phase={stage.phase}
              name={stage.name}
              id={stage.id}
              projectId={projectId}
              projectStage={projectStages.filter((projectStage) => projectStage.phase === stage.phase)[0]}
            />
          ))}
        </Grid>
      </Grid>
    </Grid>
  )
}

interface StageElementProps {
  phase: string
  name: string
  id: string
  projectId?: string
  projectStage?: Omit<GraphQlProjectStage, 'projectId'>
  currentStage: number
}

const StageElement: React.FC<StageElementProps> = (props) => {
  const { phase, name, id, projectId, projectStage, currentStage } = props
  const [deleteProjectStage] = useDeleteProjectStageMutation({
    variables: {
      projectId: projectId as string,
      stageId: id,
    },
    refetchQueries: ['getProjectStages'],
  })
  const [addProjectStage] = useAddProjectStageMutation({
    variables: { projectId: projectId as string, stageId: id },
    refetchQueries: ['getProjectStages'],
  })

  const color = projectStage ? theme.palette.primary.dark : theme.palette.primary.main

  const handleClick = () => {
    if (projectStage) {
      deleteProjectStage()
    } else {
      addProjectStage()
    }
  }
  const horizontalStage = currentStage > 4 ? 'rotateZ(90deg)' : ''
  let alignment
  if (currentStage > 4) {
    alignment = {
      gridArea: `horizontal${currentStage}`,
      transform: horizontalStage,
      transformOrigin: 'top',
      marginLeft: '215px',
      marginTop: '20px',
      marginBottom: '28px',
      width: '49px',
      height: 'fit-content',
    }
  } else {
    alignment = {
      gridArea: `vertical${currentStage}`,
      transform: 'unset',
      transformOrigin: 'unset',
      marginLeft: 'unset',
      width: phase === 'D' ? '73px' : '49px',
      height: '100%',
    }
  }

  return (
    <Grid item sx={alignment} data-testid='topGrid'>
      <Box
        onClick={handleClick}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: horizontalStage ? '39px' : '100%',
          minHeight: '290px',
          height: '100%',
          borderRadius: 2,
          border: 0,
          backgroundColor: color,
          alignItems: 'center',
          paddingY: '10px',
          boxSizing: 'border-box',
          cursor: 'default',
          marginTop: horizontalStage ? '-50px' : 'unset',
          marginLeft: horizontalStage ? '52px' : 'unset',
          transition: 'background-color 700ms ease',
          '&:hover': {
            cursor: 'pointer',
            backgroundColor: theme.palette.neutral.main,
          },
        }}
      >
        <Box sx={{ color: theme.palette.common.black, textAlign: 'center', height: 'fit-content' }}>
          <Typography>{phase}</Typography>
        </Box>
        <Typography
          style={{
            color: theme.palette.common.black,
            writingMode: 'vertical-rl',
            fontWeight: 'bold',
            transform: 'rotateZ(180deg)',
            height: 'fit-content',
          }}
        >
          {name}
        </Typography>
      </Box>
    </Grid>
  )
}

interface StageHeaderProps {
  name: string
}

const StageHeader: React.FC<StageHeaderProps> = ({ name }) => (
  <Grid item sx={{ width: '100%', marginBottom: '10px' }}>
    <Box sx={{ borderRadius: 2, border: 1, width: '100%' }}>
      <Typography sx={{ textAlign: 'center', paddingX: '10px' }} variant='h6'>
        {name}
      </Typography>
    </Box>
  </Grid>
)
