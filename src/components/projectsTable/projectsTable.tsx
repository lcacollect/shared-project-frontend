import { Alert, AlertProps, CircularProgress, LinearProgress, Snackbar } from '@mui/material'

import {
  GraphQlProject,
  useAddProjectMutation,
  useDeleteProjectMutation,
  useGetAccountQuery,
  useGetProjectsQuery,
  GetProjectsDocument,
  useGetLifeCycleStagesQuery,
  LifeCycleStageInput,
} from '../../dataAccess'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CardTitle, DataFetchWrapper, NoRowsOverlay, PaperPage } from '@lcacollect/components'
import { useSettingsContext } from '@lcacollect/core'
import {
  DataGridPro,
  GridActionsCellItem,
  GridRowId,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
  GridRowParams,
  GridValueFormatterParams,
} from '@mui/x-data-grid-pro'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import { GraphQLErrors } from '@apollo/client/errors'

interface ProjectsTableProps {
  canCreateProjects?: boolean
  createButtonToolTip?: string
  projectCreationCallback?: (projectId: string) => void
}

export const ProjectsTable = ({
  canCreateProjects,
  createButtonToolTip,
  projectCreationCallback,
}: ProjectsTableProps) => {
  const { domainName, projectStageList } = useSettingsContext()
  const [snackbar, setSnackbar] = useState<Pick<AlertProps, 'children' | 'severity'> | null>(null)

  const projectFilters = domainName ? { domain: { equal: domainName } } : undefined
  const {
    data: projectData,
    error: projectError,
    loading: projectLoading,
  } = useGetProjectsQuery({ variables: { projectFilters } })

  const projects = useMemo(() => projectData?.projects, [projectData])

  const { data: accountData, error: accountError, loading: accountLoading } = useGetAccountQuery()
  const { data: stageData, error: stageError, loading: stageLoading } = useGetLifeCycleStagesQuery()

  const [deleteProject, { loading: deleteLoading }] = useDeleteProjectMutation({
    refetchQueries: [{ query: GetProjectsDocument, variables: { projectFilters } }],
  })
  const [addProject] = useAddProjectMutation()

  const navigate = useNavigate()

  const isAdmin = useMemo(
    () => (accountData ? accountData.account.roles.indexOf('lca_super_admin') > -1 : false),
    [accountData],
  )

  const projectStages = useMemo(
    () =>
      projectStageList
        ? stageData?.lifeCycleStages
            .filter((stage) => {
              if (projectStageList.includes(stage.phase)) {
                return true
              }
            })
            .map((stage) => ({ stageId: stage.id }))
        : [],
    [stageData],
  )

  const handleCreateProject = async () => {
    if (!accountData?.account.id) {
      const error = 'Account details not loaded. Please try again'
      console.error(error)
      setSnackbar({ children: error, severity: 'error' })
      return null
    }

    const projectVariables = {
      ...(projectStageList && { stages: projectStages as unknown as LifeCycleStageInput }),
      ...{ name: '', members: [{ userId: accountData?.account.id as string }] },
      ...(domainName && { domain: domainName }),
    }

    const { data, errors } = await addProject({
      variables: projectVariables,
      refetchQueries: [{ query: GetProjectsDocument, variables: { projectFilters } }],
    })
    if (errors) {
      handleErrors(errors)
    } else {
      const projectId = data?.addProject.id || ''
      handleRowClick(projectId as GridRowId, 'settings')
      if (projectCreationCallback) {
        projectCreationCallback(projectId)
      }
    }
  }

  const handleRowClick = (projectId: GridRowId, subpage = '') => {
    const recentProjects = localStorage.getItem('recentProjects')?.split(',') || []
    if (recentProjects.indexOf(projectId as string) === -1) {
      recentProjects.push(projectId as string)
      if (recentProjects.length > 5) {
        recentProjects.shift()
      }
      localStorage.setItem('recentProjects', recentProjects.join(','))
    }
    navigate(`/projects/${projectId}/${subpage}`)
  }

  const handleDeleteProject = async (projectId: GridRowId) => {
    const { errors } = await deleteProject({ variables: { id: projectId as string } })
    if (errors) {
      handleErrors(errors)
    } else {
      const recentProjects = localStorage.getItem('recentProjects')?.split(',') || []
      const index = recentProjects.indexOf(projectId as string)
      if (index >= 0) {
        recentProjects.splice(index, 1)
        localStorage.setItem('recentProjects', recentProjects.join(','))
      }
    }
  }

  const handleErrors = (errors: GraphQLErrors) => {
    errors.forEach((error) => {
      console.error(error)
      setSnackbar({ children: error.message, severity: 'error' })
    })
  }

  const columns = useMemo(
    () => [
      {
        field: 'id',
        headerName: 'ID',
        flex: 1,
      },
      {
        field: 'projectId',
        headerName: 'Project ID',
        flex: 1,
      },
      {
        field: 'name',
        headerName: 'Name',
        flex: 2,
      },
      {
        field: 'client',
        headerName: 'Client',
        flex: 2,
      },
      {
        field: 'public',
        headerName: 'Public Project',
        flex: 1,
        valueFormatter: (cell: GridValueFormatterParams) => (cell.value ? 'Yes' : 'No'),
      },
      {
        field: 'actions',
        type: 'actions',
        headerName: 'Actions',
        flex: 1,
        maxWidth: 100,
        cellClassName: 'actions',
        getActions: ({ id, row }: { id: GridRowId; row: GraphQlProject }) => {
          if (row.metaFields.owner === accountData?.account.id || isAdmin) {
            return [
              <GridActionsCellItem
                key={0}
                icon={deleteLoading ? <CircularProgress /> : <DeleteIcon />}
                label='Delete'
                disabled={deleteLoading}
                onClick={() => handleDeleteProject(id)}
                color='inherit'
              />,
            ]
          }
          return []
        },
      },
    ],
    [accountData, isAdmin, deleteLoading],
  )

  return (
    <PaperPage data-testid='projects-table'>
      <CardTitle
        title='Projects'
        size='large'
        onClickHandler={handleCreateProject}
        data-testid='project-table'
        disableButton={!canCreateProjects}
        tooltipText={createButtonToolTip}
      />
      <div style={{ height: 400, width: '100%' }}>
        <DataFetchWrapper error={projectError || accountError || stageError}>
          <DataGridPro
            columns={columns}
            rows={projects || []}
            loading={projectLoading || accountLoading || stageLoading}
            columnVisibilityModel={{
              id: false,
            }}
            components={{ Toolbar: ProjectToolbar, LoadingOverlay: LinearProgress, NoRowsOverlay: NoRowsOverlay }}
            componentsProps={{
              noRowsOverlay: { text: 'No projects available' },
            }}
            experimentalFeatures={{ newEditingApi: true }}
            sx={{
              border: 0,
              '.MuiDataGrid-row': {
                cursor: 'pointer',
              },
            }}
            isRowSelectable={() => false}
            onRowClick={(params: GridRowParams) => handleRowClick(params.id)}
          />
          {!!snackbar && (
            <Snackbar
              open
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              onClose={() => setSnackbar(null)}
              autoHideDuration={6000}
            >
              <Alert {...snackbar} onClose={() => setSnackbar(null)} />
            </Snackbar>
          )}
        </DataFetchWrapper>
      </div>
    </PaperPage>
  )
}

const ProjectToolbar = () => {
  const color = 'black'
  const fontWeight = 'bold'

  return (
    <GridToolbarContainer data-testid='table-toolbar'>
      <GridToolbarColumnsButton
        sx={{
          color,
          fontWeight,
        }}
      />
      <GridToolbarFilterButton sx={{ color, fontWeight }} />
    </GridToolbarContainer>
  )
}
