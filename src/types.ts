export interface Data {
  id: string
  location: string
  max_delivered: string
  distinct_job_imb_count: string
  all_pieces: string
  scanned: number
  client_company: string
  mailing_name: string
  mailing_status: string
  mailing_date: string
  orgId: string
  startTheClockDate: string
  scanFacilityName: string
  JobID: string
  delivery_date: string
  pieceId: string
  latitude: string
  longitude: string
  allPieces: number
  status: string
  state: string
  county: string
  x: number
  y: number
  notScannedPrc: number
  scannedPrc: number
  delivered: number
  inTransit: number
  deliveryPrc: number
  transitPrc: number
  delivery_speed: number
  countyId?: string
}

export interface AppContextProps {
  data: Data[]
  setData: (data: Data[]) => void
}

export interface MapProps {
  container: string
  stateJson: any
  countiesJson: any
  mobileHeight: number
  desktopHeight: number
  color: string[]
}

export interface MapVizProps {
  mainContainer: string
  stateJson: any
  countiesJson: any
  data: Data[]
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
