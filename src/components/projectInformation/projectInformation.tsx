import { AutoSaveCheckMark, CardTitle, InnerPaper, Loading, theme } from '@lcacollect/components'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import CheckIcon from '@mui/icons-material/Check'
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
import React, { Dispatch, ReactNode, SetStateAction, SyntheticEvent, useState } from 'react'
import { GetSingleProjectDocument, GraphQlProject, ProjectDomain, useUpdateProjectMutation } from '../../dataAccess'

interface ProjectInformationProps {
  project?: GraphQlProject
  selectionDropdown?: ReactNode
}

export const ProjectInformation: React.FC<ProjectInformationProps> = (props) => {
  const { project, selectionDropdown } = props

  const [snackbar, setSnackbar] = useState<Pick<AlertProps, 'children' | 'severity'> | null>(null)

  if (!project) {
    return <Loading />
  }

  const fields = [
    { id: 'name', label: 'Project Name' },
    { id: 'projectId', label: 'Project Id' },
    { id: 'client', label: 'Client' },
    { id: 'address', label: 'Address' },
    { id: 'city', label: 'City' },
    { id: 'country', label: 'Country' },
    {
      id: 'public',
      label: 'Public Project',
      type: 'dropdown',
      options: [
        { label: 'Yes', value: true },
        { label: 'No', value: false },
      ],
    },
  ]

  return (
    <InnerPaper data-testid='project-information-table'>
      <CardTitle title='Project Information' size='medium' />
      <Stack spacing={2} sx={{ marginTop: 2 }}>
        {fields.map(({ id, label, type = 'text', options = null }, index) => (
          <InformationInput
            key={index}
            id={id}
            label={label}
            data={project[id as keyof GraphQlProject]}
            projectId={project.id}
            setError={setSnackbar}
            data-testid={`project-information-input-${id}`}
            type={type}
            options={options}
          />
        ))}
        {selectionDropdown ?? <DomainDropdown data={project.domain} projectId={project.id} setError={setSnackbar} />}
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

interface DomainDropdownProps {
  data?: ProjectDomain | null | undefined
  projectId: string | null | undefined
  setError: Dispatch<SetStateAction<Pick<AlertProps, 'children' | 'severity'> | null>>
}

const DomainDropdown = ({ data, projectId, setError }: DomainDropdownProps) => {
  const [domain, setDomain] = useState(data || '')
  const [showCheckmark, setShowCheckmark] = useState(false)
  const [updateProject, { loading, error }] = useUpdateProjectMutation()

  const handleDomainChange = async (event: SelectChangeEvent) => {
    const value = event.target.value as ProjectDomain
    setDomain(value)
    if (!projectId) {
      return
    }
    const { errors } = await updateProject({
      variables: { id: projectId, domain: value },
    })

    if (errors) {
      errors.forEach((error) => console.error(error))
      setError({ children: errors[0].message, severity: 'error' })
    } else {
      setError(null)
      setShowCheckmark(true)
      setTimeout(() => setShowCheckmark(false), 2000)
    }
  }
  return (
    <FormControl fullWidth variant='standard'>
      <InputLabel id='select-domain'>Domain</InputLabel>
      <Select
        labelId='select-domain'
        value={domain}
        label='domain'
        onChange={handleDomainChange}
        IconComponent={() =>
          loading ? (
            <Loading />
          ) : showCheckmark ? (
            <CheckIcon sx={{ color: error ? theme.palette.error.main : theme.palette.success.main }} />
          ) : (
            <ArrowDropDownIcon />
          )
        }
      >
        {Object.values(ProjectDomain).map((domain, index) => (
          <MenuItem key={index} value={domain}>
            {domain.charAt(0).toUpperCase() + domain.slice(1)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

interface InformationInputProps {
  id: string
  label: string
  data?: string | number | boolean
  projectId: string
  type: 'text' | 'dropdown' | string
  options?: { label: string; value: string | boolean }[] | null
  setError: Dispatch<SetStateAction<Pick<AlertProps, 'children' | 'severity'> | null>>
}

const InformationInput = (props: InformationInputProps) => {
  const { id, label, data = '', type, options, projectId, setError } = props
  const [value, setValue] = useState<typeof data>(data)
  const [updateProject, { loading, error }] = useUpdateProjectMutation()

  const handleBlur = async (event?: SelectChangeEvent<typeof value>) => {
    let _value = value
    if (event?.type === 'click') {
      _value = event.target.value
      setValue(_value)
    }

    const { errors } = await updateProject({
      variables: { id: projectId, [id]: _value },
      refetchQueries: [{ query: GetSingleProjectDocument, variables: { id: projectId } }],
    })

    if (errors) {
      errors.forEach((error) => console.error(error))
      errors.forEach((error) => console.log(error))
      setError({ children: errors[0].message, severity: 'error' })
    } else {
      setError(null)
    }
  }

  if (type === 'dropdown') {
    return (
      <FormControl fullWidth variant='standard'>
        <InputLabel id={`select-${id}`}>{label}</InputLabel>
        <Select
          labelId={`select-${id}`}
          id={id}
          defaultValue={value.toString()}
          value={value.toString()}
          label={label}
          onChange={(e) => handleBlur(e)}
        >
          {options?.map((option, index) => (
            <MenuItem key={index} value={option.value as string}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    )
  }
  return (
    <TextField
      id={id}
      label={label}
      variant='standard'
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => handleBlur()}
      InputLabelProps={{
        shrink: true,
      }}
      InputProps={{
        endAdornment: <AutoSaveCheckMark loading={loading} error={error} />,
      }}
    />
  )
}
