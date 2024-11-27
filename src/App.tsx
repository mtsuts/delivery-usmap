import React from 'react'
import * as d3 from 'd3'
import './App.css'
import { useEffect } from 'react'
import UsMap from './vizualization/Map'
import mapjson from './data/map.json'
import { AppContext } from './components/AppContext'

interface Data {
  data: []
  setData: Function
}

function App() {
  const { data, setData } = React.useContext(AppContext) as Data

  const dat = Array.from({ length: 60 })
    .fill(0)
    .map((_, i) => ({
      id: (i + 1).toString().padStart(2, '0'),
      value: Math.round(Math.random() * 100),
    }))

  useEffect(() => {
    d3.csv('./data.csv')
      .then((data) => {
        setData(data)
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
        topojsons={mapjson}
        data={dat}
        mobileHeight={400}
        desktopHeight={800}
        color={['#f1c40f', '#e67e22', '#e74c3c']}
      ></UsMap>
    </>
  )
}

export default App
