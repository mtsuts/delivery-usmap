import React from 'react'

const LegendBar = () => {
  const percentage = 100

  const redWidth = Math.min(percentage, 50) * 2
  const blueWidth = Math.max(percentage - 50, 0) * 2

  return (
    <div style={{ width: '200px', margin: '5px auto', textAlign: 'center', fontSize: '12px' }}>
      {/* Labels */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '5px',
        }}
      >
        <span>0%</span>
        <span>50%</span>
        <span>100%</span>
      </div>

      {/* Progress bar */}
      <div
        style={{
          width: '100%',
          height: '20px',
          backgroundColor: '#e0e0e0',
          display: 'flex',
        }}
      >
        {/* Red section */}
        <div
          style={{
            width: `${redWidth}px`,
            backgroundColor: '#c93235',
            height: '100%',
          }}
        ></div>
        {/* Blue section */}
        <div
          style={{
            width: `${blueWidth}px`,
            backgroundColor: '#006CD0',
            height: '100%',
          }}
        ></div>
      </div>
    </div>
  )
}

export default LegendBar
