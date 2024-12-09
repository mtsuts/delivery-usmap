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

  const rolledUpDataSpeed = d3.rollup(
    stateData,
    (group) =>
      Math.floor(
        d3.sum(group, (d: any) => d.delivery_speed) / group.length
      ).toFixed(1),
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
          (stateData.filter((d:any) => d.status === 'Delivered').length /
            stateData.length) *
            100
        ),
        inTransitPrc: Math.floor(
          (stateData.filter((d) => d.status === 'In Transit').length /
            stateData.length) *
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

function stateLevelData(d: any, data: any) {
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

  const uniqueStateData = new Set()
  return stateDeliveries
    .map((x: any) => {
      return {
        state: x.state,
        aggregateValue: recordsCount,
        deliveryPrc: deliverCountPercentage,
        inTransitPrc: inTransitPercentage,
        aggregateAvgSpeed: averageDeliverySpeed,
      }
    })
    .filter((item: any) => {
      if (uniqueStateData.has(item.state)) {
        return false
      }
      uniqueStateData.add(item.state)
      return true
    })[0]
}

export { countyLevelData, stateLevelData }
