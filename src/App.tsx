import React, { useState } from 'react'
import { tauri } from '@tauri-apps/api'
import './App.css'

function App() {
  const [sendText, setSendText] = useState<string>('')
  const [receivedText, setReceivedText] = useState<string>('')

  return (
    <div className="App">
      <header className="App-header">
        <img
          src="./res/logo512.png"
          className="App-logo"
          alt="logo-res-512png"
        />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <div className="flex flex-col mt-4 items-center">
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
                whiteSpace: 'pre-line',
              }}
            >
              {receivedText || 'N/A'}
            </div>
          </div>
        </div>
      </header>
    </div>
  )
}

export default App
