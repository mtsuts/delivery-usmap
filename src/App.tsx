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

  // ids
  const ids = (stateJson as any).features.map((d: any) => {
    return {
      id: d.id,
      state: d.properties.name,
    }
  })

  // projection
  var projection = d3.geoAlbersUsa().scale(1280)

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
              state: await geocode(d.longitude, d.latitude),
              x:
                d.longitude && d.latitude
                  ? projection([Number(d.longitude), Number(d.latitude)])[0]
                  : 0,
              y:
                d.longitude && d.latitude
                  ? projection([Number(d.longitude), Number(d.latitude)])[1]
                  : 0,
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

  return (
    <>
      <UsMap
        params={{ container: 'us-map' }}
        stateJson={stateJson}
        countiesJson={countiesJson}
        data={data}
        mobileHeight={400}
        desktopHeight={800}
        color={['#dc143c', '#b22222', '#8b0000']}
      ></UsMap>
    </>
  )
}

export default App
