import * as d3 from 'd3'

function countyLevelData(id: any, data: any) {
  // Filter data based on state id
  const stateData = id ? data.filter((x: any) => x.id === id) : data

  // Rollup data based on county name
  const rolledUpDataValue = d3.rollup(
    stateData,
    (group) => d3.sum(group, (d: any) => d.value),
    (x: any) => x.county
  )

  const rolledUpDataDelivered = d3.rollup(
    stateData,
    (group) =>
      d3.sum(group, (x: any) => (x.status === 'Delivered' ? x.value : 0)),
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
        aggregateValue: rolledUpDataValue.get(d.county),
        aggregateAvgSpeed: rolledUpDataSpeed.get(d.county),
        deliveryPrc: Math.floor(
          (rolledUpDataDelivered.get(d.county) /
            rolledUpDataValue.get(d.county)) *
            100
        ),
        inTransitPrc:
          100 -
          Math.floor(
            (rolledUpDataDelivered.get(d.county) /
              rolledUpDataValue.get(d.county)) *
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
  const rolledUpDataValue = d3.rollup(
    stateDeliveries,
    (group) => d3.sum(group, (x: any) => x.value),
    (x: any) => x.state
  )

  const rolledUpDataDelivered = d3.rollup(
    stateDeliveries,
    (group) =>
      d3.sum(group, (x: any) => (x.status === 'Delivered' ? x.value : 0)),
    (x: any) => x.state
  )

  rolledUpDataDelivered.delete(undefined)
  rolledUpDataDelivered.delete('')
  rolledUpDataValue.delete(undefined)
  rolledUpDataValue.delete('')

  const rolledUpDataSpeed = d3.rollup(
    stateDeliveries,
    (group) =>
      Math.floor(d3.sum(group, (x: any) => x.delivery_speed) / group.length),
    (x: any) => x.state
  )
  const uniqueStateData = new Set()
  const finalData = stateDeliveries
    .map((x: any) => {
      return {
        state: x.state,
        aggregateValue: rolledUpDataValue.get(x.state),
        deliveryPrc: Math.floor(
          (rolledUpDataDelivered.get(x.state) /
            rolledUpDataValue.get(x.state)) *
            100
        ),
        inTransitPrc:
          100 -
          Math.floor(
            (rolledUpDataDelivered.get(x.state) /
              rolledUpDataValue.get(x.state)) *
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
  return finalData.filter((d: any) => d.deliveryPrc >= 0)
}

export { countyLevelData, stateLevelData }
