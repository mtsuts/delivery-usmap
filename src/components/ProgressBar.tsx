import React from 'react'
import * as d3 from 'd3'
import { ProgressBarProps } from '../types'
import { colorScale } from '../utils'

const ProgressBar = ({
  progress,
  width,
  scannedValue,
}: ProgressBarProps) => {
  React.useEffect(() => {
    const height = 12
    let borderRadius = 5
    console.log(progress)
    console.log(scannedValue)

    const container = d3.select('.progress-bar-container')
    container.selectAll('.progress-bar-container').remove()

    const svg = container
      .append('svg')
      .attr('width', width)
      .attr('height', height)

    svg
      .append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', Math.floor(scannedValue) === 0 ? '#db3834' : '#e0e0e0')
      .attr('rx', borderRadius)
      .attr('ry', borderRadius)

    svg
      .append('rect')
      .attr('width', 0)
      .attr('height', height)
      .attr('fill', (d) => colorScale(scannedValue))
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
