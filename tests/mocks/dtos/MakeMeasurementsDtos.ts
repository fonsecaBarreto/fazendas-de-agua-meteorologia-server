import { MeasurementMetrics } from "@/domain/Views/MeasurementView"

export const MakeFakeMeasurementMetrics= (params?: Partial<MeasurementMetrics>): MeasurementMetrics =>{
     return ({
          start_limit: new Date(),
          end_limit: new Date(),
          amount:  0,
          mTemperature: 0,
          mAirHumidity:  0,
          mWindSpeed: 0,
          mdWindDirection:  null,
          mRainVolume: 0,
          mAccRainVolume: 0,
          ...params
     })
}
