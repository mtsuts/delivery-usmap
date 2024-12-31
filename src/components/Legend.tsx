import React from 'react'

const LegendBar = ({
  color1 = '#db3834',
  color2 = '#e43f2f',
  color3 = '#f3b701',
  color4 = '#5ca63d',
  color5 = '#0b9d56',
  height = '10px',
  notScanned = false,
  title = 'Delivery %',
}) => {
  const gradientStyle = {
    background: `linear-gradient(45deg, ${color1} 0%, ${color2} 25%, ${color3} 50%, ${color4} 75%, ${color5} 100%)`,
    height: height,
    borderRadius: '10px',
    width: '180px',
    position: 'relative' as 'relative',
  }

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      <div> {title}</div>
      <div style={gradientStyle}></div>
      <div> Scanned %</div>
    </div>
  )
}

export default LegendBar
