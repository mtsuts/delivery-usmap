import React from 'react'
import * as d3 from 'd3'
import { ProgressBarProps } from '../types'

const ProgressBar = ({ progress, width, color }: ProgressBarProps) => {
  React.useEffect(() => {
    const height = 14
    let borderRadius = 5

    const container = d3.select('#progress-bar-container')
    container.selectAll('*').remove()

    const svg = container
      .append('svg')
      .attr('width', width)
      .attr('height', height)

    svg
      .append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', '#e0e0e0')
      .attr('rx', borderRadius)
      .attr('ry', borderRadius)

    svg
      .append('rect')
      .attr('width', 0)
      .attr('height', height)
      .attr('fill', color)
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
      <div id='progress-bar-container'></div>
    </>
  )
}

export default ProgressBar
