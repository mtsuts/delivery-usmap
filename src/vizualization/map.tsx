import * as React from 'react'
import { AppContext } from '../components/AppContext'
import SideBar from '../components/SideBar'
import stateView from '../images/stateView.png'
import countiesViewImage from '../images/countiesView.png'
import zipCodeViewImage from '../images/zipCodeViews.png'
import transitViewImage from '../images/TransitView.png'
import MapViz from './MapViz'
import { MapProps, Data } from '../types'
import ZoomButtons from '../components/ZoomButtons'

function UsMap(params: MapProps) {
  const [view, setView] = React.useState<'states' | 'counties' | 'zipcodes' | 'transit'>(
    'states'
  )
  const { data, setData } = React.useContext(AppContext) as Data
  const isMobile = window.innerWidth < 768

  const map = React.useRef(null)

  // Side bar buttons data
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
    {
      label: 'Transit View',
      imageSrc: transitViewImage,
      position: 250,
      onClick: () => {
        setView('transit')
      },
      isActive: view === 'transit',
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
        padding: '0 80px',
      }}
    >
      <SideBar data={sideBarData}/>
      <div style={{ flexGrow: 1, marginTop: '40px', position: 'relative' }}>
        <div id={params.container}></div>
        <div style={{ position: 'absolute', left: -20, top: -20 }}>
          <ZoomButtons view={view} />
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
        <div style={{ position: 'absolute', width: 40, right: 80, bottom: 20 }}>
          <ZoomButtons view={view} />
        </div>
        <div id={params.container}></div>
      </div>

      <SideBar data={sideBarData} />
    </div>
  )
}

export default UsMap
