import React, { useEffect, useState } from 'react'
import { tauri } from '@tauri-apps/api'
import { useColorMode } from '@chakra-ui/react'
import './App.css'
import Editor from './components/Editor'
import Render from './components/Render'
import Topbar from './components/Topbar'
import theme from './theme'
import clsx from 'clsx'

function App() {
  const { colorMode } = useColorMode()
  const [sendText, setSendText] = useState<string>('')
  const [receivedText, setReceivedText] = useState<string>('')

  useEffect(() => {
    const handleTextChange = async () => {
      const res: { markup: string } = await tauri.invoke('parse_md_to_mu', {
        mdString: sendText,
      })
      setReceivedText(res.markup)
    }
    handleTextChange()
  }, [sendText])

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: '#2b2b2b',
        fontSize: 18,
      }}
    >
      <div className="flex flex-col items-center p-2 h-full">
        <Topbar />
        <div
          className="flex w-full m-1 rounded-sm h-full"
          style={{
            border: '4px solid #404040',
          }}
        >
          <Editor text={sendText} setText={setSendText} />
          <Render markup={receivedText} />
        </div>
      </div>
    </div>
  )
}

export default App
