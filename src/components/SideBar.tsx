import React from 'react'
import { SideBarProps } from '../types'
import LegendBar from './Legend'

const SideBar = ({ data, buttonClick }: SideBarProps) => {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    if (window.innerWidth < 768) {
      setIsMobile(true)
    }
  })
  return !isMobile ? (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
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
          margin: '40px 40px',
        }}
      >
        Reset
      </button>
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
            style={{ height: '100px', opacity: d.isActive ? 1 : 0.5 }}
          />
          <div style={{ fontWeight: d.isActive ? 'bold' : 'normal' }}>
            {d.label}
          </div>
        </div>
      ))}
      <div style={{ marginLeft: '40px', marginTop: '50px' }}>
        <div>
          <LegendBar />
        </div>
      </div>
    </div>
  ) : (
    <>
      <div style={{ display: 'flex', alignItems: 'start', marginBottom: '20px' }}>
        <button
          onClick={buttonClick}
          style={{
            backgroundColor: '#c93235',
            borderRadius: '5px',
            color: '#fff',
            padding: '10px',
            width: '80px',
            fontWeight: '600',
            zIndex: 1000,
            cursor: 'pointer',
            border: 'none',
            margin: '0px 40px 40px 40px',
          }}
        >
          Reset
        </button>
        <div style={{ marginLeft: '40px'}}>
          <div >
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
