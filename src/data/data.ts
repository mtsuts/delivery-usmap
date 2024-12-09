import * as d3 from 'd3'

function countyLevelData(id: any, data: any) {
  // Filter data based on state id
  const stateData = id ? data.filter((x: any) => x.id === id) : data
  console.log(stateData)

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
        county: d.county,
        aggreagteValue: rolledUpDataValue.get(d.county),
        aggregateAvgSpeed: rolledUpDataSpeed.get(d.county),
        deliveryPrc: Math.floor(
          (stateData.filter((d) => d.status === 'Delivered').length /
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

export { countyLevelData }
