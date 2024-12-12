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
  const [isMobile, setIsMobile] = React.useState(false)

  const map = React.useRef(null)

  React.useEffect(() => {
    if (window.innerWidth < 768) {
      setIsMobile(true)
    }
  })

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

  return !isMobile ? (
    <div
      style={{
        display: 'flex',
      }}
    >
      <SideBar data={sideBarData} buttonClick={() => map.current.reset()} />
      <div style={{ flexGrow: 1, marginTop: '40px', position: 'relative' }}>
        <div id={params.container}></div>
        <div style={{ position: 'absolute', right: 100, bottom: 120 }}>
          <ZoomButtons />
        </div>
      </div>
    </div>
  ) : (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ flexGrow: 1, marginTop: '40px', position: 'relative' }}>
        <div id={params.container}></div>
        <div style={{ position: 'absolute', right: 10, bottom: 20 }}>
          <ZoomButtons />
        </div>
      </div>

      <SideBar data={sideBarData} buttonClick={() => map.current.reset()} />
    </div>
  )
}

export default UsMap
