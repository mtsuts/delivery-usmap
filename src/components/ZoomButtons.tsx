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
          height: '30px',
          padding: '5px',
          backgroundColor: '#c93235',
          border: 'none',
          color: '#fff',
          cursor: 'pointer',
        }}
        id='zoom_in'
      >
        <svg
          // width='px'
          // height='64px'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          stroke='#ffffff'
        >
          <g id='SVGRepo_bgCarrier' stroke-width='0'></g>
          <g
            id='SVGRepo_tracerCarrier'
            stroke-linecap='round'
            stroke-linejoin='round'
          ></g>
          <g id='SVGRepo_iconCarrier'>
            {' '}
            <path
              d='M6 12H18M12 6V18'
              stroke='#ffffff'
              stroke-width='2'
              stroke-linecap='round'
              stroke-linejoin='round'
            ></path>{' '}
          </g>
        </svg>
      </button>
      <button
        style={{
          width: '30px',
          height: '30px',
          padding: '5px',
          backgroundColor: '#c93235',
          border: 'none',
          marginTop: '5px',
          color: '#fff',
          cursor: 'pointer',
        }}
        id='zoom_out'
      >
        <svg
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          stroke='#fffafa'
        >
          <g id='SVGRepo_bgCarrier' stroke-width='0'></g>
          <g
            id='SVGRepo_tracerCarrier'
            stroke-linecap='round'
            stroke-linejoin='round'
          ></g>
          <g id='SVGRepo_iconCarrier'>
            {' '}
            <path
              d='M6 12L18 12'
              stroke='#fff5f5'
              stroke-width='2'
              stroke-linecap='round'
              stroke-linejoin='round'
            ></path>{' '}
          </g>
        </svg>
      </button>
    </div>
  )
}

export default ZoomButtons
