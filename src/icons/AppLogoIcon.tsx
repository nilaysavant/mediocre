import { createIcon, Icon, IconProps } from '@chakra-ui/react'
import React from 'react'

export type AppLogoIconProps = {
  isTauriDragRegion?: boolean
} & IconProps

const AppLogoIcon = ({
  isTauriDragRegion = false,
  ...rest
}: AppLogoIconProps) => {
  const icon = createIcon({
    displayName: 'AppLogoIcon',
    viewBox: '0 0 399.47 399.47',
    path: isTauriDragRegion ? (
      <>
        <path
          data-tauri-drag-region
          d="M100 66.348l100 267v-200.35z"
          fill="#5f8dd3"
        />
        <path
          data-tauri-drag-region
          d="M300 66.348l-100 267v-200.35z"
          fill="#214478"
        />
        <path
          data-tauri-drag-region
          d="M200 333.352l100-267v200.35z"
          fill="#5f8dd3"
        />
        <path
          data-tauri-drag-region
          d="M400 333.352l-100-267v200.35zM200 333.352l-100-267v200.35z"
          fill="#214478"
        />
        <path
          data-tauri-drag-region
          d="M.19 333.352l99.812-267v200.35z"
          fill="#5f8dd3"
        />
      </>
    ) : (
      <>
        <path d="M100 66.348l100 267v-200.35z" fill="#5f8dd3" />
        <path d="M300 66.348l-100 267v-200.35z" fill="#214478" />
        <path d="M200 333.352l100-267v200.35z" fill="#5f8dd3" />
        <path
          d="M400 333.352l-100-267v200.35zM200 333.352l-100-267v200.35z"
          fill="#214478"
        />
        <path d="M.19 333.352l99.812-267v200.35z" fill="#5f8dd3" />
      </>
    ),
  })

  return isTauriDragRegion ? (
    <Icon data-tauri-drag-region as={icon} {...rest} />
  ) : (
    <Icon as={icon} {...rest} />
  )
}

export default React.memo(AppLogoIcon)
