import React from 'react'
import * as topojson from 'topojson-client'
import mapjson from '../data/map.json'

export const AppContext = React.createContext({})

export const AppProvider = ({ children }) => {
  const [data, setData] = React.useState([])
  const [stateJson, setStateJson] = React.useState(() =>
    topojson.feature(mapjson as any, (mapjson as any).objects.states)
  )

  const [countiesJson, setCountiesJson] = React.useState(() =>
    topojson.feature(mapjson as any, (mapjson as any).objects.counties)
  )

  return (
    <AppContext.Provider
      value={{
        data,
        setData,
        stateJson,
        setStateJson,
        countiesJson,
        setCountiesJson,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
