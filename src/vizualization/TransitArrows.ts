import * as d3 from 'd3'
import { ZipCodeLevelTooltip } from '../components/Tooltips'

let tippyInstanceZipCodeLevel: any
function drawTransitArrows(transitData: any, g: any) {
  if (!transitData) return

  // Remove existing arrows
  g.selectAll('.arrow').remove()
  g.selectAll('.circle').remove()

  // Append new arrows if there is transit data
  if (transitData.length) {
    const arrowGroup = g
      .selectAll('.arrow')
      .data(transitData.filter((d: any) => d.x !== 0 && d.y !== 0))
      .join('g')
      .on('mouseover', function (event: any, d: any) {
        if (d.length === 0) return
        d3.select(this).attr('stroke', '#000')
        d3.select(this).style('opacity', 1)
        if (tippyInstanceZipCodeLevel) {
          tippyInstanceZipCodeLevel.destroy()
        }
        tippyInstanceZipCodeLevel = ZipCodeLevelTooltip(event, d)
      })

    arrowGroup
      .attr('class', 'arrow')
      .attr('transform', (d: any) => `translate(${d.x}, ${d.y})`) // Position the arrow based on x and y
      .each(function () {
        // Append the SVG arrow
        d3
          .select(this)
          .append('svg')
          .attr('width', '25px')
          .attr('height', '40px')
          .attr('viewBox', '0 0 24 24')
          .attr('class', 'arrow')
          .attr('fill', 'none')
          .style('cursor', 'pointer')
          .attr('xmlns', 'http://www.w3.org/2000/svg').html(`
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <path d="M6 18L18 6M18 6H9M18 6V15" 
                    stroke="#c93235" 
                    stroke-width="3" 
                    stroke-linecap="round" 
                    stroke-linejoin="round"></path>
            </g>
          `)
      })
  }
}

export default drawTransitArrows
