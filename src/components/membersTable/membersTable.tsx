import React, { SyntheticEvent, useCallback, useEffect, useState } from 'react'
import { Alert, AlertProps, LinearProgress, Snackbar } from '@mui/material'
import {
  DataGridPro,
  GridActionsCellItem,
  GridColumns,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
  GridRowParams,
  GridValueFormatterParams,
  MuiEvent,
  GridValueOptionsParams,
} from '@mui/x-data-grid-pro'
import {
  GetProjectMembersDocument,
  GraphQlProjectMember,
  useAddProjectMemberMutation,
  useAddProjectMembersToGroupMutation,
  useDeleteProjectMemberMutation,
  useGetProjectGroupsQuery,
  useGetProjectMembersQuery,
  useRemoveProjectMembersFromGroupMutation,
} from '../../dataAccess'
import { useParams } from 'react-router-dom'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Close'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import { CardTitle, DataFetchWrapper, PaperPage, NoRowsOverlay } from '@lcacollect/components'

export const MembersTable = () => {
  const { projectId } = useParams()
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})
  const [rows, setRows] = useState<Omit<GraphQlProjectMember, 'projectId'>[]>([])
  const [snackbar, setSnackbar] = useState<Pick<AlertProps, 'children' | 'severity'> | null>(null)
  const { data, error, loading } = useGetProjectMembersQuery({
    variables: { projectId: projectId as string },
    skip: !projectId,
  })
  const [deleteProjectMember] = useDeleteProjectMemberMutation({
    refetchQueries: [{ query: GetProjectMembersDocument, variables: { projectId: projectId as string } }],
  })
  const [addProjectMember] = useAddProjectMemberMutation({
    refetchQueries: [{ query: GetProjectMembersDocument, variables: { projectId: projectId as string } }],
  })
  const [addProjectMembersToGroup] = useAddProjectMembersToGroupMutation({
    refetchQueries: [{ query: GetProjectMembersDocument, variables: { projectId: projectId as string } }],
  })
  const [removeProjectMembersFromGroup] = useRemoveProjectMembersFromGroupMutation({
    refetchQueries: [{ query: GetProjectMembersDocument, variables: { projectId: projectId as string } }],
  })

  const handleProcessRowUpdateError = useCallback((error: Error) => {
    console.error(error)
    setSnackbar({ children: error.message, severity: 'error' })
  }, [])

  const handleCancelClick = useCallback(
    (id: GridRowId) => () => {
      setRowModesModel({
        ...rowModesModel,
        [id]: { mode: GridRowModes.View, ignoreModifications: true },
      })
    },
    [rowModesModel],
  )

  useEffect(() => {
    if (error || loading) {
      return
    }
    setRows(data?.projectMembers as Omit<GraphQlProjectMember, 'projectId'>[])
  }, [data, error, loading])

  const handleAddRow = () => {
    if (rows.find((row) => row.id === '' && row.name === '')) {
      setSnackbar({ children: 'You can only add 1 row at a time', severity: 'info' })
      return
    }
    setRows((oldRows) => [
      ...oldRows,
      {
        id: '',
        name: '',
        projectGroups: [],
        leaderOf: [],
        role: '',
        company: '',
        email: '',
        userId: '',
      } as Omit<GraphQlProjectMember, 'projectId'>,
    ])
    setRowModesModel((oldModel) => ({
      ...oldModel,
      '': { mode: GridRowModes.Edit, fieldToFocus: 'email' },
    }))
  }

  const handleEditClick = useCallback(
    (id: GridRowId) => () => {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } })
    },
    [rowModesModel],
  )

  const handleSaveClick = useCallback(
    (id: GridRowId) => () => {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } })
    },
    [rowModesModel],
  )

  const handleDeleteClick = useCallback(
    (id: GridRowId) => async () => {
      setRows((rows) => rows?.filter((row: GridRowModel) => row.id !== id))
      const { errors } = await deleteProjectMember({ variables: { userId: id.toString() } })
      if (errors) {
        errors.forEach((error) => console.error(error))
        setSnackbar({ children: errors[0].message, severity: 'error' })
      }
    },
    [deleteProjectMember],
  )

  const processRowUpdate = async (newRow: GridRowModel, oldRow: GridRowModel) => {
    if (newRow.id === '') {
      return await saveRow(newRow)
    }
    return await updateRow(newRow, oldRow as GraphQlProjectMember)
  }

  const saveRow = async (newRow: GridRowModel) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { errors, data } = await addProjectMember({ variables: { ...newRow, projectId: projectId as string } })

    if (errors) {
      throw new Error(errors[0].message)
    }

    const projectMember = data?.addProjectMember || { id: '' }
    setRows((rows) =>
      rows.map((row) =>
        row.id === '' ? ({ ...projectMember, leaderOf: [] } as Omit<GraphQlProjectMember, 'projectId'>) : row,
      ),
    )
    const newRowModes = {
      ...rowModesModel,
      [projectMember.id]: { mode: GridRowModes.View },
    }

    delete newRowModes['']
    setRowModesModel(newRowModes)
    return projectMember
  }

  const removeMember = async (groupId: string, memberId: string) => {
    const { errors, data } = await removeProjectMembersFromGroup({
      variables: { groupId: groupId as string, memberIds: [memberId] },
    })
    if (errors) {
      throw new Error(errors[0].message)
    }
    return data
  }

  const addMember = async (groupId: string, memberId: string) => {
    const { errors, data } = await addProjectMembersToGroup({
      variables: { groupId: groupId as string, memberIds: [memberId] },
    })
    if (errors) {
      throw new Error(errors[0].message)
    }
    return data
  }

  const updateRow = async (newRow: GridRowModel, oldRow: GraphQlProjectMember) => {
    if (typeof newRow.projectGroups === 'string' && !oldRow.projectGroups?.length) {
      // case where we add the group
      await addMember(newRow.projectGroups as string, newRow.id)
    } else if (!newRow.projectGroups?.length && oldRow.projectGroups?.length) {
      // case where we remove the group
      await removeMember(oldRow.projectGroups[0].id as string, newRow.id)
    } else if (
      typeof newRow.projectGroups === 'string' &&
      oldRow.projectGroups?.length &&
      newRow.projectGroups !== oldRow.projectGroups[0].id
    ) {
      // case where we change the group
      await removeMember(oldRow.projectGroups[0].id as string, newRow.id)
      await addMember(newRow.projectGroups as string, newRow.id)
    }
    setRows((rows) =>
      rows.map((row) => (row.id === newRow.id ? (newRow as Omit<GraphQlProjectMember, 'projectId'>) : row)),
    )
    const newRowModes = {
      ...rowModesModel,
      [newRow.id]: { mode: GridRowModes.View },
    }
    setRowModesModel(newRowModes)
    return newRow
  }

  const handleRowEditStart = (params: GridRowParams, event: MuiEvent<SyntheticEvent>) => {
    event.defaultMuiPrevented = true
  }

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    event.defaultMuiPrevented = true
  }

  const {
    data: groupData,
    error: groupError,
    loading: groupLoading,
  } = useGetProjectGroupsQuery({
    variables: { projectId: projectId as string },
    skip: !projectId,
  })

  const projectGroups = groupData?.projectGroups

  const groupValueFormatter = (cell: GridValueFormatterParams) => {
    if (typeof cell.value === 'string') {
      return projectGroups?.find((group) => group.id === cell.value)?.name
    } else if (typeof cell.value === 'object') {
      return cell.value[0]?.name
    }
    return ''
  }

  const groupValueOptions = (cell: GridValueOptionsParams) => {
    const options = projectGroups?.map((group) => ({
      value: group.id,
      label: group.name as string,
    }))
    if (options?.[0]) {
      return options
    }
    return [{ value: '', label: 'No groups in project' }]
  }

  const columns: GridColumns = [
    {
      field: 'id',
      headerName: 'ID',
    },
    {
      field: 'name',
      headerName: 'Name',
      flex: 2,
    },
    {
      field: 'email',
      headerName: 'Email',
      editable: true,
      flex: 2,
    },
    {
      field: 'projectGroups',
      headerName: 'Groups',
      flex: 2,
      type: 'singleSelect',
      editable: true,
      valueOptions: groupValueOptions,
      valueFormatter: groupValueFormatter,
    },
    {
      field: 'role',
      flex: 1,
      headerName: 'Role',
      valueGetter: (cell) => cell.row.leaderOf || [],
      valueFormatter: (cell) => (cell.value.length ? 'Group Leader' : 'Group Member'),
    },
    {
      field: 'company',
      flex: 2,
      headerName: 'Company',
    },
    {
      field: 'lastLogin',
      flex: 1,
      headerName: 'Last login',
      type: 'date',
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      flex: 1,
      cellClassName: 'actions',
      getActions: ({ id }: { id: GridRowId }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit

        if (isInEditMode) {
          return [
            <GridActionsCellItem key={0} icon={<SaveIcon />} label='Save' onClick={handleSaveClick(id)} />,
            <GridActionsCellItem
              key={1}
              icon={<CancelIcon />}
              label='Cancel'
              className='textPrimary'
              onClick={handleCancelClick(id)}
              color='inherit'
            />,
          ]
        }

        return [
          <GridActionsCellItem
            key={0}
            icon={<EditIcon />}
            label='Edit'
            className='textPrimary'
            onClick={handleEditClick(id)}
            color='inherit'
          />,
          <GridActionsCellItem
            key={1}
            icon={<DeleteIcon />}
            label='Delete'
            onClick={handleDeleteClick(id)}
            color='inherit'
          />,
        ]
      },
    },
  ]

  return (
    <PaperPage>
      <CardTitle title='Project Members' size='large' onClickHandler={handleAddRow} data-testid='member-table' />
      <div style={{ height: 400, width: '100%' }}>
        <DataFetchWrapper error={error || groupError}>
          <DataGridPro
            columns={columns}
            rows={rows}
            editMode='row'
            loading={loading || groupLoading}
            columnVisibilityModel={{
              id: false,
            }}
            components={{ LoadingOverlay: LinearProgress, NoRowsOverlay: NoRowsOverlay }}
            componentsProps={{
              toolbar: { handleAddRow },
              noRowsOverlay: { text: 'No project members added' },
            }}
            experimentalFeatures={{ newEditingApi: true }}
            onRowEditStart={handleRowEditStart}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={processRowUpdate}
            rowModesModel={rowModesModel}
            sx={{ border: 0 }}
            onProcessRowUpdateError={handleProcessRowUpdateError}
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
