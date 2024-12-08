import React from 'react'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/themes/light-border.css'
import 'tippy.js/dist/backdrop.css'
import { createRoot } from 'react-dom/client'
import ProgressBar from './ProgressBar'

function StateLevelTooltip(event: any, d: any, data: any) {
  // Generate Tooltip Data
  const stateName = d.properties.name
  const stateDeliveries = data.filter((x: any) => x.state === d.properties.name)
  const recordsCount = stateDeliveries.reduce(
    (acc: number, curr: any) => acc + curr.value,
    0
  )
  const inTransitPercentage = Math.floor(
    (stateDeliveries.filter((d: any) => d.status === 'In Transit').length /
      stateDeliveries.length) *
      100
  )
  const deliverCountPercentage = Math.floor(
    (stateDeliveries.filter((d: any) => d.status === 'Delivered').length /
      stateDeliveries.length) *
      100
  )

  const averageDeliverySpeed = (
    stateDeliveries
      .map((x: any) => x.delivery_speed)
      .reduce((acc: number, curr: any) => acc + curr, 0) /
    stateDeliveries.length
  ).toFixed(1)
  console.log(deliverCountPercentage)
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
      <div style={{ marginTop: '10px' }}>
        <ProgressBar
          progress={deliverCountPercentage / 100}
          width={300}
          color={deliverCountPercentage > 50 ? '#006CD0' : '#c93235'}
        />
      </div>
    </>
  )

  // Create a container to render the React element for tippy
  const container = document.createElement('div')
  createRoot(container).render(content)

  // Tooltip instance
  if (recordsCount) {
    return tippy(event.target, {
      allowHTML: true,
      content: container,
      arrow: false,
      theme: 'light-border',
      placement: 'bottom-start',
    })
  }
}

// County level tooltip generator
function CountyLevelTooltip(event: any, d: any) {
  const content = (
    <>
      <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
        {d.county} County
      </div>
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
            <td>{d.aggreagteValue}</td>
            <td>{d.deliveryPrc}%</td>
            <td>{d.inTransitPrc}%</td>
            <td>{d.aggregateAvgSpeed}</td>
          </tr>
        </tbody>
      </table>
      <div style={{ marginTop: '10px' }}>
        <ProgressBar
          progress={d.deliveryPrc / 100}
          width={300}
          color={d.deliveryPrc > 50 ? '#006CD0' : '#c93235'}
        />
      </div>
    </>
  )

  // Create a container to render the React element
  const container = document.createElement('div')
  createRoot(container).render(content)

  return tippy(event.target, {
    allowHTML: true,
    content: container,
    arrow: false,
    theme: 'light-border',
    placement: 'bottom-end',
  })
}

function ZipCodeLevelTooltip(event: any, data: any) {
  const content = (
    <>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Zip Code</th>
            <th>Records</th>
            <th>Delivery Status</th>
            {data.status === 'In Transit' && <th>Delivery Time</th>}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{data.location.split(',')[0]}</td>
            <td>{data.value}</td>
            <td>{data.status}</td>
            {data.status === 'In Transit' && <td>{data.delivery_date}</td>}
          </tr>
        </tbody>
      </table>
    </>
  )

  // Create a container to render the React element
  const container = document.createElement('div')
  createRoot(container).render(content)

  return tippy(event.target, {
    allowHTML: true,
    content: container,
    arrow: false,
    theme: 'light-border',
    placement: 'bottom-end',
  })
}

export { StateLevelTooltip, CountyLevelTooltip, ZipCodeLevelTooltip }
