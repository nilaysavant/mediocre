import { Button } from '@chakra-ui/button'
import { useColorMode } from '@chakra-ui/color-mode'
import React from 'react'

function Topbar() {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <div className="flex w-full">
      <button className="bg-gray-700 px-6 py-1 rounded-sm m-1">File</button>
      <button className="bg-gray-700 px-6 py-1 rounded-sm m-1">Edit</button>
      <button className="bg-gray-700 px-6 py-1 rounded-sm m-1">Help</button>
      <Button className="dark:text-white text-black" onClick={toggleColorMode}>
        Toggle {colorMode === 'light' ? 'Dark' : 'Light'}
      </Button>
    </div>
  )
}

export default React.memo(Topbar)
