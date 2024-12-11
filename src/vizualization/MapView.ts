import * as d3 from 'd3'
import { StateLevelTooltip } from '../components/Tooltips'
import { stateLevelData } from '../data/data'

// Path generator
const path = d3.geoPath()

// State level tippy instance
let tippyInstanceState: any

// Draw state level map
function MapView(
  pathData: any,
  g: any,
  clicked: Function,
  view: string,
  data: any,
  svg: any
) {
  const aggregate = stateLevelData(null, data)

  const colorScales = d3
    .scaleLinear<string>()
    .domain(d3.extent(aggregate, (d: any) => d?.deliveryPrc) as any)
    .range(['#FF0000', '#00D06C'] as [string, string])

  // Define the diagonal line pattern
  const defs = svg.append('defs') // Assuming svg is your main SVG container

  defs
    .append('pattern')
    .attr('id', 'diagonal-lines')
    .attr('patternUnits', 'userSpaceOnUse')
    .attr('width', 10)
    .attr('height', 10)
    .append('line')
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', 10)
    .attr('y2', 10)
    .attr('stroke', 'red') // Color of the lines
    .attr('stroke-width', 2) // Thickness of the lines

  // Draw state paths
  g.selectAll('path')
    .data(pathData)
    .join('path')
    .attr('class', 'path')
    .attr('d', path)
    .attr('fill', (d: any) => {
      if (view === 'states') {
        // Use the color scale for normal fill
        return (
          colorScales(
            aggregate.find((x:any) => x.state === d.properties.name)?.deliveryPrc
          ) || '#f3f3f3'
        )
      } else {
        // Use diagonal line pattern for other views
        return 'url(#diagonal-lines)'
      }
    })
    .attr('stroke', '#fff')
    .attr('stroke-width', 0.5)
    .style('cursor', 'pointer')
    .on('click', (event: any, d: any) => {
      if (view === 'counties' || view === 'zipcodes') return
      clicked(event, d)
    })
    .on('mouseover', function (event: any, d: any) {
      if (view === 'states') {
        const stateData = stateLevelData(d.properties.name, data)
        if (tippyInstanceState) {
          tippyInstanceState.destroy()
        }
        tippyInstanceState = StateLevelTooltip(event, d, stateData)
      }
    })
    .on('mouseout', function (event: any, d: any) {})

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
    .style('font-size', '17px')
    .attr('fill', view === 'states' ? '#fff' : '#000')
    .attr('stroke-width', 0.2)
}

export { MapView }
