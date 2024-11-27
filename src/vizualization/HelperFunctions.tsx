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

export { drawCounties }
