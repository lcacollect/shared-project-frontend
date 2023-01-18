import React from 'react'
import { Divider, Grid, Typography } from '@mui/material'
import { GraphQlLifeCycleStage, useGetLifeCycleStagesQuery, useGetProjectStagesQuery } from '../../dataAccess'
import { ErrorMessage, InnerPaper, Loading } from '@lcacollect/components'
import { StageCategory } from './stageCategory'

interface StageCategoryGroup {
  [key: string]: GraphQlLifeCycleStage[]
}

interface ProjectStagesProps {
  projectId?: string
}

export const ProjectStages: React.FC<ProjectStagesProps> = ({ projectId }) => {
  const { data: lifeCycleStageData, loading: lifeCycleStageLoading } = useGetLifeCycleStagesQuery()
  const { data: projectStageData, loading: projectStageLoading } = useGetProjectStagesQuery({
    variables: { projectId: projectId as string },
    skip: !projectId,
  })

  if (lifeCycleStageLoading || projectStageLoading) {
    return <Loading />
  }

  if (!lifeCycleStageData || !projectStageData) {
    return <ErrorMessage />
  }

  const categories: StageCategoryGroup = lifeCycleStageData?.lifeCycleStages.reduce(
    (groups: StageCategoryGroup, stage: GraphQlLifeCycleStage) => {
      if (!groups[stage.category]) {
        groups[stage.category] = []
      }
      groups[stage.category].push(stage)

      return groups
    },
    {},
  )

  return (
    <InnerPaper data-testid='stages-table'>
      <Typography variant='h5'>Stages</Typography>
      <Divider sx={{ marginBottom: 3 }} />
      <Grid container spacing={2} sx={{ justifyContent: 'space-evenly' }}>
        {Object.keys(categories).map((name, index) => (
          <Grid item key={index} sx={{ maxWidth: '315px', width: 'auto' }}>
            <StageCategory
              projectId={projectId}
              categoryName={name}
              stages={categories[name]}
              projectStages={projectStageData?.projectStages.filter((stage) => stage.category === name)}
            />
          </Grid>
        ))}
      </Grid>
    </InnerPaper>
  )
}
