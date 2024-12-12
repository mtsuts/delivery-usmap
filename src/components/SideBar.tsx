import React from 'react'
import { SideBarProps } from '../types'
import LegendBar from './Legend'
import ZoomButtons from './ZoomButtons'

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
            width: 220,
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
        <div style={{ fontWeight: 'bold' }}> Legend</div>
        <div style={{ marginTop: '7px' }}>
          <LegendBar />
        </div>
      </div>
    </div>
  )
}

export default SideBar
