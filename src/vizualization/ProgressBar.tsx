import React from 'react'
import * as d3 from 'd3'
import { ProgressBarProps } from './types'

const ProgressBar = ({ progress, width, color }: ProgressBarProps) => {
  React.useEffect(() => {
    // Set dimensions for the progress bar
    const height = 17
    let borderRadius = 5

    // Select the container element and clear previous progress bar if any
    const container = d3.select('#progress-bar-container')
    container.selectAll('*').remove()

    // Create an SVG container
    const svg = container
      .append('svg')
      .attr('width', width)
      .attr('height', height)

    // Create a background rectangle for the progress bar
    svg
      .append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', '#e0e0e0')
      .attr('rx', borderRadius)
      .attr('ry', borderRadius)

    // Create the progress bar rectangle
    svg
      .append('rect')
      .attr('width', 0)
      .attr('height', height)
      .attr('fill', color)
      .attr('rx', borderRadius)
      .attr('ry', borderRadius)
      .transition()
      .duration(1000)
      .attr('width', progress * width) // Set progress width based on the progress value (0 to 1)

    // Add text inside the progress bar
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

  return <div id='progress-bar-container'></div>
}

export default ProgressBar
