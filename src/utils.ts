import dayjs from 'dayjs'
import * as d3 from 'd3'

// Geocoding
async function geocode(longitude: string, latitude: string) {
  const accessToken =
    'pk.eyJ1IjoibXRzdXRzIiwiYSI6ImNtNDA2MnV5bjBkbWwya3E5MmMzazdudXUifQ.Vca4GqSLclPh_YCoohKEVA'
  const url = `https://api.mapbox.com/search/geocode/v6/reverse?longitude=${longitude}&latitude=${latitude}&access_token=${accessToken}`

  if (!longitude || !latitude) return
  const response = await fetch(url)
  const data = await response.json()
  const stateData = data?.features[0]?.properties?.context?.region?.name || ''
  const countyData =
    data?.features[0]?.properties?.context?.district?.name || ''
  return { stateData, countyData }
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
    long && lat ? ((projection([Number(long), Number(lat)]) || [0, 0])[0]) : 0
  const y =
    long && lat ? ((projection([Number(long), Number(lat)]) || [0, 0])[1]) : 0
  return { x, y }
}

export { geocode, dayDiff, getProjection }
