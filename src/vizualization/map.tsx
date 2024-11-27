import * as React from 'react'
import * as d3 from 'd3'
import * as topojson from 'topojson-client'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/themes/light.css'
import { drawCounties } from './HelperFunctions'
import { useEffect } from 'react'

interface MapProps {
  params: { container: string } // Container ID for the SVG
  topojsons: any
  data: { id: string; value: number }[] // Data to map
  mobileHeight: number // Height for mobile devices
  desktopHeight: number // Height for desktops
  color: string[] // Array of colors for the color scale
}

function UsMap({
  params,
  topojsons,
  data,
  mobileHeight,
  desktopHeight,
  color,
}: MapProps) {
  useEffect(() => {
    const container = d3.select(`#${params.container}`)
    container.selectAll('*').remove()

    if (!topojsons || !data) return

    const stateJson: any = topojson.feature(topojsons, topojsons.objects.states)
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

    const g = svg.append('g')

    // Create a path generator
    const path = d3.geoPath()

    // tippy instance
    let tippyInstance: any

    // Create color scale
    const maxDataValue = d3.max(data, (d) => d.value) || 0
    const colorScale = d3
      .scaleQuantize<string>()
      .domain([0, maxDataValue])
      .range(color)

    // Map data to stateJson
    const mapData = new Map(data.map((d) => [d.id, d.value]))
    // Draw map regions

    const states = g
      .selectAll('path')
      .data(stateJson.features)
      .join('path')
      .attr('class', 'path')
      .attr('fill', (d) => colorScale(mapData.get((d as any).id)))
      .attr('stroke', 'black')
      .attr('stroke-width', 0.5)
      .style('cursor', 'pointer')
      .on('mouseover', (event, d: any) => {
        if (tippyInstance) {
          tippyInstance.destroy()
        }
        tippyInstance = tippy(event.target, {
          content: d.properties?.name,
          arrow: false,
          theme: 'light',
          placement: 'top',
        })
      })
      .on('click', clicked)
      .attr('d', path)

    svg.call(zoom)

    // Zoom event

    function reset() {
      states.transition().style('fill', null)
      svg
        .transition()
        .duration(750)
        .call(
          zoom.transform,
          d3.zoomIdentity,
          d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
        )
    }

    function clicked(event, d) {
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
      const countiesGeoJSON: any = topojson.feature(
        topojsons,
        topojsons.objects.counties
      )
      const stateId = d.id
      const filteredCounties = countiesGeoJSON.features.filter(
        (county: any) => county.id.slice(0, 2) === stateId
      )
      console.log(filteredCounties)
      // Draw counties
      drawCounties(filteredCounties, g, path)
    }

    function zoomed(event) {
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
  }, [params.container, topojsons, data, mobileHeight, desktopHeight, color])

  return <div id={params.container}></div>
}

export default UsMap
