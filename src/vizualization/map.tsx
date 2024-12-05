import * as React from 'react'
import * as d3 from 'd3'
import SideBar from './SideBar'
import { drawStateCounties, drawCircles } from './Utils'
import countiesViewImage from '../images/countiesView.png'

interface MapProps {
  params: { container: string }
  stateJson: any
  countiesJson: any
  data: {
    id: string
    value: number
    location: string
    delivery_date: string
    status: string
    state: string
  }[]
  mobileHeight: number
  desktopHeight: number
  color: string[]
}

function UsMap({
  params,
  stateJson,
  countiesJson,
  data,
  mobileHeight,
  desktopHeight,
  color,
}: MapProps) {
  const [view, setView] = React.useState<'states' | 'counties'>('states')

  const sideBarData = [
    {
      label: 'State View',
      imageSrc: countiesViewImage,
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
  ]

  React.useEffect(() => {
    const container = d3.select(`#${params.container}`)
    container.selectAll('*').remove()

    if (!stateJson || !data) return

    const isMobile = window.innerWidth < 768
    const width = (container.node() as HTMLElement)?.clientWidth || 800
    const height = isMobile ? mobileHeight : desktopHeight

    const zoom = d3.zoom().scaleExtent([1, 8]).on('zoom', zoomed)
    const svg = container
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', '0 0 975 710')
      .on('click', reset)

    const g = svg.append('g')
    const path = d3.geoPath()
    const colorScale = d3
      .scaleLog<string>()
      .domain(d3.extent(data, (d) => d.value) as [number, number])
      .range(color)

    const mapData = d3.rollup(
      data,
      (d) => d3.sum(d, (x) => x.value),
      (d) => d.id
    )

    function drawMap(pathData: any) {
      g.selectAll('path')
        .data(pathData)
        .join('path')
        .attr('class', 'path')
        .attr('d', path)
        .attr('fill', (d: any) => colorScale(mapData.get(d.id)) || '#ccc')
        .attr('stroke', 'white')
        .attr('stroke-width', 0.5)
        .on('click', clicked)

      if (view === 'counties') drawCircles(data, g)
    }

    function reset() {
      svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity)
      drawMap(view === 'states' ? stateJson.features : countiesJson.features)
      if (view !== 'states') drawCircles(data, g)
    }

    function clicked(event: any, d: any) {
      const [[x0, y0], [x1, y1]] = path.bounds(d)
      const scale = Math.min(
        8,
        0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)
      )
      const translateX = width / 2 - (scale * (x0 + x1)) / 2
      const translateY = height / 2 - (scale * (y0 + y1)) / 2

      event.stopPropagation()
      svg
        .transition()
        .duration(750)
        .call(
          zoom.transform,
          d3.zoomIdentity.translate(translateX, translateY).scale(scale)
        )

      const filteredCounties = countiesJson.features.filter(
        (county: any) => county.id.slice(0, 2) === d.id
      )
      const stateData = data.filter((x) => x.id === d.id)

      drawStateCounties(filteredCounties, g, path)
      drawCircles(stateData, g)
    }

    function zoomed(event: any) {
      g.attr('transform', event.transform)
    }

    drawMap(view === 'states' ? stateJson.features : countiesJson.features)
    svg.call(zoom)

    return () => {
      container.selectAll('*').remove()
    }
  }, [
    params.container,
    stateJson,
    countiesJson,
    data,
    color,
    mobileHeight,
    desktopHeight,
    view,
  ])

  return (
    <div>
      <div id={params.container}></div>
      <SideBar data={sideBarData} />
    </div>
  )
}

export default UsMap
