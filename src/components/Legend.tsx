import React from 'react'
import scanned from '../images/scanned.png'

const LegendBar = ({
  startColor = '#db3834',
  endColor = '#0b9d58',
  height = '10px',
  notScanned = false,
  title = 'Delivery %',
}) => {
  const gradientStyle = {
    background: `linear-gradient(45deg, ${startColor} 0%, ${endColor} 100%)`,
    height: height,
    borderRadius: '10px',
    width: '170px',
    position: 'relative' as 'relative',
  }

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      <div> {title}</div>
      <div style={gradientStyle}></div>
      <div>
        {notScanned && (
          <>
            <div style={{ marginTop: '10px' }}> Not Scanned 100% </div>
            <img src={scanned} style={{ height: '10px', marginTop: '5px' }} />
          </>
        )}
      </div>
    </div>
  )
}

export default LegendBar
