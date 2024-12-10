import React from 'react'
import * as d3 from 'd3'
import * as topojson from 'topojson-client'
import './App.css'
import { useEffect } from 'react'
import UsMap from './vizualization/Map'
import mapjson from './data/map.json'
import dayjs from 'dayjs'
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

  const countiesIds = (countiesJson as any).features.map((d: any) => {
    return {
      id: d.id,
      county: d.properties.name,
    }
  })

  // Projection
  const projection = d3.geoAlbersUsa().scale(1300).translate([487.5, 305])
  useEffect(() => {
    d3.csv(csvData)
      .then(async (data) => {
        const updatedData = await Promise.all(
          data.map(async (d) => {
            return {
              ...d,
              delivery_date: d.delivery_date.replace(/\[|\]/g, ''),
              mailing_date: d.mailing_date,
              status:
                new Date(d.delivery_date.replace(/\[|\]/g, '')) < new Date()
                  ? 'Delivered'
                  : 'In Transit',
              state: (await geocode(d.longitude, d.latitude))?.stateData,
              county: (
                await geocode(d.longitude, d.latitude)
              )?.countyData.replace(' County', ''),
              x:
                d.longitude && d.latitude
                  ? (projection([Number(d.longitude), Number(d.latitude)]) || [
                      0, 0,
                    ])[0]
                  : 0,
              y:
                d.longitude && d.latitude
                  ? (projection([Number(d.longitude), Number(d.latitude)]) || [
                      0, 0,
                    ])[1]
                  : 0,
            }
          })
        )

        const finalData = updatedData.map((d) => ({
          ...d,
          value: Number(d['distinct_job_imb_count']),
          delivery_speed:
            dayjs(d.delivery_date).diff(dayjs(d.mailing_date), 'day') || 0,
          id: ids.find((id: any) => id.state === d.state)?.id || '0',
          countyId: countiesIds.find((x: any) => x.county === d.county)?.id,
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
        data={data}
        container='us-map'
        stateJson={stateJson}
        countiesJson={countiesJson}
        mobileHeight={400}
        desktopHeight={700}
        color={['#3388E6', '#006CD0']}
      ></UsMap>
    </>
  )
}

export default App
