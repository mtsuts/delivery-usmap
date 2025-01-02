import React, { useRef, useEffect } from 'react'
import * as d3 from 'd3'
import { ProgressBarProps } from '../types'
import { colorScale } from '../utils'

const ProgressBar = ({ progress, width }: ProgressBarProps) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const scannedValue = Math.floor(progress * 100)
    const height = 12
    const borderRadius = 5

    // Clear previous SVG content
    d3.select(containerRef.current).selectAll('svg').remove()

    const svg = d3
      .select(containerRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)

    svg
      .append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', scannedValue === 0 ? '#db3834' : '#e0e0e0')
      .attr('rx', borderRadius)
      .attr('ry', borderRadius)

    svg
      .append('rect')
      .attr('width', 0)
      .attr('height', height)
      .attr('fill', colorScale(scannedValue))
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
      .text(`${scannedValue}%`)
  }, [progress, width])

  return (
    <>
      <div>Scanned %</div>
      <div ref={containerRef} className='progress-bar-container'></div>
    </>
  )
}

export default ProgressBar
