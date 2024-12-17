import * as d3 from 'd3'


const formatNumber = d3.format('.1f')

function countyLevelData(id: any, data: any) {
  // Filter data based on state id
  const stateData = id ? data.filter((x: any) => x.id === id) : data

  // Rollup data based on county name
  const rolledupDataPieces = d3.rollup(
    stateData,
    (group) => d3.sum(group, (d: any) => d.allPieces),
    (x: any) => x.county
  )

  const rolledUpDataDelivered = d3.rollup(
    stateData,
    (group) => d3.sum(group, (x: any) => x.delivered),
    (x: any) => x.county
  )

  const rolledUpDataTransit = d3.rollup(
    stateData,
    (group) => d3.sum(group, (x: any) => x.inTransit),
    (x: any) => x.county
  )
  const rolledUpDataScanned = d3.rollup(
    stateData,
    (group) => d3.sum(group, (x: any) => x.scanned),
    (x: any) => x.county
  )

  const rolledUpDataSpeed = d3.rollup(
    stateData,
    (group) =>
      Math.floor(d3.sum(group, (d: any) => d.delivery_speed) / group.length),
    (x: any) => x.county
  )

  //  Generate county level data
  const uniqueCountyData = new Set()
  return stateData
    .map((d: any) => {
      return {
        countyId: d.countyId,
        county: d.county,
        aggregateValue: rolledupDataPieces.get(d.county),
        aggregateAvgSpeed: rolledUpDataSpeed.get(d.county),
        deliveryPrc: Math.floor(
          (rolledUpDataDelivered.get(d.county) /
            rolledupDataPieces.get(d.county)) *
            100
        ),
        inTransitPrc: Math.floor(
          (rolledUpDataTransit.get(d.county) /
            rolledupDataPieces.get(d.county)) *
            100
        ),
        scannedPrc: Math.floor(
          (rolledUpDataScanned.get(d.county) /
            rolledupDataPieces.get(d.county)) *
            100
        ),
        x: d.x,
        y: d.y,
      }
    })
    .filter((item: any) => {
      if (uniqueCountyData.has(item.county)) {
        return false
      }
      uniqueCountyData.add(item.county)
      return true
    })
}

function stateLevelData(state: any, data: any) {
  const stateDeliveries = state
    ? data.filter((x: any) => x.state === state)
    : data

  // Rollup data based on state name
  const rolledupDataPieces = d3.rollup(
    stateDeliveries,
    (group) => d3.sum(group, (x: any) => x.allPieces),
    (x: any) => x.state
  )

  const rolledUpDataDelivered = d3.rollup(
    stateDeliveries,
    (group) => d3.sum(group, (x: any) => x.delivered),
    (x: any) => x.state
  )

  const rolledUpDataTransit = d3.rollup(
    stateDeliveries,
    (group) => d3.sum(group, (x: any) => x.inTransit),
    (x: any) => x.state
  )

  console.log('transit', rolledUpDataTransit)
  const rolledUpDataScanned = d3.rollup(
    stateDeliveries,
    (group) => d3.sum(group, (x: any) => x.scanned),
    (x: any) => x.state
  )

  const rolledUpDataSpeed = d3.rollup(
    stateDeliveries,
    (group) =>
      Math.floor(d3.sum(group, (x: any) => x.delivery_speed) / group.length),
    (x: any) => x.state
  )
  
  rolledUpDataDelivered.delete(undefined)
  rolledUpDataDelivered.delete('')
  rolledupDataPieces.delete(undefined)
  rolledupDataPieces.delete('')

  const uniqueStateData = new Set()
  const finalData = stateDeliveries
    .map((x: any) => {
      return {
        state: x.state,
        aggregateValue: rolledupDataPieces.get(x.state),
        deliveryPrc: formatNumber(
          (rolledUpDataDelivered.get(x.state) /
            rolledupDataPieces.get(x.state)) *
            100
        ),
        inTransitPrc: formatNumber(
          (rolledUpDataTransit.get(x.state) / rolledupDataPieces.get(x.state)) *
            100
        ),
        scannedPrc: formatNumber(
          (rolledUpDataScanned.get(x.state) / rolledupDataPieces.get(x.state)) *
            100
        ),
        aggregateAvgSpeed: rolledUpDataSpeed.get(x.state),
      }
    })
    .filter((item: any) => {
      if (uniqueStateData.has(item.state)) {
        return false
      }
      uniqueStateData.add(item.state)
      return true
    })
  if (state) return finalData.filter((d: any) => d.deliveryPrc >= 0)[0]
  console.log(finalData)
  return finalData.filter((d: any) => d.deliveryPrc >= 0)
}

export { countyLevelData, stateLevelData }
