import React, { SyntheticEvent, useCallback, useEffect, useState } from 'react'
import { Alert, AlertProps, LinearProgress, Snackbar } from '@mui/material'
import {
  GetProjectGroupsDocument,
  GraphQlProjectGroup,
  useAddProjectGroupMutation,
  useDeleteProjectGroupMutation,
  useGetProjectGroupsQuery,
  useGetProjectMembersQuery,
  useUpdateProjectGroupMutation,
} from '../../dataAccess'
import { useParams } from 'react-router-dom'
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
  GridValueOptionsParams,
  MuiEvent,
} from '@mui/x-data-grid-pro'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Close'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import { CardTitle, DataFetchWrapper, PaperPage, NoRowsOverlay } from '@lcacollect/components'

export const GroupsTable = () => {
  const { projectId } = useParams()
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})
  const [rows, setRows] = useState<Omit<GraphQlProjectGroup, 'projectId'>[]>([])
  const [snackbar, setSnackbar] = useState<Pick<AlertProps, 'children' | 'severity'> | null>(null)
  const {
    data: groupData,
    error: groupError,
    loading: groupLoading,
  } = useGetProjectGroupsQuery({
    variables: { projectId: projectId as string },
    skip: !projectId,
  })

  const [deleteProjectGroup] = useDeleteProjectGroupMutation({
    refetchQueries: [{ query: GetProjectGroupsDocument, variables: { projectId: projectId as string } }],
  })
  const [addProjectGroup] = useAddProjectGroupMutation({
    refetchQueries: [{ query: GetProjectGroupsDocument, variables: { projectId: projectId as string } }],
  })
  const [updateProjectGroup] = useUpdateProjectGroupMutation({
    refetchQueries: [{ query: GetProjectGroupsDocument, variables: { projectId: projectId as string } }],
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
    if (groupError || groupLoading) {
      return
    }
    setRows(groupData?.projectGroups as Omit<GraphQlProjectGroup, 'projectId'>[])
  }, [groupData, groupError, groupLoading])

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
        leadId: null,
      } as Omit<GraphQlProjectGroup, 'projectId'>,
    ])
    setRowModesModel((oldModel) => ({
      ...oldModel,
      '': { mode: GridRowModes.Edit, fieldToFocus: 'name' },
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
      setRows(rows?.filter((row: GridRowModel) => row.id !== id))
      const { errors } = await deleteProjectGroup({ variables: { id: id.toString() } })
      if (errors) {
        errors.forEach((error) => console.error(error))
        setSnackbar({ children: errors[0].message, severity: 'error' })
      }
    },
    [rows, deleteProjectGroup],
  )

  const processRowUpdate = async (newRow: GridRowModel, oldRow: GridRowModel) => {
    if (newRow.id === '') {
      return await saveRow(newRow)
    }
    return await updateRow(newRow, oldRow)
  }

  const saveRow = async (newRow: GridRowModel) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { errors, data } = await addProjectGroup({ variables: { ...newRow, projectId: projectId as string } })

    if (errors) {
      throw new Error(errors[0].message)
    }
    const projectGroup = data?.addProjectGroup || (newRow as Omit<GraphQlProjectGroup, 'projectId'>)

    setRows(rows.map((row) => (row.id === '' ? projectGroup : row)))
    const newRowModes = {
      ...rowModesModel,
      [projectGroup.id as string]: { mode: GridRowModes.View },
    }

    delete newRowModes['']
    setRowModesModel(newRowModes)
    return projectGroup
  }

  const getGroupDataDifference = (oldRow: GridRowModel, newRow: GridRowModel) => {
    const changedObject = {} as { name: string; leadId: string }
    if (oldRow.name !== newRow.name) {
      changedObject['name'] = newRow.name
    }
    if (oldRow.leadId !== newRow.leadId) {
      changedObject['leadId'] = newRow.leadId
    }
    return changedObject
  }

  const updateRow = async (newRow: GridRowModel, oldRow: GridRowModel) => {
    const changeObject = getGroupDataDifference(oldRow, newRow)
    const { data, errors } = await updateProjectGroup({ variables: { ...changeObject, id: newRow.id } })
    if (errors) {
      throw new Error(errors[0].message)
    }

    setRows((rows) =>
      rows.map((row) => (row.id === newRow.id ? (newRow as Omit<GraphQlProjectGroup, 'projectId'>) : row)),
    )
    const newRowModes = {
      ...rowModesModel,
      [newRow.id]: { mode: GridRowModes.View },
    }
    setRowModesModel(newRowModes)
    return data?.updateProjectGroup
  }

  const handleRowEditStart = (params: GridRowParams, event: MuiEvent<SyntheticEvent>) => {
    event.defaultMuiPrevented = true
  }

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    event.defaultMuiPrevented = true
  }

  const {
    data: memberData,
    error: memberError,
    loading: memberLoading,
  } = useGetProjectMembersQuery({
    variables: { projectId: projectId as string },
    skip: !projectId,
  })

  const projectMembers = memberData?.projectMembers

  const leadValueOptions = (cell: GridValueOptionsParams) => {
    const options = projectMembers?.filter((member) => member.projectGroups?.find((group) => group.id == cell.id))
    if (options) {
      return options.map((option) => ({ value: option.id, label: option.name }))
    }
    return []
  }

  const columns: GridColumns = [
    {
      field: 'id',
      headerName: 'ID',
    },
    {
      field: 'name',
      headerName: 'Name',
      editable: true,
      flex: 2,
    },
    {
      field: 'leadId',
      headerName: 'Lead',
      editable: true,
      type: 'singleSelect',
      valueOptions: leadValueOptions,
      flex: 2,
      valueFormatter: (cell) => projectMembers?.find((member) => member.id === cell.value)?.name,
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
      <CardTitle title='Project Groups' size='large' onClickHandler={handleAddRow} data-testid='group-table' />
      <div style={{ height: 400, width: '100%' }}>
        <DataFetchWrapper error={groupError || memberError}>
          <DataGridPro
            columns={columns}
            rows={rows}
            editMode='row'
            loading={memberLoading || groupLoading}
            columnVisibilityModel={{
              id: false,
            }}
            components={{ LoadingOverlay: LinearProgress, NoRowsOverlay: NoRowsOverlay }}
            componentsProps={{
              toolbar: { handleAddRow },
              noRowsOverlay: { text: 'No project groups created' },
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
