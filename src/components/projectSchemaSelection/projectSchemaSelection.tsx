import { AutoSaveCheckMark, DataFetchWrapper } from '@lcacollect/components'
import { Alert, AlertProps, Autocomplete, Snackbar, TextField } from '@mui/material'
import { SyntheticEvent, useState } from 'react'
import {
  GetProjectSchemasDocument,
  GraphQlSchemaTemplate,
  useAddReportingSchemaFromTemplateMutation,
  useGetProjectSchemasQuery,
  useGetSchemaTemplatesQuery,
} from '../../dataAccess'
import { ApolloError } from '@apollo/client'
import { useSettingsContext } from '@lcacollect/core'

interface ProjectSchemaSelectionProps {
  projectId: string
}

export const ProjectSchemaSelection = (props: ProjectSchemaSelectionProps) => {
  const { projectId } = props
  const { domainName } = useSettingsContext()

  const [snackbar, setSnackbar] = useState<Pick<AlertProps, 'children' | 'severity'> | null>(null)
  const [addReportingSchema, { loading }] = useAddReportingSchemaFromTemplateMutation({
    refetchQueries: [{ query: GetProjectSchemasDocument, variables: { projectId: projectId } }],
  })
  const {
    data: schemaTemplateData,
    loading: schemaTemplateLoading,
    error: schemaTemplateError,
  } = useGetSchemaTemplatesQuery({
    variables: { schemaTemplatesFilters: { domain: { isAnyOf: ['default', domainName || ''] } } },
  })

  const {
    data: projectSchemaData,
    loading: projectSchemaLoading,
    error: projectSchemaError,
  } = useGetProjectSchemasQuery({
    variables: {
      projectId,
    },
    skip: !projectId,
  })

  const isSchemaAdded = (template: GraphQlSchemaTemplate) => {
    return projectSchemaData?.reportingSchemas.find((reportingSchema) => reportingSchema.templateId == template.id)
  }

  const handleSchemaChange = async (event: SyntheticEvent, template: GraphQlSchemaTemplate | null | undefined) => {
    if (!template) {
      return null
    }

    if (isSchemaAdded(template)) {
      console.log('Reporting schema already exists, returning')
      return null
    }

    const { errors } = await addReportingSchema({
      variables: { projectId, name: template.original?.name, templateId: template.id },
    })

    if (errors) {
      setSnackbar({ children: `${errors[0].message}`, severity: 'error' })
    }

    return null
  }
  return (
    <DataFetchWrapper
      error={schemaTemplateError || projectSchemaError}
      loading={schemaTemplateLoading || projectSchemaLoading}
    >
      <Autocomplete
        data-testid='auto-complete'
        aria-label='reporting-schema-selector'
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        onChange={(event, template) => handleSchemaChange(event, template)}
        disablePortal
        id='reporting-schemas'
        getOptionLabel={(option) => option.name}
        value={
          projectSchemaData?.reportingSchemas[projectSchemaData?.reportingSchemas.length - 1] as GraphQlSchemaTemplate
        }
        options={schemaTemplateData?.schemaTemplates || []}
        isOptionEqualToValue={(option, value) => option.name === value.name}
        renderInput={(params) => (
          <TextField
            data-testid='text-field'
            {...params}
            label='Reporting Schema'
            variant='standard'
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  <AutoSaveCheckMark loading={loading} error={snackbar ? new ApolloError({}) : undefined} />
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
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
  )
}
