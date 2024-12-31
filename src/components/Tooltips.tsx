import React from 'react'
import tippy, { followCursor } from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/themes/light-border.css'
import 'tippy.js/dist/backdrop.css'
import { createRoot } from 'react-dom/client'
import ProgressBar from './ProgressBar'
import checkedIcon from '../images/checked.svg'
import statusPending from '../images/statusPending.svg'

// Generate tooltip instance
function generateTooltipContent(
  event: any,
  data: any,
  title: string,
  color: any
) {
  const content = (
    <>
      <div style={{ fontSize: '15px', fontWeight: 'bold' }}>{title}</div>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
        }}
      >
        <thead>
          <tr>
            <th>Delivered</th>
            <th>In-Transit</th>
            <th>Avg.Delivery Speed</th>
            <th>Mailpieces</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td
              style={{
                backgroundColor: color,
                color: '#ffffff',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  height: '10px',
                  gap: 3,
                }}
              >
                <div>{data?.deliveryPrc || 0}%</div>
                <img
                  src={data?.deliveryPrc > 80 ? checkedIcon : statusPending}
                  alt='statusIcon'
                ></img>
              </div>
            </td>
            <td>{data?.inTransitPrc || 0}%</td>
            <td>{data?.aggregateAvgSpeed || 0} days</td>
            <td style={{ fontWeight: 900 }}>{data?.aggregateValue || 0}</td>
          </tr>
        </tbody>
      </table>
      <div style={{ marginTop: '10px' }}>
        <ProgressBar
          progress={data.scannedPrc / 100}
          width={330}
          scannedValue={data.scannedPrc}
        />
      </div>
    </>
  )
  const container = document.createElement('div')
  createRoot(container).render(content)
  // Tooltip instance
  return tippy(event.target, {
    plugins: [followCursor],
    allowHTML: true,
    content: container,
    arrow: false,
    theme: 'light-border',
    trigger: 'mouseenter',
    placement: 'auto',
    followCursor: true,
  })
}

// State level tooltip generator
function StateLevelTooltip(event: any, d: any, data: any, color: any) {
  const stateName = d.properties.name
  console.log(data)
  if (!data) return
  return generateTooltipContent(event, data, stateName, color)
}

// County level tooltip generator
function CountyLevelTooltip(event: any, d: any, data: any, color: any) {
  const title = `${d.county} County`
  return generateTooltipContent(event, data, title, color)
}

// Zio code level tooltip generator
function ZipCodeLevelTooltip(event: any, data: any) {
  const content = (
    <>
      <table style={{ width: '320px', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Zip Code</th>
            <th> Delivered</th>
            <th>In-Transit</th>
            <th>Mailpieces</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{data.location.split(',')[0]}</td>
            <td> {data.delivered} </td>
            <td>{data.inTransit}</td>
            <td style={{ fontWeight: 900 }}>{data.allPieces}</td>
          </tr>
        </tbody>
      </table>
      <div style={{ marginTop: '10px' }}>
        <ProgressBar
          progress={data.scannedPrc / 100}
          width={320}
          scannedValue={data.scannedPrc}
        />
      </div>
    </>
  )
  // Create a container to render the React element
  const container = document.createElement('div')
  createRoot(container).render(content)
  return tippy(event.target, {
    plugins: [followCursor],
    allowHTML: true,
    content: container,
    arrow: false,
    theme: 'light-border',
    placement: 'auto',
    followCursor: true,
  })
}

export { StateLevelTooltip, CountyLevelTooltip, ZipCodeLevelTooltip }
