// Draw Counties
function drawCounties(counties: [], g: any, path: any) {
  // Remove existing counties, if any
  g.selectAll('.county').remove()

  // Draw counties as paths
  g.selectAll('.county')
    .data(counties)
    .join('path')
    .attr('class', 'county')
    .attr('d', path)
    .attr('fill', '#ccc')
    .attr('stroke', '#333')
    .attr('stroke-width', 0.5)
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
