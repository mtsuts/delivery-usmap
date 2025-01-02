import React from 'react'
import * as topojson from 'topojson-client'
import './App.css'
import UsMap from './vizualization/Map'
import { AppContext } from './components/AppContext'
import jsonData from './data/data.json'
import mapjson from './data/map.json'
import { geocoding, dayDiff, getProjection } from './utils'
import { Data } from './types'

function App() {
  const { data, setData } = React.useContext(AppContext) as Data

  // Topojson to geojson
  const stateJson = topojson.feature(
    mapjson as any,
    (mapjson as any).objects.states
  )
  const countiesJson = topojson.feature(
    mapjson as any,
    (mapjson as any).objects.counties
  )

  React.useEffect(() => {
    // With jsondata, already assigned state and county. No need to geocode.
    ;(async () => {
      const data = jsonData
      setData(data)
    })()
  }, [])

  return (
    <>
      <UsMap
        data={data}
        container='us-map'
        stateJson={stateJson}
        countiesJson={countiesJson}
        mobileHeight={350}
        desktopHeight={650}
        color={['#33E48E', '#00A356']}
      ></UsMap>
    </>
  )
}

export default App
