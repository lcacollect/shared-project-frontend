import { Alert, AlertProps, LinearProgress, Snackbar } from '@mui/material'

import {
  GraphQlProject,
  useAddProjectMutation,
  useDeleteProjectMutation,
  useGetAccountQuery,
  useGetProjectsQuery,
} from '../../dataAccess'
import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CardTitle, DataFetchWrapper, NoRowsOverlay, PaperPage } from '@lcacollect/components'
import {
  DataGridPro,
  GridActionsCellItem,
  GridRowId,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
  GridRowParams,
} from '@mui/x-data-grid-pro'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import { GraphQLErrors } from '@apollo/client/errors'

export const ProjectsTable = () => {
  const [snackbar, setSnackbar] = useState<Pick<AlertProps, 'children' | 'severity'> | null>(null)
  const [addProject] = useAddProjectMutation()
  const { data: projectData, error: projectError, loading: projectLoading } = useGetProjectsQuery()
  const projects = useMemo(() => projectData?.projects, [projectData])
  const { data: accountData, error: accountError, loading: accountLoading } = useGetAccountQuery()
  const [deleteProject] = useDeleteProjectMutation({ refetchQueries: ['getProjects'] })

  const navigate = useNavigate()

  const isAdmin = useMemo(
    () => (accountData ? accountData.account.roles.indexOf('lca_super_admin') > -1 : false),
    [accountData],
  )

  const handleCreateProject = async () => {
    const { data, errors } = await addProject({
      variables: { name: '', members: [{ userId: accountData?.account.id as string }] },
      refetchQueries: ['getProjects'],
    })
    if (errors) {
      handleErrors(errors)
    } else {
      const projectId = data?.addProject.id || ''
      handleRowClick(projectId as GridRowId, 'settings')
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
                icon={<DeleteIcon />}
                label='Delete'
                onClick={() => handleDeleteProject(id)}
                color='inherit'
              />,
            ]
          }
          return []
        },
      },
    ],
    [accountData, isAdmin],
  )

  return (
    <PaperPage data-testid='projects-table'>
      <CardTitle title='Projects' size='large' onClickHandler={handleCreateProject} data-testid='project-table' />
      <div style={{ height: 400, width: '100%' }}>
        <DataFetchWrapper error={projectError || accountError}>
          <DataGridPro
            columns={columns}
            rows={projects || []}
            loading={projectLoading || accountLoading}
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
