import dayjs from 'dayjs'
import * as d3 from 'd3'

const apiKey = process.env.REACT_APP_GOOGLE_API_KEY

// Google api geocoding
async function geocoding(long: string, lat: string) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${apiKey}`
  if (!lat || !long) return
  const response = await fetch(url)
  const data = await response.json()
  const addressComponent = data.results[0]?.address_components || []
  let state = null
  let county = null
  addressComponent.forEach((component: any) => {
    if (component.types.includes('administrative_area_level_1')) {
      state = component.long_name
    } else if (component.types.includes('administrative_area_level_2')) {
      county = component.long_name.replace(' County', '')
    }
  })
  return { state, county }
}

// Day difference
function dayDiff(date1: string, date2: string) {
  const date1Obj = dayjs(date1)
  const date2Obj = dayjs(date2)
  return date1Obj.diff(date2Obj, 'day') || 0
}

// Projection
function getProjection(long: string, lat: string) {
  const projection = d3.geoAlbersUsa().scale(1300).translate([487.5, 305])
  const x =
    long && lat ? (projection([Number(long), Number(lat)]) || [0, 0])[0] : 0
  const y =
    long && lat ? (projection([Number(long), Number(lat)]) || [0, 0])[1] : 0
  return { x, y }
}

// Format number to 2 decimal places
const formatNumber = d3.format('.1f')

// Get tooltip placement
function getTooltipPlacement(xcoordinate: number, ycoordinate: number) {
  if (xcoordinate > 450) {
    if (ycoordinate > 400) {
      return 'top-end'
    } else {
      return 'bottom-end'
    }
  } else {
    if (ycoordinate > 400) {
      return 'top-start'
    } else {
      return 'bottom-start'
    }
  }
}

// Scanned color scale
const scannedColorScale = d3
  .scaleLinear<string>()
  .domain([0, 100] as [number, number])
  .range(['#FF0000', '#006CD0'] as [string, string])

// State and circle color scale
const colorScale = d3
  .scaleLinear()
  .domain([0, 10, 30, 80, 100] as [any, any, any, any, any])
  .range(['#db3834', '#e43f2f', '#f3b701', '#5ca63d', '#0b9d56'] as [
    any,
    any,
    any,
    any,
    any
  ])

export {
  dayDiff,
  getProjection,
  geocoding,
  formatNumber,
  getTooltipPlacement,
  scannedColorScale,
  colorScale
}
