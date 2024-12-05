import React from 'react'

type SideBarProps = {
  data: {
    position: number
    onClick: () => void
    imageSrc: string
    label: string
    isActive: boolean
  }[],
  // buttonClick: () => void
}

const SideBar = ({ data }: SideBarProps) => {
  return (
    <div>
      {data.map((d, index) => (
        <div
          key={index}
          style={{
            backgroundColor: 'white',
            position: 'absolute',
            top: `${d.position}px`,
            cursor: 'pointer',
            textAlign: 'center',
            marginTop: '20px',
            zIndex: 1000,
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
