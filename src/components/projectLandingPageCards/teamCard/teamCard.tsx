import { useGetProjectGroupsForTeamCardQuery, useGetProjectMembersForTeamCardQuery } from '../../../dataAccess'
import { Stack } from '@mui/material'
import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { CardTitle, DataFetchWrapper, InnerPaper } from '@lcacollect/components'
import { Team } from './team'

export const LandingPageTeamCard: React.FC = () => {
  const { projectId = '' } = useParams()
  const {
    data: groupData,
    error: groupError,
    loading: groupLoading,
  } = useGetProjectGroupsForTeamCardQuery({
    variables: { projectId },
  })
  const {
    data: memberData,
    error: memberError,
    loading: memberLoading,
  } = useGetProjectMembersForTeamCardQuery({
    variables: { projectId },
  })

  const unassignedGroup = useMemo(() => {
    const unassignedMembers = memberData?.projectMembers.filter((member) => !member.projectGroups?.length) || []
    return { name: 'Unassigned', members: unassignedMembers, lead: undefined }
  }, [memberData])
  const groups = useMemo(() => {
    let group = groupData?.projectGroups ?? []
    if (unassignedGroup.members.length) {
      group = [...group, unassignedGroup]
    }
    return group
  }, [groupData, unassignedGroup])

  return (
    <InnerPaper>
      <CardTitle title='Team' size='medium' />
      <DataFetchWrapper error={groupError || memberError} loading={groupLoading || memberLoading}>
        <Stack direction={'column'} paddingTop={2}>
          {groups.map((group, idx) => {
            return <Team key={idx} {...group} />
          })}
        </Stack>
      </DataFetchWrapper>
    </InnerPaper>
  )
}
