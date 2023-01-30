import React, { useEffect, useState } from 'react'
import { Box, Button, Stack, Typography } from '@mui/material'
import DriveFolderUploadOutlinedIcon from '@mui/icons-material/DriveFolderUploadOutlined'
import { CardTitle, InnerPaper, theme } from '@lcacollect/components'
import { useParams } from 'react-router-dom'
import { GetSingleProjectDocument, useGetSingleProjectQuery, useUpdateProjectMutation } from '../../dataAccess'
import { fileToBase64 } from './fileToBase64'

export const BuildingImageUpload = () => {
  const [fileUploaded, setFileUploaded] = useState<string | undefined>()
  const [selectedFile, setSelectedFile] = useState<File | undefined | null>()
  const [isFilePicked, setIsFilePicked] = useState(false)
  const [previewImg, setPreviewImg] = useState<string | null>(null)
  const { projectId } = useParams()
  const { data } = useGetSingleProjectQuery({
    variables: { id: projectId as string },
    skip: !projectId,
  })
  const [updateProjectMutation] = useUpdateProjectMutation({
    refetchQueries: [{ query: GetSingleProjectDocument, variables: { projectId } }],
  })
  let uploadRef: HTMLInputElement | null

  const projectData = data?.projects[0]
  const handleOpen = () => {
    uploadRef?.click()
  }
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileUploaded(e.target.files ? e.target.files[0].name : undefined)

    setSelectedFile(e.target.files ? e.target.files[0] : undefined)

    setIsFilePicked(true)
  }

  const handleConfirm = async () => {
    const encodedFile = selectedFile ? ((await fileToBase64(selectedFile)) as string) : undefined
    // check if we got the image already or not
    let response
    if (projectData?.imageUrl !== undefined) {
      // the type from getSingleProject and the update is almost the same
      // just the update use 'file' instead of 'imageUrl'
      const { imageUrl: _, ...tempFix } = projectData

      const projectSaveData = {
        ...tempFix,
        file: encodedFile,
      }
      response = await updateProjectMutation({
        variables: {
          ...projectSaveData,
        },
      })
      if (!response.errors) {
        window.location.reload()
      } else {
        console.error(response.errors)
      }
    }
  }

  useEffect(() => {
    let fileReader: FileReader,
      isCancel = false
    if (selectedFile) {
      fileReader = new FileReader()
      fileReader.onload = (e) => {
        const result = e.target?.result
        if (result && !isCancel) {
          setPreviewImg(result as string)
        }
      }
      fileReader.readAsDataURL(selectedFile)
    }
    return () => {
      isCancel = true
      if (fileReader && fileReader.readyState === 1) {
        fileReader.abort()
      }
    }
  }, [selectedFile])

  return (
    <InnerPaper data-testid='image-upload'>
      <CardTitle title='Image' size='medium' />
      <Stack spacing={2}>
        <Box
          id='image-upload'
          height={'18rem'}
          sx={{
            marginTop: '17px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `1px solid ${theme.palette.grey[200]}`,
            borderRadius: '20px',
            overflow: 'clip',
            marginBottom: '10px',
          }}
        >
          <img
            aria-label='preview-image'
            data-testid='preview-image'
            src={
              selectedFile
                ? URL.createObjectURL(selectedFile)
                : projectData?.imageUrl
                ? (projectData.imageUrl as string)
                : (previewImg as string)
            }
            style={{
              display: selectedFile || previewImg !== null || projectData?.imageUrl ? 'block' : 'none',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />

          <DriveFolderUploadOutlinedIcon
            data-testid='upload-building-image-icon'
            sx={{
              display: selectedFile || projectData?.imageUrl ? 'none' : 'block',
              fontSize: '70px',
              fill: theme.palette.grey[200],
            }}
          />
        </Box>
        <Typography>{fileUploaded}</Typography>
        {isFilePicked && (
          <Button
            onClick={handleConfirm}
            sx={{
              height: '36px',
              borderRadius: '4px',
              backgroundColor: theme.palette.primary.main,
              boxShadow: '0px 3px 3px #000000061',
              color: theme.palette.common.white,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              },
            }}
          >
            Confirm
          </Button>
        )}
        <Button
          onClick={handleOpen}
          sx={{
            height: '36px',
            borderRadius: '4px',
            backgroundColor: isFilePicked ? theme.palette.primary.dark : theme.palette.primary.main,
            boxShadow: '0px 3px 3px #000000061',
            color: theme.palette.common.white,
            '&:hover': {
              backgroundColor: isFilePicked ? theme.palette.primary.main : theme.palette.primary.dark,
            },
          }}
        >
          {isFilePicked ? 'Change' : 'UPLOAD'}
        </Button>
        <input
          ref={(node) => {
            uploadRef = node
          }}
          data-testid='project-image-upload'
          id='ProjectImageUpload'
          type='file'
          onChange={handleUpload}
          style={{ display: 'none' }}
          accept='.jpg, .jpeg, .png, .webp'
        />
      </Stack>
    </InnerPaper>
  )
}
