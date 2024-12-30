import React from 'react'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/themes/light-border.css'
import 'tippy.js/dist/backdrop.css'
import { createRoot } from 'react-dom/client'
import ProgressBar from './ProgressBar'
import checkedIcon from '../images/checked.svg'
import statusPending from '../images/statusPending.svg'
import { getTooltipPlacement, scannedColorScale } from '../utils'

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
          width: '330px',
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
          data={data}
          progress={data.scannedPrc / 100}
          width={330}
          color={scannedColorScale(data.scannedPrc)}
        />
      </div>
    </>
  )
  const container = document.createElement('div')
  createRoot(container).render(content)
  const xcoordinate = event.target.getAttribute('xcoordinate')
  const ycoordinate = event.target.getAttribute('ycoordinate')
  // Tooltip instance
  return tippy(event.target, {
    allowHTML: true,
    content: container,
    arrow: false,
    theme: 'light-border',
    placement: getTooltipPlacement(xcoordinate, ycoordinate),
  })
}

// State level tooltip generator
function StateLevelTooltip(event: any, d: any, data: any, color: any) {
  const stateName = d.properties.name
  if (!data) return
  return generateTooltipContent(event, data, stateName, color)
}

// County level tooltip generator
function CountyLevelTooltip(event: any, d: any, color: any) {
  const title = `${d.county} County`
  return generateTooltipContent(event, d, title, color)
}

// Zio code level tooltip generator
function ZipCodeLevelTooltip(event: any, data: any) {
  const content = (
    <>
      <table style={{ width: '320px', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Zip Code</th>
            <th>Delivery Status</th>
            {data.status === 'Delivered' && <th> Delivered</th>}
            {data.status === 'in-Transit' && <th>Delivery Time</th>}
            <th>Mailpieces</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{data.location.split(',')[0]}</td>
            <td>{data.status}</td>
            {data.status === 'Delivered' && <td> {data.delivered} </td>}
            {data.status === 'in-Transit' && <td>{data.delivery_date}</td>}
            <td style={{ fontWeight: 900 }}>{data.allPieces}</td>
          </tr>
        </tbody>
      </table>
      <div style={{ marginTop: '10px' }}>
        <ProgressBar
          data={data}
          progress={data.scannedPrc / 100}
          width={320}
          color={scannedColorScale(data.scannedPrc)}
        />
      </div>
    </>
  )

  // Create a container to render the React element
  const container = document.createElement('div')
  createRoot(container).render(content)
  const xcoordinate = event.target.getAttribute('xcoordinate')
  const ycoordinate = event.target.getAttribute('ycoordinate')
  return tippy(event.target, {
    allowHTML: true,
    content: container,
    arrow: false,
    theme: 'light-border',
    placement: getTooltipPlacement(xcoordinate, ycoordinate),
  })
}

export { StateLevelTooltip, CountyLevelTooltip, ZipCodeLevelTooltip }
