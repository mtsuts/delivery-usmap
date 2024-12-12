import React from 'react'
import scanned from '../images/scanned.png'

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
    fontSize: '10px',
    color: '#fff',
  }

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      <div> Delivery %</div>
      <div style={gradientStyle}></div>
      <div>
        <div style={{ marginTop: '20px' }}> Not Scanned 100% </div>
        <img src={scanned} style={{ height: '20px',  marginTop: '5px' }} />
      </div>
    </div>
  )
}

export default LegendBar
