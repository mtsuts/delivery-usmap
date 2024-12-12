import React from 'react'

function ZoomButtons() {
  return (
    <div
      style={{
        marginLeft: '80px',
        marginTop: '40px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <button
        style={{
          width: '30px',
          padding: '5px',
          backgroundColor: '#004223',
          border: 'none',
          color: '#fff',
          cursor: 'pointer',
        }}
        id='zoom_in'
      >
        +
      </button>
      <button
        style={{
          width: '30px',
          padding: '5px',
          backgroundColor: '#004223',
          border: 'none',
          marginTop: '5px',
          color: '#fff',
          cursor: 'pointer',
        }}
        id='zoom_out'
      >
        -
      </button>
    </div>
  )
}

export default ZoomButtons
