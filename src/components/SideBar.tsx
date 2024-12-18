import React from 'react'
import { SideBarProps } from '../types'
import LegendBar from './Legend'

const SideBar = ({ data }: SideBarProps) => {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    if (window.innerWidth < 768) {
      setIsMobile(true)
    }
  })
  return !isMobile ? (
    <div
      style={{ display: 'flex', flexDirection: 'column', marginTop: '40px' }}
    >
      {data.map((d, index) => (
        <div
          key={index}
          style={{
            backgroundColor: 'white',
            width: 200,
            cursor: 'pointer',
            textAlign: 'center',
          }}
          onClick={d.onClick}
        >
          <img
            src={d.imageSrc}
            alt={d.label}
            style={{
              height: '80px',
              opacity: d.isActive ? 1 : 0.5,
            }}
          />
          <div style={{ fontWeight: d.isActive ? 'bold' : 'normal' }}>
            {d.label}
          </div>
        </div>
      ))}
      <div style={{ marginLeft: '40px', marginTop: '20px' }}>
        <div>
          <LegendBar />
        </div>
      </div>
    </div>
  ) : (
    <>
      <div
        style={{ display: 'flex', alignItems: 'start', marginBottom: '20px' }}
      >
        <div style={{ marginLeft: '20px' }}>
          <div>
            <LegendBar />
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', overflow: 'auto' }}>
        {data.map((d, index) => (
          <div
            key={index}
            style={{
              backgroundColor: 'white',
              width: 200,
              cursor: 'pointer',
              textAlign: 'center',
              marginBottom: '40px'
            }}
            onClick={d.onClick}
          >
            <img
              src={d.imageSrc}
              alt={d.label}
              style={{ height: '100px', opacity: d.isActive ? 1 : 0.5 }}
            />
            <div style={{ fontWeight: d.isActive ? 'bold' : 'normal' }}>
              {d.label}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default SideBar
