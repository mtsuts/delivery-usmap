import React from 'react'
import * as d3 from 'd3'
import * as topojson from 'topojson-client'
import './App.css'
import UsMap from './vizualization/Map'
import { AppContext } from './components/AppContext'
import csvData from './data/data.csv'
import mapjson from './data/map.json'
import { geocode, dayDiff, getProjection } from './utils'
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

  // State ids
  const ids = (stateJson as any).features.map((d: any) => {
    return {
      id: d.id,
      state: d.properties.name,
    }
  })
  //County ids
  const countiesIds = (countiesJson as any).features.map((d: any) => {
    return {
      id: d.id,
      county: d.properties.name,
      state: ids.find((x: any) => x.id === d.id.slice(0, 2))?.state,
    }
  })

  React.useEffect(() => {
    d3.csv(csvData)
      .then(async (data) => {
        const updatedData = await Promise.all(
          data.map(async (d) => {
            return {
              ...d,
              delivery_date: d.delivery_date.replace(/\[|\]/g, ''),
              mailing_date: d.mailing_date,
              scanned: Number(d.scanned),
              allPieces: Number(d['distinct_job_imb_count']),
              status:
                new Date(d.delivery_date.replace(/\[|\]/g, '')) < new Date()
                  ? 'Delivered'
                  : 'in-Transit',
              state: (await geocode(d.longitude, d.latitude))?.stateData,
              county: (
                await geocode(d.longitude, d.latitude)
              )?.countyData.replace(' County', ''),
              x: getProjection(d.longitude, d.latitude).x,
              y: getProjection(d.longitude, d.latitude).y,
            }
          })
        )
        const vizData = updatedData.map((d) => ({
          ...d,
          notScannedPrc: ((d.allPieces - d.scanned) / d.allPieces) * 100,
          scannedPrc: Math.floor((d.scanned / d.allPieces) * 100),
          delivered: d.status === 'Delivered' ? d.scanned : 0,
          inTransit: d.status === 'in-Transit' ? d.scanned : 0,
          delivery_speed: dayDiff(d.delivery_date, d.mailing_date),
          id: ids.find((id: any) => id.state === d.state)?.id || '0',
          countyId: countiesIds
            .filter((x: any) => x.state === d.state)
            .find((x: any) => x.county === d.county)?.id,
        }))
        setData(vizData)
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
        mobileHeight={300}
        desktopHeight={700}
        color={['#33E48E', '#00A356']}
      ></UsMap>
    </>
  )
}

export default App
