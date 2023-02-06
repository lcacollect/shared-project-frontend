import { Box, Typography } from '@mui/material'
import React from 'react'
import { GraphQlProjectMember } from '../../../dataAccess'

interface TeamProps {
  name: string
  members?: Pick<GraphQlProjectMember, 'id' | 'name'>[] | null
  lead?: Pick<GraphQlProjectMember, 'id' | 'name'> | null
}
export const Team = ({ name, members, lead }: TeamProps) => (
  <div>
    <Typography variant='caption'>{name}</Typography>
    <Indented>
      <NestedLine />
      <Typography variant='caption'>{lead?.name ?? 'N/A'}</Typography>
      {members && members.length > 0 ? (
        <Indented>
          {members
            .filter((m) => m.id !== lead?.id)
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
  </div>
)

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
