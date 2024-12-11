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
            width: 100,
            padding: '10px 0px',
            cursor: 'pointer',
            borderRadius: '7px',
            marginLeft: '40px',
            border: 'none',
            backgroundColor: d.isActive ? '#004223' : 'transparent',
            color: d.isActive ? '#fff' : '#000',
          }}
          onClick={d.onClick}
        >
          <div
            style={{
              fontWeight: d.isActive ? 'bold' : 'normal',
            }}
          >
            {d.label}
          </div>
        </button>
      ))}
      <div style={{ marginLeft: '40px' }}>
        <LegendBar />
      </div>
      <ZoomButtons />
    </div>
  )
}

export default SideBar
