import React from 'react'
import * as d3 from 'd3'
import { ProgressBarProps } from '../types'

const ProgressBar = ({
  progress,
  width,
  color,
  deliveryColor,
  scannedValue,
}: ProgressBarProps) => {
  React.useEffect(() => {
    const height = 12
    let borderRadius = 5

    const container = d3.select('.progress-bar-container')
    container.selectAll('.progress-bar-container').remove()

    const svg = container
      .append('svg')
      .attr('width', width)
      .attr('height', height)

    function drawPattern(
      strokeWidth: number,
      state: string,
      strokeColor: any = '#004d40'
    ) {
      const patternId = `diagonal-lines-${state}`

      if (!svg.select(`#${patternId}`).empty()) {
        return `url(#${patternId})`
      }
      const defs = svg.append('defs')

      defs
        .append('pattern')
        .attr('id', patternId)
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
        .attr('stroke-width', strokeWidth)

      return `url(#${patternId})`
    }

    const strokeWidthScale = d3.scaleLinear().domain([0, 100]).range([6, 0])

    svg
      .append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', Math.floor(scannedValue) === 0 ? '#db3834' : '#e0e0e0')
      .attr('rx', borderRadius)
      .attr('ry', borderRadius)
      console.log(progress)

    if (scannedValue === 0) {
      svg
        .append('rect')
        .attr('width', width)
        .attr('height', height)
        .attr('fill', (d) =>
          drawPattern(strokeWidthScale(progress * 100), 'color', color)
        )
        .attr('rx', borderRadius)
        .attr('ry', borderRadius)
    }

    svg
      .append('rect')
      .attr('width', 0)
      .attr('height', height)
      .attr('fill', scannedValue === 100 ? color : deliveryColor)
      .attr('rx', borderRadius)
      .attr('ry', borderRadius)
      .transition()
      .duration(1000)
      .attr('width', progress * width)

    svg
      .append('rect')
      .attr('width', 0)
      .attr('height', height)
      .attr('fill', (d) =>
        drawPattern(strokeWidthScale(progress * 100), 'color', color)
      )
      .attr('rx', borderRadius)
      .attr('ry', borderRadius)
      .transition()
      .duration(1000)
      .attr('width', progress * width)

    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', height / 2)
      .attr('dy', '.35em')
      .attr('text-anchor', 'middle')
      .attr('fill', '#fff')
      .style('font-weight', 'bold')
      .text(`${Math.round(progress * 100)}%`)
  }, [progress])

  return (
    <>
      <div> Scanned %</div>
      <div className='progress-bar-container'></div>
    </>
  )
}

export default ProgressBar
