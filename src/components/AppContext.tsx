import React from 'react'

export const AppContext = React.createContext({})

export const AppProvider = ({ children }) => {
  const [data, setData] = React.useState([])

  return (
    <AppContext.Provider value={{ data, setData }}>
      {children}
    </AppContext.Provider>
  )
}
