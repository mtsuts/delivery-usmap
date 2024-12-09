import React from 'react'
import * as d3 from 'd3'
import { MapVizProps } from './types'
import { StateLevelTooltip, CountyLevelTooltip } from './Tooltips'

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
        if (tippyInstanceState) {
          tippyInstanceState.destroy()
        }
        tippyInstanceState = StateLevelTooltip(event, d, data)
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

  let tippyInstanceCountyLevel: any
  // Draw circles for county level
  function drawCountyLevelCircles(circlesData: any, g: any) {
    if (!circlesData) return
    g.selectAll('.circle').remove()

    // Circle Radius Scale
    const radiusScale = d3
      .scaleLog()
      .domain([
        d3.min(circlesData, (d: any) => Number(d.aggreagteValue)),
        d3.max(circlesData, (d: any) => Number(d.aggreagteValue)),
      ])
      .range([5, 25])

    if (circlesData.length) {
      g.selectAll('circle')
        .data(circlesData.filter((d: any) => d.x !== 0 && d.y !== 0))
        .join('circle')
        .attr('class', 'circle')
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y)
        .attr('r', (d: any) => radiusScale(d.aggreagteValue))
        .attr('fill', '#006CD0')
        .attr('stroke', '#fff')
        .attr('stroke-width', 0.5)
        .style('opacity', 0.5)
        .style('cursor', 'pointer')
        .on('click', (event: any, d: any) => {
          const zipCodeLevelData = data.filter((x) => x.county === d.county)
          event.stopPropagation()
          if (d.aggreagteValue === 1) return
          drawZipCodeLevelCircles(zipCodeLevelData, g)
        })
        .on('mouseover', (event: any, d: any) => {
          if (tippyInstanceCountyLevel) {
            tippyInstanceCountyLevel.destroy()
          }
          tippyInstanceCountyLevel = CountyLevelTooltip(event, d)
        })
    }
  }

  // Draw zip code level circles
  function drawZipCodeLevelCircles(circlesData: any, g: any) {
    if (!circlesData) return
    g.selectAll('.circle').remove()

    // Circle Radius Scale
    const radiusScale = d3
      .scaleLinear()
      .domain([
        d3.min(circlesData, (d: any) => Number(d.value)),
        d3.max(circlesData, (d: any) => Number(d.value)),
      ])
      .range([5, 10])

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
        .on('click', (event: any, d: any) => {
          event.stopPropagation()
        })
        .on('mouseover', (event: any, d: any) => {})
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
      drawCountyLevelCircles([], g)
    } else if (view === 'counties') {
      drawMap(countiesJson.features)
      drawCountyLevelCircles(data, g)
    }
  }

  // Zoom reset
  function reset() {
    svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity)
    drawMap(view === 'states' ? stateJson.features : countiesJson.features)
    if (view !== 'states') {
      drawCountyLevelCircles(data, g)
    } else {
      drawCountyLevelCircles([], g)
    }
  }

  // Handle click zoom
  function zoomToCounty(event: any, d: any) {
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
  }

  // Handle click event on state path
  function clicked(event: any, d: any) {
    zoomToCounty(event, d)

    // Filter counties based on state id
    const filteredCounties = countiesJson.features.filter(
      (county: any) => county.id.slice(0, 2) === d.id
    )
    // Filter data based on state id
    const stateData = data.filter((x) => x.id === d.id)

    // Rollup data based on county name
    const rolledUpDataValue = d3.rollup(
      stateData,
      (group) => d3.sum(group, (d) => d.value),
      (x) => x.county
    )

    const rolledUpDataSpeed = d3.rollup(
      stateData,
      (group) =>
        Math.floor(
          d3.sum(group, (d) => d.delivery_speed) / group.length
        ).toFixed(1),
      (x) => x.county
    )

    //  Generate county level data
    const uniqueCountyData = new Set()
    const countyLevelData = stateData
      .map((d) => {
        return {
          county: d.county,
          aggreagteValue: rolledUpDataValue.get(d.county),
          aggregateAvgSpeed: rolledUpDataSpeed.get(d.county),
          deliveryPrc: Math.floor(
            (stateData.filter((d) => d.status === 'Delivered').length /
              stateData.length) *
              100
          ),
          inTransitPrc: Math.floor(
            (stateData.filter((d) => d.status === 'In Transit').length /
              stateData.length) *
              100
          ),
          x: d.x,
          y: d.y,
        }
      })
      .filter((item) => {
        if (uniqueCountyData.has(item.county)) {
          return false
        }
        uniqueCountyData.add(item.county)
        return true
      })

    drawStateCounties(filteredCounties, g, path)
    drawCountyLevelCircles(countyLevelData, g)
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
