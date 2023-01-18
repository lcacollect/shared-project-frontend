import { useParams } from 'react-router-dom'

import Home from '@mui/icons-material/HomeOutlined'
import Results from '@mui/icons-material/SignalCellularAltOutlined'
import Person from '@mui/icons-material/Person'
import Settings from '@mui/icons-material/Settings'
import Inventory from '@mui/icons-material/Menu'
import OutboxIcon from '@mui/icons-material/Outbox'
import Assemblies from '@mui/icons-material/LayersOutlined'
import Environmental from '@mui/icons-material/ContentCopy'
import { GlobalCompositeIcon, MenuGroupProps, MenuItem, SideMenu, theme } from '@lcacollect/components'

export const LcaProjectSideMenu = () => {
  const { projectId } = useParams()

  const projectMenuItems: MenuItem[] = [
    {
      icon: <Home sx={{ color: theme.palette.common.black }} />,
      link: `/projects/${projectId}}`,
      title: 'Project',
    },
    {
      icon: <Results sx={{ color: theme.palette.common.black }} />,
      link: `/projects/${projectId}/results`,
      title: 'Results',
    },
    {
      icon: <Person sx={{ color: theme.palette.common.black }} />,
      link: `/projects/${projectId}/members`,
      title: 'Members',
    },
    {
      icon: <Settings sx={{ color: theme.palette.common.black }} />,
      link: `/projects/${projectId}/settings`,
      title: 'Settings',
    },
    {
      icon: <Inventory sx={{ color: theme.palette.common.black }} />,
      link: `/projects/${projectId}/inventory`,
      title: 'Inventory',
    },
    {
      icon: <OutboxIcon sx={{ color: theme.palette.common.black }} />,
      link: `/projects/${projectId}/sources`,
      title: 'Sources',
    },
    {
      icon: <Assemblies sx={{ color: theme.palette.common.black }} />,
      link: `/projects/${projectId}/assemblies`,
      title: 'Assemblies',
    },
    {
      icon: <Environmental sx={{ color: theme.palette.common.black }} />,
      link: `/projects/${projectId}/epds`,
      title: 'Environmental Data',
    },
    {
      icon: <OutboxIcon sx={{ color: theme.palette.common.black }} />,
      link: `/projects/${projectId}/quantities`,
      title: 'Bill of Quantities',
    },
  ]

  const globalMenuItems: MenuItem[] = [
    {
      icon: <GlobalCompositeIcon MainIcon={Home} />,
      link: '/projects',
      title: 'Projects',
    },
    {
      icon: <GlobalCompositeIcon MainIcon={Assemblies} />,
      link: '/assemblies',
      title: 'Assemblies',
    },
    {
      icon: <GlobalCompositeIcon MainIcon={Environmental} />,
      link: '/epds',
      title: 'Environmental Data',
    },
  ]

  const projectMenuGroups: MenuGroupProps[] = [{ items: projectMenuItems }, { items: globalMenuItems }]

  return <SideMenu menuGroups={projectMenuGroups} />
}
