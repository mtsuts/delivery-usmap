import * as React from 'react'
import { AppContext } from '../components/AppContext'
import * as d3 from 'd3'
import SideBar from './SideBar'
import countiesViewImage from '../images/countiesView.png'
import stateView from '../images/stateView.png'
import MapViz from './MapViz'
import { MapProps, Data } from './types'
import LegendBar from './Legend'

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
      onClick: () => setView('counties'),
      isActive: view === 'counties',
    },
    {
      label: 'Zip Code View',
      imageSrc: countiesViewImage,
      position: 250,
      onClick: () => setView('zipcodes'),
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
        IdmapDataState: d3.rollup(
          data,
          (d) => d3.sum(d, (x: any) => x.value),
          (d: any) => d.id
        ),
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
    <div>
      <SideBar data={sideBarData} buttonClick={() => map.current.reset()} />
      <div id={params.container}></div>
      <div style={{ marginLeft: '40px', marginBottom: '120px' }}>
        {/* <div style={{ fontWeight: 'bold'}}> Legend</div> */}
        <div>
          <LegendBar />
        </div>
      </div>
    </div>
  )
}

export default UsMap
