import React, { useState } from 'react'
import { tauri } from '@tauri-apps/api'
import './App.css'

function App() {
  const [sendText, setSendText] = useState<string>('')
  const [receivedText, setReceivedText] = useState<string>('')

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
      <div className="flex flex-col items-center p-4">
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
          className="flex w-full m-4 rounded-sm"
          style={{
            border: '4px solid #404040',
          }}
        >
          <textarea
            className="mr-0 resize-none flex-1 p-2 h-28"
            placeholder="Enter text to send"
            onChange={(e) => setSendText(e.target.value)}
            style={{
              background: '#1f1f1f',
              borderRight: '4px solid #4a4a4a',
              overflow: 'auto',
              outline: 'none',
            }}
          />
          <div
            className="ml-0 flex-1 p-2 h-28 text-left"
            style={{
              whiteSpace: 'pre',
              background: '#1f1f1f',
              borderLeft: '4px solid #303030',
            }}
          >
            {receivedText || 'N/A'}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
