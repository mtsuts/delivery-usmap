import React from 'react'
import './App.css'
import UsMap from './vizualization/map'
import mapjson from './data/map.json'

const App: React.FC = ({}) => {
  const data = Array.from({ length: 60 })
    .fill(0)
    .map((_, i) => ({
      id: (i + 1).toString().padStart(2, '0'),
      value: Math.round(Math.random() * 100),
    }))

  return (
    <>
      <UsMap
        params={{ container: 'us-map' }}
        topojsons={mapjson}
        data={data}
        mobileHeight={400}
        desktopHeight={800}
        color={['#f1c40f', '#e67e22', '#e74c3c']}
      ></UsMap>
    </>
  )
}

export default App
