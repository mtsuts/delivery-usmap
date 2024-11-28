import * as d3 from 'd3'
import tippy from 'tippy.js'

// Draw Counties
function drawCounties(counties: [], g: any, path: any) {
  // Remove existing counties, if any
  g.selectAll('.county').remove()

  // tippy instance
  let tippyInstance: any
  // projection
  var projection = d3.geoAlbers().scale(1280)

  const latitude = 37.566932805711126
  const longitude = -121.874156346511


  // Draw counties as paths
  g.selectAll('.county')
    .data(counties)
    .join('path')
    .attr('class', 'county')
    .attr('d', path)
    .attr('fill', '#ccc')
    .attr('stroke', '#333')
    .attr('stroke-width', 0.5)

  // Add a circle at the projected point
  const projectedCoords = projection([longitude, latitude])
  const another = projection([-120.84792, 34.0983])

  if (projectedCoords) {
    // Ensure the point is within the projection's bounds
    g.append('circle')
      .attr('cx', projectedCoords[0])
      .attr('cy', projectedCoords[1])
      .attr('r', 15)
      .attr('fill', 'transparent')
      .attr('stroke', '#01579b')
      .attr('stroke-width', 1.5)
      .style('cursor', 'pointer')
      .on('mouseover', (event: any) => {
        if (tippyInstance) {
          tippyInstance.destroy()
        }
        tippyInstance = tippy(event.target, {
          allowHTML: true,
          content: `<div> Info </div>`,
          arrow: false,
          theme: 'light',
          placement: 'top',
        })
      })
  }

  if (another) {
    // Ensure the point is within the projection's bounds
    g.append('circle')
      .attr('cx', another[0])
      .attr('cy', another[1])
      .attr('r', 8)
      .attr('fill', 'transparent')
      .attr('stroke', '#01579b')
      .attr('stroke-width', 1.5)
      .style('cursor', 'pointer')
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
  const state = data?.features[0]?.properties?.context?.region?.name || ''
  return state
}

export { drawCounties, geocode }
