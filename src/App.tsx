import React, { useState } from 'react'
import { tauri } from '@tauri-apps/api'
import './App.css'

function App() {
  const [sendText, setSendText] = useState<string>('')
  const [receivedText, setReceivedText] = useState<string>('')

  return (
    <div
      className="dark"
      style={{ width: '100vw', height: '100vh', background: '#1f1f1f', color: '#ededed' }}
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
        <div className="flex justify-items-center">
          <textarea
            className="m-4 bg-gray-900 resize-none w-72 p-2 h-28 border border-gray-600 rounded-md"
            placeholder="Enter text to send"
            onChange={(e) => setSendText(e.target.value)}
          />
          <div
            className="m-4 bg-gray-900 w-72 p-2 h-28 border border-gray-600 rounded-md text-left"
            style={{
              whiteSpace: 'pre',
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
