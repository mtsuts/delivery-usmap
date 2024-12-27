import React from 'react'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/themes/light-border.css'
import 'tippy.js/dist/backdrop.css'
import { createRoot } from 'react-dom/client'
import ProgressBar from './ProgressBar'
import checkedIcon from '../images/checked.svg'

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
            <th
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
                <div>Delivered </div>
                <img
                  src={checkedIcon}
                  style={{ height: '10px', width: '10%' }}
                  alt='checkedIcon'
                ></img>
              </div>
            </th>
            <th>In-Transit</th>
            <th>Avg.Delivery Speed</th>
            <th>Mailpieces</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{data?.deliveryPrc || 0}%</td>
            <td>{data?.inTransitPrc || 0}%</td>
            <td>{data?.aggregateAvgSpeed || 0} days</td>
            <td>{data?.aggregateValue || 0}</td>
          </tr>
        </tbody>
      </table>
      <div style={{ marginTop: '10px' }}>
        <ProgressBar
          data={data}
          progress={data.scannedPrc / 100}
          width={330}
          color={'#00D06C'}
        />
      </div>
    </>
  )
  const container = document.createElement('div')
  createRoot(container).render(content)
  const xcoordinate = event.target.getAttribute('xcoordinate')
  // Tooltip instance
  return tippy(event.target, {
    allowHTML: true,
    content: container,
    arrow: false,
    theme: 'light-border',
    placement: xcoordinate > 450 ? 'bottom-end' : 'bottom-start',
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
            <th>Mailpieces</th>
            <th>Delivery Status</th>
            {data.status === 'Delivered' && <th> Delivered</th>}
            {data.status === 'in-Transit' && <th>Delivery Time</th>}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{data.location.split(',')[0]}</td>
            <td>{data.allPieces}</td>
            <td>{data.status}</td>
            {data.status === 'Delivered' && <td> {data.delivered} </td>}
            {data.status === 'in-Transit' && <td>{data.delivery_date}</td>}
          </tr>
        </tbody>
      </table>
      <div style={{ marginTop: '10px' }}>
        <ProgressBar
          data={data}
          progress={data.scannedPrc / 100}
          width={320}
          color={'#00D06C'}
        />
      </div>
    </>
  )

  // Create a container to render the React element
  const container = document.createElement('div')
  createRoot(container).render(content)
  const xcoordinate = event.target.getAttribute('xcoordinate')
  return tippy(event.target, {
    allowHTML: true,
    content: container,
    arrow: false,
    theme: 'light-border',
    placement: xcoordinate > 450 ? 'bottom-end' : 'bottom-start',
  })
}

export { StateLevelTooltip, CountyLevelTooltip, ZipCodeLevelTooltip }
