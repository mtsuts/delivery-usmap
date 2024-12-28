import React from 'react'
import LegendBar from './Legend'

function ScannedLegendBar() {
  return (
    <LegendBar
      startColor={'#FF0000'}
      endColor={'#006CD0'}
      height={'10px'}
      notScanned={true}
      title='Scanned %'
    />
  )
}

export default ScannedLegendBar
