import * as d3 from 'd3'
import { StateLevelTooltip } from './Tooltips'
import { stateLevelData } from '../data/data'

// Path generator
const path = d3.geoPath()

// State level tippy instance
let tippyInstanceState: any

// Draw state level map
function StateLevelMap(
  pathData: any,
  g: any,
  IdmapDataState: any,
  clicked: Function,
  colorScale: Function,
  view: string,
  data: any
) {
  // Draw state paths
  g.selectAll('path')
    .data(pathData)
    .join('path')
    .attr('class', 'path')
    .attr('d', path)
    .attr('fill', '#c93235')
    .attr('stroke', 'white')
    .attr('stroke-width', 0.5)
    .style('cursor', 'pointer')
    .on('click', clicked)
    .on('mouseover', (event: any, d: any) => {
      if (view === 'states') {
        const stateData = stateLevelData(d, data)
        if (tippyInstanceState) {
          tippyInstanceState.destroy()
        }
        tippyInstanceState = StateLevelTooltip(event, d, stateData)
      } else {
        console.log('No Tooltip')
      }
    })

  // Append text elements on state paths
  g.selectAll('text')
    .data(pathData)
    .join('text')
    .attr('class', 'path-label')
    .attr('x', (d: any) => {
      const centroid = path.centroid(d)
      return centroid[0]
    })
    .attr('y', (d: any) => {
      const centroid = path.centroid(d)
      return centroid[1]
    })
    .attr('text-anchor', 'middle')
    .attr('dx', '0.2em')
    .attr('dy', '0.35em')
    .text((d: any) => d.properties.code)
    .style('font-size', '15px')
    .attr('fill', '#e1f5fe')
    .style('font-weight', 'bold')
}

export { StateLevelMap }
