import * as d3 from 'd3'
import tippy from 'tippy.js'

// Draw Counties
function drawStateCounties(counties: [], g: any, path: any) {
  g.selectAll('.county').remove()
  const stateId = counties
    .map((d: any) => d.id)[0]
    .slice(0, 2)
    .toString()

  // draw counties as paths
  g.selectAll('.county')
    .data(counties)
    .join('path')
    .attr('class', 'county')
    .attr('d', path)
    .attr('fill', '#ffffff')
    .attr('stroke', '#ccc')
    .attr('stroke-width', 0.5)
}

// Draw Circles
function drawCircles(circlesData: any, g: any) {
  if(!circlesData) return
  g.selectAll('.circle').remove()
  // circle radius scale
  const radiusScale = d3
    .scaleLinear()
    .domain([
      d3.min(circlesData, (d: any) => Number(d.value)),
      d3.max(circlesData, (d: any) => Number(d.value)),
    ])
    .range([10, 25])

  // tippy instance
  let tippyInstance: any

  if (circlesData.length) {
    // ensure the point is within the projection's bounds
    g.selectAll('circle')
      .data(circlesData)
      .join('circle')
      .attr('class', 'circle')
      .attr('cx', (d: any) => d.x)
      .attr('cy', (d: any) => d.y)
      .attr('r', (d: any) => radiusScale(d.value))
      .attr('fill', '#2596be')
      .style('opacity', 0.5)
      .attr('stroke', '#ff1744')
      .attr('stroke-width', 0.5)
      .style('cursor', 'pointer')
      .on('mouseover', (event: any, d: any) => {
        if (tippyInstance) {
          tippyInstance.destroy()
        }
        tippyInstance = tippy(event.target, {
          allowHTML: true,
          content: `${d.latitude}`,
          arrow: false,
          theme: 'light',
          placement: 'top',
        })
      })
  }
}

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

export { drawStateCounties, drawCircles, geocode }
