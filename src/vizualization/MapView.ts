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
  data: any
) {
  g.selectAll('g').remove()
  g.selectAll('.circle').remove()
  g.selectAll('.arrow').remove()
  const aggregate = stateLevelData(null, data)

  const colorScales = d3
    .scaleLinear<string>()
    .domain(d3.extent(aggregate, (d: any) => d?.deliveryPrc) as any)
    .range(['#FF0000', '#00D06C'] as [string, string])

  // Draw Shading pattern
  function drawPattern() {
    const strokeColor: string = '#004d40'
    // Define the pattern for diagonal lines
    const defs = g.append('defs')
    defs
      .append('pattern')
      .attr('id', 'diagonal-lines')
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('width', 5)
      .attr('height', 5)
      .attr('patternTransform', 'rotate(45)')
      .append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 0)
      .attr('y2', 10)
      .attr('stroke', strokeColor)
      .attr('stroke-width', 6)

    return 'url(#diagonal-lines)'
  }

  const pathGroup = g
    .selectAll('g')
    .data(pathData)
    .join('g')
    .attr('class', 'path-group')

  // Draw state paths
  pathGroup
    .append('path')
    .attr('d', path)
    .attr('class', 'path')
    .attr('fill', (d: any) => {
      if (view === 'states') {
        return (
          colorScales(
            aggregate.find((x: any) => x.state === d.properties.name)
              ?.deliveryPrc
          ) || '#fff'
        )
      } else {
        return '#fff'
      }
    })
  // Draw pattern for states
  pathGroup
    .append('path')
    .attr('d', path)
    .attr('class', 'path-pattern')
    .attr('stroke', '#fff')
    .attr('stroke-width', 1.5)
    .style('cursor', `${view === 'states' ? 'pointer' : 'default'}`)
    .attr('xcoordinate', (d: any) => {
      const coordinateXonMap =
        data.find((x: any) => x.state === d.properties.name)?.x || 0

      return Math.floor(coordinateXonMap)
    })
    .on('mouseover', function () {
      if (view !== 'states') return
      d3.select(this).attr('stroke', '#000')
      d3.select(this.parentElement).raise()
    })
    .on('mouseout', function (event: any, d: any) {
      if (view !== 'states') return
      d3.select(this).attr('stroke', '#fff')
    })

  pathGroup
    .on('click', (event: any, d: any) => {
      const stateData = aggregate.find(
        (x: any) => x.state === d.properties.name
      )
      if (!stateData) return
      if (view !== 'states') return
      clicked(event, d)
    })
    .on('mouseover', function (event: any, d: any) {
      if (view === 'states') {
        const stateData = aggregate.find(
          (x: any) => x.state === d.properties.name
        )
        if (tippyInstanceState) {
          tippyInstanceState.destroy()
        }
        tippyInstanceState = StateLevelTooltip(event, d, stateData)
      }
    })

    .attr('fill', (d: any) => {
      const stateData = aggregate.find(
        (x: any) => x.state === d.properties.name
      )
      if (stateData && view === 'states') {
        if (stateData?.scannedPrc !== 100) {
          return drawPattern()
        } else {
          return colorScales(stateData?.deliveryPrc)
        }
      } else {
        return '#f3f3f3'
      }
    })

  pathGroup
    .selectAll('text')
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
    .attr('fill', (d: any) => {
      const stateData = aggregate.find(
        (x: any) => x.state === d.properties.name
      )
      return view === 'states' && stateData ? '#fff' : '#000'
    })
    .attr('stroke-width', 0.2)
    .on('click', (event: any, d: any) => {
      event.stopPropagation()
    })
    .on('mouseover', (event: any, d: any) => {
      event.stopPropagation()
    })
}

export { MapView }
