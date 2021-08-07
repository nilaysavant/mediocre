import { Box, Progress } from '@chakra-ui/react'
import { Suspense } from 'react'
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config'
import SideBar from 'src/components/SideBar'

const AppLayout = ({ route }: RouteConfigComponentProps) => {
  return (
    <Box flex="1" display="flex" rounded="none" minHeight="0">
      <SideBar width="15%" />
      <Suspense fallback={<Progress isIndeterminate size="xs" w="full" />}>
        {route ? renderRoutes(route.routes) : null}
      </Suspense>
    </Box>
  )
}

export default AppLayout
