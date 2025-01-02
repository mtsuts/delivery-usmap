import React from 'react'
import StripeColors from './StripeColors'

function ScannedLegendBar() {
  const lineGradient1 = StripeColors('#ffffff', '#db3828', '4px', '28px', true)
  const lineGradient2 = StripeColors('#ffffff', '#e43f2f', '5px', '28px', false)
  const lineGradient3 = StripeColors('#ffffff', '#f3b701', '6px', '28px', false)
  const lineGradient = StripeColors('#ffffff', '#82AA2E', '7px', '28px')
  const lineGradient4 = StripeColors(
    '#ffffff',
    '#5ca63d',
    '7.5px',
    '28px',
    false
  )
  const lineGradient5 = StripeColors('#ffffff', '#0b9d56', '8px', '28px', false)
  const lineGradient6 = StripeColors(
    '#ffffff',
    '#ffffff',
    '9px',
    '12px',
    false,
    true
  )
  return (
    <>
      <div> Scanned %</div>
      <div
        style={{
          width: '100%',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div style={lineGradient1}></div>
        <div style={lineGradient2}> </div>
        <div style={lineGradient3}> </div>
        <div style={lineGradient}></div>
        <div style={lineGradient4}> </div>
        <div style={lineGradient5}> </div>
        <div style={lineGradient6}></div>
        <div> </div>
      </div>
    </>
  )
}

export default ScannedLegendBar
