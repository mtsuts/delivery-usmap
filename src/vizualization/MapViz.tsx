import React from 'react'
import * as d3 from 'd3'
import { MapVizProps } from './types'
import { CountyLevelTooltip, ZipCodeLevelTooltip } from './Tooltips'
import { StateLevelMap } from './MapLevels'
import { countyLevelData } from '../data/data'

function MapViz({
  mainContainer,
  stateJson,
  countiesJson,
  data,
  IdmapDataState,
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

  let transform = d3.zoomIdentity
  // Initial zoom
  const zoom = d3.zoom().scaleExtent([1, 8]).on('zoom', zoomed)

  // SVG container
  const svg = container
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', '0 0 975 710')
  // .on('click', reset)

  // Group element
  const g = svg.append('g')

  // Path generator
  const path = d3.geoPath()

  // State color scale of the map
  const colorScale = d3
    .scaleLog<string>()
    .domain(d3.extent(data, (d) => d.value) as [number, number])
    .range(color)

  // Tippy instance for county level
  let tippyInstanceCountyLevel: any

  // Draw circles for county level
  function drawCountyLevelCircles(circlesData: any, g: any) {
    if (!circlesData) return
    g.selectAll('.circle').remove()

    const colorScale = d3
      .scaleLog<string>()
      .domain(d3.extent(data, (d: any) => d.value) as [number, number])
      .range(color)

    // Circle Radius Scale
    const radiusScale = d3
      .scaleLog()
      .domain([
        d3.min(circlesData, (d: any) => Number(d.aggreagteValue)),
        d3.max(circlesData, (d: any) => Number(d.aggreagteValue)),
      ])
      .range([5, 20])

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
          if (d.aggreagteValue === 1) return
          drawZipCodeLevelCircles(zipCodeLevelData, g)
          const zipCodeData = countiesJson.features.filter(
            (x: any) => x.id === d.countyId
          )

          zoomToCounty(event.target, zipCodeData[0])
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
      .scaleLog()
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
        .attr('r', (d: any) => radiusScale(d.value) / transform.k)
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
        .on('mouseover', (event: any, d: any) => {
          if (d.length === 0) return
          ZipCodeLevelTooltip(event, d)
        })
    }
  }

  // Draw state counties on state path click
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

  // Draw map, based on view
  function updateView(view: 'states' | 'counties') {
    if (view === 'states') {
      StateLevelMap(
        stateJson.features,
        g,
        IdmapDataState,
        clicked,
        colorScale,
        view,
        data
      )
      drawCountyLevelCircles([], g)
    } else if (view === 'counties') {
      StateLevelMap(
        countiesJson.features,
        g,
        IdmapDataState,
        clicked,
        colorScale,
        view,
        data
      )
      drawCountyLevelCircles(countyLevelData(null, data), g)
    }
  }

  // Zoom reset
  function reset() {
    svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity)
    StateLevelMap(
      view === 'states' ? stateJson.features : countiesJson.features,
      g,
      IdmapDataState,
      clicked,
      colorScale,
      view,
      data
    )
    if (view !== 'states') {
      drawCountyLevelCircles(data, g)
    } else {
      drawCountyLevelCircles([], g)
    }
  }

  // Handle click zoom
  function zoomToCounty(event: any, d: any) {
    const [[x0, y0], [x1, y1]] = path.bounds(d)
    const scale = Math.min(12, 0.9 / Math.max((x1 - x0) / 975, (y1 - y0) / 710))
    console.log(scale)
    const translateX = 975 / 2 - (scale * (x0 + x1)) / 2
    const translateY = 710 / 2 - (scale * (y0 + y1)) / 2

    // event.stopPropagation()
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
    drawStateCounties(filteredCounties, g, path)
    drawCountyLevelCircles(countyLevelData(d.id, data), g)
  }

  // Zoom event
  function zoomed(event: any) {
    g.attr('transform', event.transform).on('wheel', null)
    transform = event.transform
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
