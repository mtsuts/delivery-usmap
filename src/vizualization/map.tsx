import * as React from 'react'
import * as d3 from 'd3'
import SideBar from './SideBar'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/themes/light.css'
import countiesViewImage from '../images/countiesView.png'
import stateView from '../images/stateView.png'

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
  ]

  React.useEffect(() => {
    const container = d3.select(`#${params.container}`)
    container.selectAll('*').remove()

    if (!stateJson || !data) return

    const isMobile = window.innerWidth < 768
    const width = (container.node() as HTMLElement)?.clientWidth || 800
    const height = isMobile ? mobileHeight : desktopHeight

    // Initial zoom
    const zoom = d3.zoom().scaleExtent([1, 8]).on('zoom', zoomed)

    // SVG container
    const svg = container
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', '0 0 975 710')
      .on('click', reset)

    // Group element
    const g = svg.append('g')

    // Path generator
    const path = d3.geoPath()

    // State color scale of the map
    const colorScale = d3
      .scaleLog<string>()
      .domain(d3.extent(data, (d) => d.value) as [number, number])
      .range(color)

    // Rollup data by state id for colorscale
    const mapData = d3.rollup(
      data,
      (d) => d3.sum(d, (x) => x.value),
      (d) => d.id
    )

    // tippy instance
    let tippyInstanceState: any

    // Draw main map
    function drawMap(pathData: any) {
      g.selectAll('path')
        .data(pathData)
        .join('path')
        .attr('class', 'path')
        .attr('d', path)
        .attr('fill', (d: any) => colorScale(mapData.get(d.id)) || '#ccc')
        .attr('stroke', 'white')
        .attr('stroke-width', 0.5)
        .style('cursor', 'pointer')
        .on('click', clicked)
        .on('mouseover', (event: any, d: any) => {
          const stateName = d.properties.name
          const recordsCount = data
            .filter((x) => x.state === d.properties.name)
            .reduce((acc, curr) => acc + curr.value, 0)
          if (recordsCount) {
            if (tippyInstanceState) {
              tippyInstanceState.destroy()
            }
            tippyInstanceState = tippy(event.target, {
              allowHTML: true,
              content: `<div>
            <div style='font-weight: bold; font-size: 18px;'> ${stateName} </div>
            <div style='color: #616161;'> Records Count: ${recordsCount}  </div>
            </div>`,
              arrow: false,
              theme: 'light',
            })
          }
        })

      // Append text elements on state paths
      g.selectAll('text')
        .data(pathData)
        .join('text')
        .attr('class', 'path-label')
        .attr('x', (d: any) => {
          const centroid = path.centroid(d)
          return centroid[0]
        })
        .attr('y', (d: any) => {
          const centroid = path.centroid(d)
          return centroid[1]
        })
        .attr('text-anchor', 'middle')
        .attr('dx', '0.2em')
        .attr('dy', '0.35em')
        .text((d: any) => d.properties.code)
        .style('font-size', '15px')
        .style('fill', '#fff')

      if (view === 'counties') drawCircles(data, g)
    }

    let tippyInstanceCircle: any
    // Draw Circles
    function drawCircles(circlesData: any, g: any) {
      if (!circlesData) return
      g.selectAll('.circle').remove()
      // circle radius scale
      const radiusScale = d3
        .scaleLinear()
        .domain([
          d3.min(circlesData, (d: any) => Number(d.value)),
          d3.max(circlesData, (d: any) => Number(d.value)),
        ])
        .range([10, 25])

      if (circlesData.length) {
        g.selectAll('circle')
          .data(circlesData.filter((d: any) => d.x !== 0 && d.y !== 0))
          .join('circle')
          .attr('class', 'circle')
          .attr('cx', (d: any) => d.x)
          .attr('cy', (d: any) => d.y)
          .attr('r', (d: any) => radiusScale(d.value))
          .attr('fill', '#2596be')
          .style('opacity', 0.5)
          .style('cursor', 'pointer')
          .on('mouseover', (event: any, d: any) => {
            console.log(d)
            if (tippyInstanceCircle) {
              tippyInstanceCircle.destroy()
            }
            tippyInstanceCircle = tippy(event.target, {
              allowHTML: true,
              content: `<div>
              ${d.state}
              </div>`,
              theme: 'light',
            })
          })
      }
    }

    // Draw State Counties
    function drawStateCounties(counties: [], g: any, path: any) {
      g.selectAll('.county').remove()
      const stateId = counties
        .map((d: any) => d.id)[0]
        .slice(0, 2)
        .toString()

      // Draw counties as paths
      g.selectAll('.county')
        .data(counties)
        .join('path')
        .attr('class', 'county')
        .attr('d', path)
        .attr('fill', '#ffffff')
        .attr('stroke', '#ccc')
        .attr('stroke-width', 0.5)
    }

    // Reset Button on sidebar
    container
      .append('button')
      .text('Reset')
      .style('position', 'absolute')
      .style('top', '40px')
      .style('left', '40px')
      .style('z-index', 1000)
      .style('background-color', '#c93235')
      .style('border', 'none')
      .style('border-radius', '5px')
      .style('color', '#fff')
      .style('padding', '10px')
      .style('font-weight', '600')
      .style('cursor', 'pointer')
      .on('click', reset)

    // Zoom reset
    function reset() {
      svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity)
      drawMap(view === 'states' ? stateJson.features : countiesJson.features)
      if (view !== 'states') {
        drawCircles(data, g)
      } else {
        drawCircles([], g)
      }
    }

    // Handle click event on state path
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

    // Zoom event
    function zoomed(event: any) {
      g.attr('transform', event.transform).on('wheel', null)
    }

    // Draw map based on view
    drawMap(view === 'states' ? stateJson.features : countiesJson.features)

    // SVG call zoom and disable it on wheel event
    svg.call(zoom).on('wheel.zoom', null)

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
