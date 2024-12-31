import React from 'react'
import StripeColors from './StripeColors'

function ScannedLegendBar() {
  const lineGradient1 = StripeColors('#db3828', '#B32E2B', '4px', '28px', true)
  const lineGradient2 = StripeColors('#e43f2f', '#B83126', '5px', '28px', false)
  const lineGradient3 = StripeColors('#f3b701', '#C99201', '6px', '28px', false)
  const lineGradient = StripeColors('#82AA2E', '#6A8723', '7px', '28px')
  const lineGradient4 = StripeColors('#5ca63d', '#4A832F', '7.5px', '28px', false)
  const lineGradient5 = StripeColors('#0b9d56', '#097A44', '8px', '28px', false)
  const lineGradient6 = StripeColors(
    '#097A44',
    '#097A44',
    '0px',
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
