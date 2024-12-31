import React from 'react'
import * as d3 from 'd3'
import * as topojson from 'topojson-client'
import './App.css'
import UsMap from './vizualization/Map'
import { AppContext } from './components/AppContext'
import csvData from './data/data.csv'
import jsonData from './data/data.json'
import mapjson from './data/map.json'
import { geocoding, dayDiff, getProjection } from './utils'
import { Data } from './types'
import { formatNumber } from './utils'

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
    // With jsondata, already assigned state and county. No need to geocode.
    ;(async () => {
      const data = jsonData
      const updatedData = await Promise.all(
        data.map(async (d: any) => {
          return {
            ...d,
            delivery_date: d.delivery_date.replace(/\[|\]/g, ''),
            mailing_date: d.mailing_date,
            scanned: Number(d.scanned),
            allPieces: Number(d.all_pieces),
            status:
              new Date(d.delivery_date.replace(/\[|\]/g, '')) < new Date()
                ? 'Delivered'
                : 'in-Transit',
            state: d.state,
            county: d.county,
            // state: (await geocoding(d.longitude, d.latitude))?.state,
            // county: (await geocoding(d.longitude, d.latitude))?.county,
            x: getProjection(d.longitude, d.latitude).x,
            y: getProjection(d.longitude, d.latitude).y,
          }
        })
      )
      const vizData = updatedData.map((d) => ({
        ...d,
        notScannedPrc: ((d.allPieces - d.scanned) / d.allPieces) * 100,
        scannedPrc: Number(formatNumber((d.scanned / d.allPieces) * 100)),
        delivered:
          d.state === 'Utah'
            ? Number(d.scanned)
            : Math.floor(Number(d.scanned) * 0.8),
        inTransit: Number(d.scanned) - Math.floor(Number(d.scanned) * 0.8),
        deliveryPrc:
          d.status === 'Delivered'
            ? Number(formatNumber((Math.floor(Number(d.scanned) * 0.8)/ d.allPieces) * 100))
            : 0,
        transitPrc:
          d.status === 'in-Transit'
            ? Number(formatNumber((Number(d.scanned) - Math.floor(Number(d.scanned) * 0.8) / d.allPieces) * 100))
            : 0,
        delivery_speed: dayDiff(d.delivery_date, d.mailing_date),
        id: ids.find((id: any) => id.state === d.state)?.id || '0',
        countyId: countiesIds
          .filter((x: any) => x.state === d.state)
          .find((x: any) => x.county === d.county)?.id,
      }))
      setData(vizData)
    })()
  }, [])

  console.log(data.filter((d: any) => d.state === 'California'))
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
