import React from 'react'
import * as d3 from 'd3'
import * as topojson from 'topojson-client'
import './App.css'
import { useEffect } from 'react'
import UsMap from './vizualization/Map'
import mapjson from './data/map.json'
import { AppContext } from './components/AppContext'
import { geocode } from './vizualization/HelperFunctions'
import csvData from './data/data.csv'

interface Data {
  data: []
  setData: Function
}

function App() {
  const { data, setData } = React.useContext(AppContext) as Data

  // topojson to geojson
  const stateJson = topojson.feature(
    mapjson as any,
    (mapjson as any).objects.states
  )
  const countiesJson = topojson.feature(
    mapjson as any,
    (mapjson as any).objects.counties
  )
  const ids = (stateJson as any).features.map((d: any) => {
    return {
      id: d.id,
      state: d.properties.name,
    }
  })

  const dat = Array.from({ length: 60 })
    .fill(0)
    .map((_, i) => ({
      id: (i + 1).toString().padStart(2, '0'),
      value: Math.round(Math.random() * 100),
    }))

  useEffect(() => {
    d3.csv(csvData)
      .then(async (data) => {
        const updatedData = await Promise.all(
          data.map(async (d) => {
            return {
              ...d,
              state: await geocode(d.longitude, d.latitude),
            }
          })
        )
        const finalData = updatedData.map((d) => ({
          ...d,
          value: d['distinct_job_imb_count'],
          id: ids.find((id: any) => id.state === d.state)?.id,
        }))
        setData(finalData)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  if (data) {
    console.log(data)
  }

  return (
    <>
      <UsMap
        params={{ container: 'us-map' }}
        stateJson={stateJson}
        countiesJson={countiesJson}
        data={data}
        mobileHeight={400}
        desktopHeight={800}
        color={['#f1c40f', '#e67e22', '#e74c3c']}
      ></UsMap>
    </>
  )
}

export default App
