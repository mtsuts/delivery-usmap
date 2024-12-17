import React from 'react'
import * as d3 from 'd3'
import { MapVizProps } from '../types'
import { MapView } from './MapView'
import { countyLevelData } from '../data/data'
import drawTransitArrows from './TransitArrows'
import { drawZipCodeLevelCircles, drawCountyLevelCircles } from './LevelCircles'

function MapViz({
  mainContainer,
  stateJson,
  countiesJson,
  data,
  mobileHeight,
  desktopHeight,
  color,
  view,
}: MapVizProps) {
  const container = d3.select(`#${mainContainer}`)
  container.selectAll('*').remove()

  // State id
  let stateId: string = ''

  if (!stateJson || !data.length) return

  // Map dimensions for devices
  const isMobile = window.innerWidth < 768
  const width =
    (container.node() as HTMLElement)?.getBoundingClientRect().width || 800
  const height = isMobile
    ? mobileHeight
    : window.innerWidth < 1500
    ? desktopHeight
    : 1500

  // Zoom scale and transform variables
  const scaleExtent = [1, 12] as [number, number]
  let currentZoom = 1
  let zoomDiff = 0.5
  let eventAction: any
  let dm: any
  let zoomState = {
    previous: {
      translateX: 0,
      translateY: 0,
      scale: 1,
    },
    current: {
      translateX: 0,
      translateY: 0,
      scale: 1,
    },
  }

  // Initial zoom
  let transform = d3.zoomIdentity
  const zoom = d3.zoom().scaleExtent(scaleExtent).on('zoom', zoomed)

  // SVG container
  const svg = container
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', '0 0 975 710')

  // Group element
  const g = svg.append('g')
  // Path generator
  const path = d3.geoPath()

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
      MapView(stateJson.features, g, clicked, view, data)
      drawCountyLevelCircles(
        [],
        g,
        false,
        data,
        transform,
        zoomToCounty,
        countiesJson, 
        true
      )
    } else if (view === 'counties') {
      MapView(stateJson.features, g, clicked, view, data)
      drawCountyLevelCircles(
        countyLevelData(null, data),
        g,
        true,
        data,
        transform,
        zoomToCounty,
        countiesJson, 
        false
      )
    } else if (view === 'zipcodes') {
      MapView(stateJson.features, g, clicked, view, data)
      drawZipCodeLevelCircles(data, g, false)
    } else if (view === 'transit') {
      MapView(stateJson.features, g, clicked, view, data)
      drawTransitArrows(
        data.filter((d) => d.status === 'in-Transit'),
        g
      )
    }
  }

  // Zoom reset handle
  function reset() {
    if (d3.select('#zoom_reset').style('opacity') === '0.5') return
    svg.transition().duration(600).call(zoom.transform, d3.zoomIdentity)
    if (view === 'states') {
      MapView(stateJson.features, g, clicked, view, data)
    }
  }

  // Handle click event on state path
  function clicked(event: any, d: any) {
    stateId = d.id
    zoomToCounty(event, d)
    eventAction = event
    dm = d
    // Filter counties based on state id
    const filteredCounties = countiesJson.features.filter(
      (county: any) => county.id.slice(0, 2) === d.id
    )
    drawStateCounties(filteredCounties, g, path)
    drawCountyLevelCircles(
      countyLevelData(d.id, data),
      g,
      false,
      data,
      transform,
      zoomToCounty,
      countiesJson, 
      true
    )
  }

  // Handle click zoom
  function zoomToCounty(event: any, d: any) {
    const [[x0, y0], [x1, y1]] = path.bounds(d)
    const scale = Math.min(10, 0.9 / Math.max((x1 - x0) / 975, (y1 - y0) / 710))
    const translateX = 975 / 2 - (scale * (x0 + x1)) / 2
    const translateY = 710 / 2 - (scale * (y0 + y1)) / 2

    // Save the current zoom state to previous
    zoomState.previous = { ...zoomState.current }

    // Update the current zoom state
    zoomState.current = { translateX, translateY, scale }

    svg
      .transition()
      .duration(600)
      .call(
        zoom.transform,
        d3.zoomIdentity.translate(translateX, translateY).scale(scale)
      )
  }

  // Zoom event
  function zoomed(event: any) {
    g.attr('transform', event.transform).on('wheel', null)
    transform = event.transform
    currentZoom = transform.k
  }

  // SVG call zoom and disable it on wheel event
  svg.call(zoom).on('wheel.zoom', null)

  // Zoom reset
  d3.select('#zoom_reset').on('click', reset)

  // Zoom buttons actions
  d3.select('#zoom_in').on('click', () => {
    if (eventAction && dm) {
      zoomToCounty(eventAction, dm)
    }
    const currentTransform = d3.zoomIdentity
      .translate(zoomState.previous.translateX, zoomState.previous.translateY)
      .scale(zoomState.previous.scale)
    if (currentZoom <= 2) {
      if (currentZoom + zoomDiff <= scaleExtent[1]) {
        currentZoom = currentZoom + zoomDiff
      }
      svg.transition().duration(600).call(zoom.scaleTo, currentZoom)
    } else if (currentZoom > 2 && currentZoom < 10) {
      svg.transition().duration(600).call(zoom.scaleTo, 10)
      drawZipCodeLevelCircles(
        data.filter((d: any) => d.id === stateId),
        g,
        true
      )
    }
  })

  // Zoom out
  d3.select('#zoom_out').on('click', () => {
    if (currentZoom === 1) return
    zoomState.current = { ...zoomState.previous }
    const previousTransform = d3.zoomIdentity
      .translate(zoomState.previous.translateX, zoomState.previous.translateY)
      .scale(zoomState.previous.scale)

    if (currentZoom <= 2) {
      if (currentZoom + zoomDiff >= scaleExtent[0]) {
        currentZoom = currentZoom - zoomDiff
      }
      svg.transition().duration(600).call(zoom.scaleTo, currentZoom)
    }

    if (currentZoom < 12 && currentZoom >= 10) {
      svg.transition().duration(600).call(zoom.transform, previousTransform)
      drawCountyLevelCircles(
        countyLevelData(stateId, data),
        g,
        false,
        data,
        transform,
        zoomToCounty,
        countiesJson, 
        true
      )
    }
    if (currentZoom > 2 && currentZoom < 10) {
      svg.transition().duration(600).call(zoom.transform, d3.zoomIdentity)
      MapView(stateJson.features, g, clicked, view, data)
      drawCountyLevelCircles(
        [],
        g,
        true,
        data,
        transform,
        zoomToCounty,
        countiesJson, 
        true
      )
    }
  })

  // Draw initial map
  updateView('states')

  return {
    updateView,
  }
}

export default MapViz
