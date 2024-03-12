import React, { CSSProperties } from 'react'
import { recentProjectsLogo, envidanLogo } from '../../assets'
import { Link } from 'react-router-dom'
import { SxProps, Theme } from '@mui/material'
import { useSettingsContext } from '@lcacollect/core'

interface LogoProps {
  sx?: SxProps<Theme>
}
export function ProjectLogoPlaceholder(props: LogoProps) {
  const { sx } = props

  const { domainName } = useSettingsContext()

  const image = domainName == 'envidan' ? envidanLogo : recentProjectsLogo

  const style = sx
    ? sx
    : {
        fontSize: '70px',
        display: 'block',
        margin: 'auto',
        height: '90px',
        paddingTop: '40px',
        paddingBottom: '14px',
        opacity: '0.2',
      }

  return (
    <Link to='/' aria-label='logo' data-testid='logo'>
      <img alt='lca-recent-prjects-logo' style={style as CSSProperties} src={image} />
    </Link>
  )
}
