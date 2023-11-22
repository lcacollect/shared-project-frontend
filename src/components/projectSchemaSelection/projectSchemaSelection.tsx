import { AutoSaveCheckMark, DataFetchWrapper } from '@lcacollect/components'
import { Alert, AlertProps, Autocomplete, Snackbar, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import {
  GetProjectSchemasDocument,
  GraphQlSchemaTemplate,
  useAddReportingSchemaFromTemplateMutation,
  useGetProjectSchemasQuery,
  useGetSchemaTemplatesQuery,
} from '../../dataAccess'
import { ApolloError } from '@apollo/client'

interface ProjectSchemaSelectionProps {
  projectId: string
}

export const ProjectSchemaSelection = (props: ProjectSchemaSelectionProps) => {
  const { projectId } = props

  const [isSchemaAdded, setIsSchemaAdded] = useState(false)
  const [defaultValue, setDefaultValue] = useState<GraphQlSchemaTemplate | null | undefined>()
  const [snackbar, setSnackbar] = useState<Pick<AlertProps, 'children' | 'severity'> | null>(null)
  const [addReportingSchema, { loading }] = useAddReportingSchemaFromTemplateMutation({
    refetchQueries: [{ query: GetProjectSchemasDocument, variables: { projectId: projectId } }],
  })
  const {
    data: schemaTemplateData,
    loading: schemaTemplateLoading,
    error: schemaTemplateError,
  } = useGetSchemaTemplatesQuery()

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

  // Set default value for reporting schema
  useEffect(() => {
    const schemaTemplates = schemaTemplateData?.schemaTemplates
    // Only after schemaTemplates have been fetched
    if (schemaTemplates) {
      // Only set default value if it doesn't already exist on the project
      if (!projectSchemaData?.reportingSchemas[0]) {
        const defaultTemplate = schemaTemplates[0] as GraphQlSchemaTemplate
        setDefaultValue(defaultTemplate)
        handleSchemaChange(defaultTemplate)
      }
    }
  }, [schemaTemplateData, projectSchemaData])

  const handleSchemaChange = async (template: GraphQlSchemaTemplate | null | undefined) => {
    if (!template) {
      return null
    }

    if (isSchemaAdded) {
      console.log('Reporting schema already exists, returning')
      return null
    }

    const { errors, data } = await addReportingSchema({
      variables: { projectId, name: template.schemas ? template.schemas[0].name : undefined, templateId: template.id },
    })

    if (errors) {
      setSnackbar({ children: `${errors[0].message}`, severity: 'error' })
    }

    if (data?.addReportingSchemaFromTemplate.id) {
      setIsSchemaAdded(true)
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
        onChange={(event, template) => handleSchemaChange(template)}
        disablePortal
        id='reporting-schemas'
        getOptionLabel={(option) => option.name}
        value={(projectSchemaData?.reportingSchemas[0] as GraphQlSchemaTemplate) ?? defaultValue}
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
