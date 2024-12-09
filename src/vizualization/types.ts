export interface MapProps {
  container: string
  stateJson: any
  countiesJson: any
  data: {
    id: string
    value: number
    location: string
    delivery_date: string
    status: string
    state: string
  }[]
  mobileHeight: number
  desktopHeight: number
  color: string[]
}

export interface Data {
  data: []
  setData: Function
}

export interface MapVizProps {
  mainContainer: string
  stateJson: any
  countiesJson: any
  data: {
    id: string
    value: number
    location: string
    delivery_date: string
    status: string
    state: string
    delivery_speed: number
    county: string
    x: number
    y: number
  }[]
  mapData: Map<string, number>
  mobileHeight: number
  desktopHeight: number
  color: string[]
  view: 'states' | 'counties'
}
