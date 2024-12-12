import * as React from 'react'
import { AppContext } from '../components/AppContext'
import SideBar from '../components/SideBar'
import stateView from '../images/stateView.png'
import countiesViewImage from '../images/countiesView.png'
import zipCodeViewImage from '../images/zipCodeViews.png'
import MapViz from './MapViz'
import { MapProps, Data } from '../types'
import ZoomButtons from '../components/ZoomButtons'

function UsMap(params: MapProps) {
  const [view, setView] = React.useState<'states' | 'counties' | 'zipcodes'>(
    'states'
  )
  const { data, setData } = React.useContext(AppContext) as Data

  const map = React.useRef(null)

  const sideBarData = [
    {
      label: 'State View',
      imageSrc: stateView,
      position: 80,
      onClick: () => setView('states'),
      isActive: view === 'states',
    },
    {
      label: 'County View',
      imageSrc: countiesViewImage,
      position: 250,
      onClick: () => {
        setView('counties')
      },
      isActive: view === 'counties',
    },
    {
      label: 'Zip Code View',
      imageSrc: zipCodeViewImage,
      position: 250,
      onClick: () => {
        setView('zipcodes')
      },
      isActive: view === 'zipcodes',
    },
  ]

  React.useEffect(() => {
    if (data.length) {
      map.current = MapViz({
        mainContainer: params.container,
        stateJson: params.stateJson,
        countiesJson: params.countiesJson,
        data: data,
        mobileHeight: params.mobileHeight,
        desktopHeight: params.desktopHeight,
        color: params.color,
        view: view,
      })
    }
  }, [data])

  React.useEffect(() => {
    if (map.current) {
      map.current.updateView(view)
    }
  }, [view])

  return (
    <div
      style={{
        display: 'flex',
      }}
    >
      <SideBar data={sideBarData} buttonClick={() => map.current.reset()} />
      <ZoomButtons />
      <div
        style={{ flexGrow: 1, marginTop: '40px' }}
        id={params.container}
      ></div>
    </div>
  )
}

export default UsMap
