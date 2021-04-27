import React, { useEffect, useState } from 'react'
import { tauri } from '@tauri-apps/api'
import './App.css'
import Editor from './components/Editor'
import Render from './components/Render'

function App() {
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
      className="dark"
      style={{
        width: '100vw',
        height: '100vh',
        background: '#2b2b2b',
        color: '#ededed',
      }}
    >
      <div className="flex flex-col items-center p-4 h-full">
        <button
          className="bg-gray-700 px-6 py-1 rounded-md"
          onClick={async () => {
            const res: { markup: string } = await tauri.invoke(
              'parse_md_to_mu',
              {
                mdString: sendText,
              }
            )
            console.log('🚀 ~ file: App.tsx ~ line 32 ~ onClick={ ~ res', res)
            setReceivedText(res.markup)
          }}
        >
          Send
        </button>
        <div
          className="flex w-full m-4 rounded-sm h-full"
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
