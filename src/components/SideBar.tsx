import React from 'react'
import { SideBarProps } from '../types'
import LegendBar from './Legend'

const SideBar = ({ data, buttonClick }: SideBarProps) => {
  return (
    <div>
      <button
        onClick={buttonClick}
        style={{
          backgroundColor: '#fff',
          borderRadius: '7px',
          borderColor: '#000',
          color: '#000',
          padding: '10px',
          fontWeight: '600',
          zIndex: 1000,
          cursor: 'pointer',
          margin: '20px 40px',
        }}
      >
        Reset
      </button>
      {data.map((d, index) => (
        <button
          key={index}
          style={{
            backgroundColor: 'white',
            width: 220,
            cursor: 'pointer',
            borderRadius: '7px',
            borderColor: '#000',
            // textAlign: 'center',
            marginLeft: '40px',
          }}
          onClick={d.onClick}
        >
          {/* <img
            src={d.imageSrc}
            alt={d.label}
            style={{ height: '100px', opacity: d.isActive ? 1 : 0.5 }}
          /> */}
          <div style={{ fontWeight: d.isActive ? 'bold' : 'normal' }}>
            {d.label}
          </div>
        </button>
      ))}
      <div style={{ marginLeft: '40px' }}>
        <LegendBar />
      </div>
    </div>
  )
}

export default SideBar
