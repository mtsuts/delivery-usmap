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
  const aggregate = stateLevelData(null, data)
  function getStateColor(state: any) {
    const foundState = aggregate.find((x: any) => x.state === state)
    if (foundState === undefined) return
    if (foundState.deliveryPrc > 50) {
      return '#006CD0'
    } else if (foundState.deliveryPrc <= 50) {
      return '#c93235'
    }
  }
  getStateColor('California')

  // Draw state paths
  g.selectAll('path')
    .data(pathData)
    .join('path')
    .attr('class', 'path')
    .attr('d', path)
    .attr('fill', (d: any) =>
      view === 'states' ? getStateColor(d.properties.name) || '#f3f3f3' : '#f3f3f3'
    )
    .attr('stroke', '#fff')
    .attr('stroke-width', 0.5)
    .style('cursor', 'pointer')
    .on('click', clicked)
    .on('mouseover', function (event: any, d: any) {
      if (view === 'states') {
        const stateData = stateLevelData(d.properties.name, data)
        if (tippyInstanceState) {
          tippyInstanceState.destroy()
        }
        tippyInstanceState = StateLevelTooltip(event, d, stateData)
      } else {
        console.log('No Tooltip')
      }
    }).on('mouseout', function(event: any, d:any){
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
    .attr('fill', '#fff')
    .style('font-weight', 'bold')
}

export { StateLevelMap }