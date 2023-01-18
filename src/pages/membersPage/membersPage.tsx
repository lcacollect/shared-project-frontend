import React from 'react'
import { PaperPageStack } from '@lcacollect/components'
import { MembersTable, GroupsTable } from '../../components'

export const MembersPage = () => {
  return (
    <PaperPageStack>
      <MembersTable />
      <GroupsTable />
    </PaperPageStack>
  )
}
