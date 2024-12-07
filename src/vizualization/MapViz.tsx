import React from 'react'
import * as d3 from 'd3'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/themes/light-border.css'
import 'tippy.js/dist/backdrop.css'
import { createRoot } from 'react-dom/client'

interface MapVizProps {
  mainContainer: string
  stateJson: any
  countiesJson: any
  data: {
    id: string
    value: number
    location: string
    delivery_date: string
    status: string
    state: string
    delivery_speed: number
  }[]
  mapData: Map<string, number>
  mobileHeight: number
  desktopHeight: number
  color: string[]
  view: 'states' | 'counties'
}

function MapViz({
  mainContainer,
  stateJson,
  countiesJson,
  data,
  mapData,
  mobileHeight,
  desktopHeight,
  color,
  view,
}: MapVizProps) {
  const container = d3.select(`#${mainContainer}`)
  container.selectAll('*').remove()

  if (!stateJson || !data.length) return

  const isMobile = window.innerWidth < 768
  const width =
    (container.node() as HTMLElement)?.getBoundingClientRect().width || 800
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
        const stateDeliveries = data.filter(
          (x) => x.state === d.properties.name
        )
        const recordsCount = stateDeliveries.reduce(
          (acc, curr) => acc + curr.value,
          0
        )
        const inTransitPercentage = Math.floor(
          (stateDeliveries.filter((d) => d.status === 'In Transit').length /
            stateDeliveries.length) *
            100
        )
        const deliverCountPercentage = Math.floor(
          (stateDeliveries.filter((d) => d.status === 'Delivered').length /
            stateDeliveries.length) *
            100
        )
    

        const averageDeliverySpeed = (
          stateDeliveries
            .map((x) => x.delivery_speed)
            .reduce((acc, curr) => acc + curr, 0) / stateDeliveries.length
        ).toFixed(1)

        console.log(averageDeliverySpeed)

        const content = (
          <>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
              {stateName}
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>Records</th>
                  <th>Delivered (%)</th>
                  <th>In Transit (%)</th>
                  <th>Avg. Speed</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{recordsCount}</td>
                  <td>{deliverCountPercentage}%</td>
                  <td>{inTransitPercentage}%</td>
                  <td> {averageDeliverySpeed}</td>
                </tr>
              </tbody>
            </table>
          </>
        )
        const container = document.createElement('div')
        createRoot(container).render(content)

        if (recordsCount) {
          if (tippyInstanceState) {
            tippyInstanceState.destroy()
          }
          tippyInstanceState = tippy(event.target, {
            allowHTML: true,
            content: container,
            arrow: false,
            theme: 'light-border',
            placement: 'bottom-start',
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
      .range([5, 15])

    if (circlesData.length) {
      g.selectAll('circle')
        .data(circlesData.filter((d: any) => d.x !== 0 && d.y !== 0))
        .join('circle')
        .attr('class', 'circle')
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y)
        .attr('r', (d: any) => radiusScale(d.value))
        .attr('fill', (d: any) =>
          d.status === 'In Transit' ? '#006CD0' : '#00D06C'
        )
        .attr('stroke', '#fff')
        .attr('stroke-width', 0.5)
        .style('opacity', 0.5)
        .style('cursor', 'pointer')
        .on('mouseover', (event: any, d: any) => {
          if (tippyInstanceCircle) {
            tippyInstanceCircle.destroy()
          }
          const content = (
            <div>
              <div>
                Total piece count: <span className='bold'>{d.value}</span>
              </div>
              <div>
                Zip code:
                <span className='bold'>{d.location.split(',')[0]}</span>
              </div>
              <div className='bold'> {d.status} </div>

              {d.status === 'In Transit' && (
                <div>
                  Delivery Date:
                  <span className='bold'>{d.delivery_date} </span>{' '}
                </div>
              )}
            </div>
          )

          // Create a container to render the React element
          const container = document.createElement('div')
          createRoot(container).render(content)

          tippyInstanceCircle = tippy(event.target, {
            allowHTML: true,
            content: container,
            arrow: false,
            theme: 'light-border',
            placement: 'bottom',
          })
        })
    }
  }

  // Draw State Counties
  function drawStateCounties(counties: [], g: any, path: any) {
    g.selectAll('.county').remove()

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

  // Draw map based on view
  function updateView(view: 'states' | 'counties') {
    if (view === 'states') {
      drawMap(stateJson.features)
      drawCircles([], g)
    } else if (view === 'counties') {
      drawMap(countiesJson.features)
      drawCircles(data, g)
    }
  }

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
    const scale = Math.min(8, 0.9 / Math.max((x1 - x0) / 975, (y1 - y0) / 710))
    const translateX = 975 / 2 - (scale * (x0 + x1)) / 2
    const translateY = 710 / 2 - (scale * (y0 + y1)) / 2

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

  // SVG call zoom and disable it on wheel event
  svg.call(zoom).on('wheel.zoom', null)

  updateView('states')

  return {
    updateView,
    reset,
  }
}

export default MapViz
