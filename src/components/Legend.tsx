import React from 'react'

const LegendBar = ({
  startColor = '#FF0000',
  endColor = '#00D06C',
  height = '20px',
}) => {
  const gradientStyle = {
    background: `linear-gradient(90deg, ${startColor} 0%, ${endColor} 100%)`,
    height: height,
    borderRadius: '10px',
    width: '170px',
    position: 'relative' as 'relative',
  }

  const labelStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '12px',
    color: '#fff',
  }

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      <div> Delivery %</div>
      <div style={gradientStyle}>
        <div style={{ ...labelStyle, left: '2%' }}>0%</div>
        <div style={{ ...labelStyle, right: '2%' }}>100%</div>
      </div>
    </div>
  )
}

export default LegendBar
