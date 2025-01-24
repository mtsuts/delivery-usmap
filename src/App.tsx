import React from 'react'
import * as topojson from 'topojson-client'
import './App.css'
import Dashboard from './vizualization/Dashboard'
import { AppContext } from './components/AppContext'
import jsonData from './data/data.json'
import mapjson from './data/map.json'
import { AppContextProps, Data } from './types'


function App() {
  const { setData } = React.useContext(AppContext) as AppContextProps
  const { stateJson } = React.useContext(AppContext) as AppContextProps
  const {countiesJson} = React.useContext(AppContext) as AppContextProps

  React.useEffect(() => {
    setData(jsonData)
  }, [jsonData])

  return (
    <>
      <Dashboard
        container='us-map'
        stateJson={stateJson}
        countiesJson={countiesJson}
        mobileHeight={window.innerHeight > 500 ? 350 : 300}
        desktopHeight={650}
        color={['#33E48E', '#00A356']}
      ></Dashboard>
    </>
  )
}

export default App
