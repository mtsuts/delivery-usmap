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
          {/* <img
            src={d.imageSrc}
            alt={d.label}
            style={{ height: '100px', opacity: d.isActive ? 1 : 0.5 }}
          /> */}
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
    </div>
  )
}

export default SideBar
