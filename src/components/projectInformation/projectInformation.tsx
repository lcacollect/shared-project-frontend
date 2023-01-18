import React, { Dispatch, ReactNode, SetStateAction, useState } from 'react'
import {
  Alert,
  AlertProps,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Snackbar,
  Stack,
  TextField,
} from '@mui/material'
import { GraphQlProject, ProjectDomain, useUpdateProjectMutation } from '../../dataAccess'
import { CardTitle, InnerPaper, Loading, AutoSaveCheckMark } from '@lcacollect/components'

interface ProjectInformationProps {
  project?: GraphQlProject
  selectionDropdown?: ReactNode
}

export const ProjectInformation: React.FC<ProjectInformationProps> = (props) => {
  const { project, selectionDropdown = <DomainDropdown /> } = props

  const [snackbar, setSnackbar] = useState<Pick<AlertProps, 'children' | 'severity'> | null>(null)

  if (!project) {
    return <Loading />
  }

  return (
    <InnerPaper data-testid='project-information-table'>
      <CardTitle title='Project Information' size='medium' />
      <Stack spacing={2} sx={{ marginTop: 2 }}>
        <InformationInput
          id={'name'}
          label={'Project Name'}
          data={project.name}
          projectId={project.id}
          setError={setSnackbar}
        />
        <InformationInput
          id={'projectId'}
          label={'Project Id'}
          data={project.projectId as string}
          projectId={project.id}
          setError={setSnackbar}
        />
        <InformationInput
          id={'client'}
          label={'Client'}
          data={project.client as string}
          projectId={project.id}
          setError={setSnackbar}
        />
        <InformationInput
          id={'address'}
          label={'Address'}
          data={project.address as string}
          projectId={project.id}
          setError={setSnackbar}
        />
        <InformationInput
          id={'city'}
          label={'City'}
          data={project.city as string}
          projectId={project.id}
          setError={setSnackbar}
        />
        <InformationInput
          id={'country'}
          label={'Country'}
          data={project.country as string}
          projectId={project.id}
          setError={setSnackbar}
        />
        {selectionDropdown}
      </Stack>
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
    </InnerPaper>
  )
}

const DomainDropdown = () => {
  const [domain, setDomain] = useState('')

  const handleDomainChange = (event: SelectChangeEvent) => {
    setDomain(event.target.value as ProjectDomain)
    // TODO - Save to backend
  }
  return (
    <FormControl fullWidth variant='standard'>
      <InputLabel id='select-domain'>Domain</InputLabel>
      <Select labelId='select-domain' value={domain} label='domain' onChange={handleDomainChange}>
        <MenuItem value='infrastructure'>Infrastructure</MenuItem>
        <MenuItem value='energy'>Energy</MenuItem>
        <MenuItem value='buildings'>Buildings</MenuItem>
        <MenuItem value='tunnels'>Tunnels</MenuItem>
      </Select>
    </FormControl>
  )
}

interface InformationInputProps {
  id: string
  label: string
  data?: string
  projectId: string
  setError: Dispatch<SetStateAction<Pick<AlertProps, 'children' | 'severity'> | null>>
}

const InformationInput: React.FC<InformationInputProps> = (props) => {
  const { id, label, data = '', projectId, setError } = props
  const [value, setValue] = useState(data || '')
  const [updateProject, { loading, error }] = useUpdateProjectMutation()

  const handleBlur = async () => {
    const { errors } = await updateProject({ variables: { id: projectId, [id]: value } })

    if (errors) {
      errors.forEach((error) => console.error(error))
      setError({ children: errors[0].message, severity: 'error' })
    } else {
      setError(null)
    }
  }

  return (
    <TextField
      id={id}
      label={label}
      variant='standard'
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={handleBlur}
      InputLabelProps={{
        shrink: true,
      }}
      InputProps={{
        endAdornment: <AutoSaveCheckMark loading={loading} error={error} />,
      }}
    />
  )
}
