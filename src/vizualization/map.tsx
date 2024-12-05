import * as React from 'react'
import * as d3 from 'd3'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/themes/light.css'
import { drawStateCounties, drawCircles } from './Utils'
import { useEffect } from 'react'

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
  useEffect(() => {
    const container = d3.select(`#${params.container}`)
    container.selectAll('*').remove()

    if (!stateJson || !data) return

    // Set dimensions based on screen size
    const isMobile = window.innerWidth < 768
    const width = (container.node() as HTMLElement)?.clientWidth || 800
    const height = isMobile ? mobileHeight : desktopHeight

    // Zoom behavior
    const zoom = d3.zoom().scaleExtent([1, 8]).on('zoom', zoomed)

    // Create SVG
    const svg = container
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', '0 0 975 710')
      .on('click', reset)

    // Create zoom buttons
    container
      .append('button')
      .text('Reset')
      .on('click', reset)
      .style('position', 'absolute')
      .style('left', '40px')
      .style('top', '20px')
      .style('z-index', '1000')
      .style('border', 'none')
      .style('padding', '10px')
      .style('border-radius', '10px')
      .style('background-color', '#c93235')
      .style('color', '#ffffff')
      .style('cursor', 'pointer')

    // Create g element
    const g = svg.append('g')

    // Create a path generator
    const path = d3.geoPath()

    // Tippy tooltip instance
    let tippyInstance: any

    // Create color scale
    const colorScale = d3
      .scaleLog<string>()
      .domain(d3.extent(data, (d) => d.value) as [number, number])
      .range(color)

    // Rollup data
    const mapData = d3.rollup(
      data,
      (d) => d3.sum(d, (x) => x.value),
      (d) => d.id
    )

    // Draw State Map
    drawMap(stateJson.features)

    // Svg zoom call
    svg.call(zoom)

    // Draw map
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
        .on('mouseover', (event: any, d: any) => {
          const state = data.filter((state: any) => state.id === d.id)
          const value =
            state
              .map((d: any) => +d.value)
              .reduce((a: any, b: any) => a + b, 0) || 20

          if (value) {
            if (tippyInstance) {
              tippyInstance.destroy()
            }

            tippyInstance = tippy(event.target, {
              allowHTML: true,
              content: `<div>  
                <div class='state-title bold'> ${state[0]?.state || ''} </div>
                <div>  Record Count: ${value || ''} </div>
                </div>`,
              arrow: false,
              theme: 'light',
              placement: 'top',
            })
          }
        })
        .on('click', clicked)
    }

    // Zoom reset
    function reset() {
      svg.transition().style('fill', null)
      svg
        .transition()
        .duration(750)
        .call(
          zoom.transform,
          d3.zoomIdentity,
          d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
        )
      drawMap(stateJson.features)
    }

    // Path click event
    function clicked(event: any, d: any) {
      // Get the bounding box of the state
      const [[x0, y0], [x1, y1]] = path.bounds(d)

      // Calculate the scale to fit the state into the SVG viewport
      const scale = Math.min(
        8,
        0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)
      )

      // Calculate translation values for centering
      const translateX = width / 2 - (scale * (x0 + x1)) / 2
      const translateY = height / 2 - (scale * (y0 + y1)) / 2

      // Prevent propagation of the event
      event.stopPropagation()

      // Apply zoom transformation with animation
      svg
        .transition()
        .duration(750)
        .call(
          zoom.transform,
          d3.zoomIdentity.translate(translateX, translateY).scale(scale)
        )
      // Filter counties by the clicked state
      const stateId = d.id
      const filteredCounties = countiesJson.features.filter(
        (county: any) => county.id.slice(0, 2) === stateId
      )

      // Draw counties and circles on this state
      drawStateCounties(filteredCounties, g, path)
      // drawCircles(data, g)
    }

    // Zoom event
    function zoomed(event: any) {
      const { transform } = event
      g.attr('transform', transform)
      g.attr('stroke-width', 1 / transform.k)
    }

    // Add responsive behavior
    window.addEventListener('resize', () => {
      svg.attr('width', (container.node() as HTMLElement)?.clientWidth || 800)
    })

    // Cleanup on component unmount
    return () => {
      container.selectAll('*').remove()
      window.removeEventListener('resize', () => {})
    }
  }, [
    params.container,
    stateJson,
    countiesJson,
    data,
    mobileHeight,
    desktopHeight,
    color,
  ])

  return <div id={params.container}></div>
}

export default UsMap
