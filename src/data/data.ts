import React from 'react'
import { AppContext } from '../components/AppContext'
interface Data {
  data: []
  setData: Function
}
export const useData = () => {
  const { data, setData } = React.useContext(AppContext) as Data
  console.log(data)
}
