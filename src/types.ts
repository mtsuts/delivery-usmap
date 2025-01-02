export interface Data {
  data: []
  setData: Function
}

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
  mobileHeight: number
  desktopHeight: number
  color: string[]
  view: 'states' | 'counties' | 'zipcodes' | 'transit'
}

export type SideBarProps = {
  data: {
    position: number
    onClick: () => void
    imageSrc: string
    label: string
    isActive: boolean
  }[]
}

export type ProgressBarProps = {
  progress: number
  width: number
}

export interface Data {
  data: []
  setData: Function
}
