import React from 'react'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/themes/light-border.css'
import 'tippy.js/dist/backdrop.css'
import { createRoot } from 'react-dom/client'
import ProgressBar from './ProgressBar'

// Generate tooltip instance
function generateTooltipContent(event: any, data: any, title: string) {
  const content = (
    <>
      <div style={{ fontSize: '15px', fontWeight: 'bold' }}>{title}</div>
      <table
        style={{
          width: '190px',
          borderCollapse: 'collapse',
        }}
      >
        <thead>
          <tr>
            <th>Mailpieces</th>
            <th>Delivered</th>
            <th>In-Transit</th>
            <th>Avg.Delivery Speed</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{data?.aggregateValue || 0}</td>
            <td>{data?.deliveryPrc || 0}%</td>
            <td>{data?.inTransitPrc || 0}%</td>
            <td>{data?.aggregateAvgSpeed || 0} days</td>
          </tr>
        </tbody>
      </table>
      <div style={{ marginTop: '10px' }}>
        <ProgressBar
          data={data}
          progress={data.scannedPrc / 100}
          width={250}
          color={data.scannedPrc === 100 ? '#00D06C' : '#004d40'}
        />
      </div>
    </>
  )

  const container = document.createElement('div')
  createRoot(container).render(content)
  const xCoordinate = event.target.getAttribute('xCoordinate')
  console.log(xCoordinate)
  // Tooltip instance
  return tippy(event.target, {
    allowHTML: true,
    content: container,
    arrow: false,
    theme: 'light-border',
    placement: xCoordinate > 450 ? 'bottom-end' : 'bottom-start',
  })
}

function StateLevelTooltip(event: any, d: any, data: any) {
  // Generate Tooltip Data
  const stateName = d.properties.name

  if (!data) return

  // Tooltip content
  return generateTooltipContent(event, data, stateName)
}

// County level tooltip generator
function CountyLevelTooltip(event: any, d: any) {
  const title = `${d.county} County`
  return generateTooltipContent(event, d, title)
}

function ZipCodeLevelTooltip(event: any, data: any) {
  const content = (
    <>
      <table style={{ width: '190px', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Zip Code</th>
            <th>Records</th>
            <th>Delivery Status</th>
            {data.status === 'in-Transit' && <th>Delivery Time</th>}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{data.location.split(',')[0]}</td>
            <td>{data.allPieces}</td>
            <td>{data.status}</td>
            {data.status === 'in-Transit' && <td>{data.delivery_date}</td>}
          </tr>
        </tbody>
      </table>
    </>
  )

  // Create a container to render the React element
  const container = document.createElement('div')
  createRoot(container).render(content)
  const xCoordinate = event.target.getAttribute('xCoordinate')
  return tippy(event.target, {
    allowHTML: true,
    content: container,
    arrow: false,
    theme: 'light-border',
    placement: xCoordinate > 450 ? 'bottom-end' : 'bottom-start',
  })
}

export { StateLevelTooltip, CountyLevelTooltip, ZipCodeLevelTooltip }