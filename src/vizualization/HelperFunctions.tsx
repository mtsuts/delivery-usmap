import * as d3 from 'd3'
import tippy from 'tippy.js'

// draw Counties
function drawCounties(counties: [], g: any, path: any, data: any) {
  g.selectAll('.county').remove()

  const stateId = counties
    .map((d: any) => d.id)[0]
    .slice(0, 2)
    .toString()

  const stateData = data.filter((d: any) => d.id === stateId)
  console.log(stateData)

  // circle radius scale
  const radiusScale = d3
    .scaleLinear()
    .domain([
      d3.min(stateData, (d: any) => Number(d.value)),
      d3.max(stateData, (d: any) => Number(d.value)),
    ])
    .range([5, 15])

  // tippy instance
  let tippyInstance: any

  // draw counties as paths
  g.selectAll('.county')
    .data(counties)
    .join('path')
    .attr('class', 'county')
    .attr('d', path)
    .attr('fill', '#ffffff')
    .attr('stroke', '#ccc')
    .attr('stroke-width', 0.5)

  if (stateData.length) {
    // ensure the point is within the projection's bounds
    g.selectAll('circle')
      .data(stateData)
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
  return stateData
}


export { drawCounties, geocode }
