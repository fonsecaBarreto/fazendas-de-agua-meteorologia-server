import { Measurement } from "@/domain/Entities";
import { IStationRepository } from "@/domain/Interfaces";
import { StationView, MeasurementMetrics, MMetricsPageView } from "@/domain/Views";


export namespace IFindStationMetricsService{
     export type Params = {
          station_id:string,
          start_date: Date, // fronteira inicial
          intervals: number // quantidades de intervalos desejado 
          amplitude: number // Amplitude de classe em minutos
     }
}

export interface IFindStationMetricsService {
     execute(params: IFindStationMetricsService.Params): Promise<StationView>
}

export class FindStationMetricsService implements IFindStationMetricsService {

     constructor(
           private readonly _stationsRepository: Pick<IStationRepository, 'findStation' | 'findMeasurementsByInterval'> 
     ){}
   
     public async execute(params: IFindStationMetricsService.Params): Promise<StationView>{

          const { station_id, start_date, amplitude, intervals } = params

          const MEASUREMENTS_FREQUENCY = 60000 // Um minuto  (Milisegundos)
          // No momento da criação desse script, a frequencia medições definida para o projeto é de 1/minuto
          var metrics: MeasurementMetrics[] = new Array(intervals);

          const station: StationView = await this._stationsRepository.findStation(station_id)
          if(!station) return null

          await Promise.all([...metrics].map( async (n,i)=>{
               let initial_date = new Date(start_date.getTime() + MEASUREMENTS_FREQUENCY * amplitude * i);
               let end_date =  new Date( initial_date.getTime() + ( MEASUREMENTS_FREQUENCY ) * amplitude )
               let mm: MeasurementMetrics = await this._stationsRepository.findMeasurementsByInterval(station_id, initial_date, end_date);
               metrics[i]= mm 
          }))

          const Metricsview: MMetricsPageView = {
               start_date,
               intervals,
               amplitude,
               data: metrics,
          }

          station.setMeasurements(Metricsview)

          return station;

     }

}


export default FindStationMetricsService