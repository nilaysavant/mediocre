import React from 'react'

function Topbar() {
  return (
    <div className="flex w-full">
      <button className="bg-gray-700 px-6 py-1 rounded-sm m-1">File</button>
      <button className="bg-gray-700 px-6 py-1 rounded-sm m-1">Edit</button>
      <button className="bg-gray-700 px-6 py-1 rounded-sm m-1">Help</button>
    </div>
  )
}

export default React.memo(Topbar)
