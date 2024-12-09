import React from 'react'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/themes/light-border.css'
import 'tippy.js/dist/backdrop.css'
import { createRoot } from 'react-dom/client'

function StateLevelTooltip(event: any, d: any, data: any, instance: any) {
  // Create tippy instance

  // Generate Tooltip Data
  const stateName = d.properties.name
  const stateDeliveries = data.filter((x: any) => x.state === d.properties.name)
  const recordsCount = stateDeliveries.reduce(
    (acc: number, curr: any) => acc + curr.value,
    0
  )
  const inTransitPercentage = Math.floor(
    (stateDeliveries.filter((d) => d.status === 'In Transit').length /
      stateDeliveries.length) *
      100
  )
  const deliverCountPercentage = Math.floor(
    (stateDeliveries.filter((d) => d.status === 'Delivered').length /
      stateDeliveries.length) *
      100
  )

  const averageDeliverySpeed = (
    stateDeliveries
      .map((x: any) => x.delivery_speed)
      .reduce((acc: number, curr: any) => acc + curr, 0) /
    stateDeliveries.length
  ).toFixed(1)

  // Tooltip content
  const content = (
    <>
      <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{stateName}</div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Records</th>
            <th>Delivered (%)</th>
            <th>In Transit (%)</th>
            <th>Avg. Speed</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{recordsCount}</td>
            <td>{deliverCountPercentage}%</td>
            <td>{inTransitPercentage}%</td>
            <td> {averageDeliverySpeed}</td>
          </tr>
        </tbody>
      </table>
    </>
  )
  const container = document.createElement('div')
  createRoot(container).render(content)

  // Tooltip instance
  if (recordsCount) {
    if (instance) {
      instance.destroy()
    }
    instance = tippy(event.target, {
      allowHTML: true,
      content: container,
      arrow: false,
      theme: 'light-border',
      placement: 'bottom-start',
    })
  }
}

export {StateLevelTooltip}
