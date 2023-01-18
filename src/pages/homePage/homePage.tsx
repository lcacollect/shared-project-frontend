import { RecentProjectsPaper, ProjectsTable } from '../../components'
import { PaperPageStack } from '@lcacollect/components'

export const ProjectsHomePage = () => {
  return (
    <PaperPageStack data-testid='projects-homepage'>
      <RecentProjectsPaper />
      <ProjectsTable />
    </PaperPageStack>
  )
}
