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
      <div style={{ fontSize: '17px', fontWeight: 'bold' }}>{title}</div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Mailpieces</th>
            <th>Delivered</th>
            <th>In-Transit</th>
            <th>Avg. Speed</th>
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
          progress={data.deliveryPrc / 100}
          width={300}
          color={data.deliveryPrc > 50 ? '#00D06C' : '#33E48E'}
        />
      </div>
    </>
  )
  const container = document.createElement('div')
  createRoot(container).render(content)

  // Tooltip instance
  return tippy(event.target, {
    allowHTML: true,
    content: container,
    arrow: false,
    theme: 'light-border',
    placement: 'bottom-end',
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
  })
}

export { StateLevelTooltip, CountyLevelTooltip, ZipCodeLevelTooltip }
