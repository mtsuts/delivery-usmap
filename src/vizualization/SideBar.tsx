import React from 'react'

type SideBarProps = {
  data: {
    position: number
    onClick: () => void
    imageSrc: string
    label: string
    isActive: boolean
  }[]
  buttonClick: () => void
}

const SideBar = ({ data, buttonClick }: SideBarProps) => {
  return (
    <div>
      <button
        onClick={buttonClick}
        style={{
          backgroundColor: '#c93235',
          borderRadius: '5px',
          color: '#fff',
          padding: '10px',
          fontWeight: '600',
          zIndex: 1000,
          cursor: 'pointer',
          border: 'none',
          margin: '20px 40px',
        }}
      >
        Reset
      </button>
      {data.map((d, index) => (
        <div
          key={index}
          style={{
            backgroundColor: 'white',
            width: 220,
            cursor: 'pointer',
            textAlign: 'center',
          }}
          onClick={d.onClick}
        >
          <img src={d.imageSrc} alt={d.label} style={{ height: '100px' }} />
          <div style={{ fontWeight: d.isActive ? 'bold' : 'normal' }}>
            {d.label}
          </div>
        </div>
      ))}
    </div>
  )
}

export default SideBar
