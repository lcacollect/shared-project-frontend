import { useGetProjectGroupsForTeamCardQuery } from '../../../dataAccess'
import { Paper, Stack, Typography, Box } from '@mui/material'
import React, { Fragment } from 'react'
import { useParams } from 'react-router-dom'
import { DataFetchWrapper } from '@lcacollect/components'

export const LandingPageTeamCard: React.FC = () => {
  const { projectId = '' } = useParams()
  const { data, error, loading } = useGetProjectGroupsForTeamCardQuery({
    variables: { projectId },
  })

  const groups = data?.projectGroups ?? []

  return (
    <Paper
      sx={{
        borderRadius: 3,
        height: '367px',
        padding: '20px',
      }}
    >
      <Typography id='lca-recent-projects-landing-page-statistics-title' fontWeight={'bold'} fontSize={24}>
        Team
      </Typography>
      <DataFetchWrapper error={error} loading={loading}>
        <Stack direction={'column'}>
          {groups.map((group, idx) => {
            return (
              <Fragment key={idx}>
                <Typography variant='caption' key={idx}>
                  {group.name}
                </Typography>
                <Indented>
                  <NestedLine />
                  <Typography variant='caption'>{group.lead?.name ?? 'N/A'}</Typography>
                  {group.members && group.members.length > 0 ? (
                    <Indented>
                      {group.members
                        .filter((m) => m.id !== group.lead?.id)
                        .map((m, i) => (
                          <Box key={m.id}>
                            <Typography component='div' sx={{ position: 'relative' }} variant='caption' key={m.id}>
                              <NestedLine notFirst={i !== 0} />
                              {m.name}
                            </Typography>
                          </Box>
                        ))}
                    </Indented>
                  ) : null}
                </Indented>
              </Fragment>
            )
          })}
        </Stack>
      </DataFetchWrapper>
    </Paper>
  )
}

interface IndentedProps {
  children?: React.ReactNode
}

const NestedLine = (props: { notFirst?: boolean }) => (
  <Box
    sx={{
      display: 'inline-block',
      left: -16,
      position: 'absolute',
      top: 0,
      height: 10,
      width: 14,
      border: '1px black solid',
      borderRight: 'none',
      borderTop: 'none',
      ...(props.notFirst
        ? {
            height: 20,
            top: -10,
          }
        : {}),
    }}
  />
)

const Indented: React.FC<IndentedProps> = ({ children }) => {
  return (
    <Box
      sx={{
        ml: 4,
        position: 'relative',
      }}
    >
      {children}
    </Box>
  )
}
