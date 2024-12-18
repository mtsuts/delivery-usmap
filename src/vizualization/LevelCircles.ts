import * as d3 from 'd3'
import { ZipCodeLevelTooltip, CountyLevelTooltip } from '../components/Tooltips'

// Tippy instance for county level
let tippyInstanceCountyLevel: any
// Draw circles for county level
function drawCountyLevelCircles(
  circlesData: any,
  g: any,
  levelUpdate: boolean = false,
  data: any,
  transform: any,
  zoomToCounty: any,
  countiesJson: any,
  stateLevel: boolean = false
) {
  if (!circlesData) return
  g.selectAll('.circle').remove()

  // Circle Radius Scale
  const radiusScale = d3
    .scaleLog()
    .domain([
      d3.min(circlesData, (d: any) => Number(d.aggregateValue)),
      d3.max(circlesData, (d: any) => Number(d.aggregateValue)),
    ])
    .range(stateLevel ? [5, 10] : [15, 30])

  const colorScales = d3
    .scaleLinear<string>()
    .domain(d3.extent(data, (d: any) => d?.deliveryPrc) as any)
    .range(['#FF0000', '#00D06C'] as [string, string])


  if (circlesData.length) {
    g.selectAll('circle')
      .data(circlesData.filter((d: any) => d.x !== 0 && d.y !== 0))
      .join('circle')
      .attr('class', 'circle')
      .attr('cx', (d: any) => d.x)
      .attr('cy', (d: any) => d.y)
      .attr('r', (d: any) => radiusScale(d.aggregateValue))
      .attr('fill', (d: any) => {
        return colorScales(d.deliveryPrc) || '#ccc'
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 0.5)
      .style('opacity', 0.5)
      .style('cursor', 'pointer')
      .attr('xCoordinate', (d: any) => d.x)
      .on('click', (event: any, county: any) => {
        console.log(county)
        if (levelUpdate) return
        if (county.aggregateValue === 1) return
        const zipCodeLevelData = data.filter(
          (x: any) => x.county === county.county
        )
        drawZipCodeLevelCircles(zipCodeLevelData, g, transform,data)
        const zipCodeData = countiesJson.features.filter(
          (x: any) => x.id === county.countyId
        )
        zoomToCounty(event.target, zipCodeData[0])
      })
      .on('mouseover', function (event: any, d: any) {
        d3.select(this).attr('stroke', '#000')
        d3.select(this).style('opacity', 1)
        if (tippyInstanceCountyLevel) {
          tippyInstanceCountyLevel.destroy()
        }
        tippyInstanceCountyLevel = CountyLevelTooltip(event, d)
      })
      .on('mouseout', function (event: any, d: any) {
        d3.select(this).attr('stroke', '#fff')
        d3.select(this).style('opacity', 0.5)
      })
  }
}

// Zip code level circles
let tippyInstanceZipCodeLevel: any
function drawZipCodeLevelCircles(
  circlesData: any,
  g: any,
  stateLevel: boolean = false,
  data: any
) {
  if (!circlesData) return
  g.selectAll('.circle').remove()
  // Circle radius scale
  const radiusScale = d3
    .scaleLog()
    .domain([
      d3.min(circlesData, (d: any) => Number(d.allPieces)),
      d3.max(circlesData, (d: any) => Number(d.allPieces)),
    ])
    .range(stateLevel ? [2, 5] : [15, 20])

      const colorScale = d3
      .scaleLinear<string>()
      .domain(d3.extent(data !== null ? data : circlesData, (d: any) => d?.deliveryPrc) as any)
      .range(['#FF0000', '#00D06C'] as [string, string])


  if (circlesData.length) {
    g.selectAll('circle')
      .data(circlesData.filter((d: any) => d.x !== 0 && d.y !== 0))
      .join('circle')
      .attr('class', 'circle')
      .attr('cx', (d: any) => d.x)
      .attr('cy', (d: any) => d.y)
      .attr('r', (d: any) => radiusScale(d.scanned))
      .attr('fill', (d: any) => colorScale(d.deliveryPrc || 0) || '#ccc')
      .attr('stroke', '#fff')
      .attr('stroke-width', 0.5)
      .style('opacity', 0.5)
      .style('cursor', 'pointer')
      .attr('xCoordinate', (d: any) => d.x)
      .on('click', (event: any, d: any) => {
        event.stopPropagation()
      })
      .on('mouseover', function (event: any, d: any) {
        console.log(d)
        if (d.length === 0) return
        d3.select(this).attr('stroke', '#000')
        d3.select(this).style('opacity', 1)
        if (tippyInstanceZipCodeLevel) {
          tippyInstanceZipCodeLevel.destroy()
        }
        tippyInstanceZipCodeLevel = ZipCodeLevelTooltip(event, d)
      })
      .on('mouseout', function (event: any, d: any) {
        d3.select(this).attr('stroke', '#fff')
        d3.select(this).style('opacity', 0.5)
      })
  }
}

export { drawZipCodeLevelCircles, drawCountyLevelCircles }
