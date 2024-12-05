import React from 'react'
import * as d3 from 'd3'
import * as topojson from 'topojson-client'
import './App.css'
import { useEffect } from 'react'
import UsMap from './vizualization/Map'
import mapjson from './data/map.json'
import { AppContext } from './components/AppContext'
import { geocode } from './vizualization/Utils'
import csvData from './data/data.csv'

interface Data {
  data: []
  setData: Function
}

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

  // Ids
  const ids = (stateJson as any).features.map((d: any) => {
    return {
      id: d.id,
      state: d.properties.name,
    }
  })

  // Projection
  var projection = d3.geoAlbersUsa().scale(1300).translate([487.5, 305])

  useEffect(() => {
    d3.csv(csvData)
      .then(async (data) => {
        const updatedData = await Promise.all(
          data.map(async (d) => {
            return {
              ...d,
              delivery_date: d.delivery_date.replace(/\[|\]/g, ''),
              status:
                new Date(d.delivery_date.replace(/\[|\]/g, '')) < new Date()
                  ? 'In Transit'
                  : 'Delivered',
              state: (await geocode(d.longitude, d.latitude))?.stateData,
              county: (await geocode(d.longitude, d.latitude))?.countyData,
              x:
                d.longitude && d.latitude && projection([Number(d.longitude), Number(d.latitude)])[0],
              y:
                d.longitude && d.latitude && projection([Number(d.longitude), Number(d.latitude)])[1]
            }
          })
        )

        const finalData = updatedData.map((d) => ({
          ...d,
          value: d['distinct_job_imb_count'],
          id: ids.find((id: any) => id.state === d.state)?.id || '0',
        }))
        setData(finalData)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  return (
    <>
      <UsMap
        params={{ container: 'us-map' }}
        stateJson={stateJson}
        countiesJson={countiesJson}
        data={data}
        mobileHeight={400}
        desktopHeight={600}
        color={['#c93235', '#b71c1c']}
      ></UsMap>
    </>
  )
}

export default App
