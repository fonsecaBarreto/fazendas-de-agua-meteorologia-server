import { Station } from "../../domain/Entities/Station";
import { IStationRepository } from "../../domain/Interfaces/repositories/IStationRepository";
import { StationView, SMPageFeed, MeasurementMetrics } from "../../domain/Views/";
import KnexAdapter from "./KnexAdapter";

import { PgBaseRepository } from "./PgBaseRepository";

export class PgStationsRepository extends PgBaseRepository<Station> implements IStationRepository {
     constructor(){
          super('stations')
     }

     async findWithAddress_id(station_id: string, address_id: string): Promise<Station> {
          const query = KnexAdapter.connection('stations').where({id: station_id, address_id}).first()
          const address = await query
          return address;
     }
     
     async findMeasurements(station_id: string, offset: number, limit: number): Promise<SMPageFeed> {
        
          const { count } = await KnexAdapter.connection('measurements').where({station_id}).count('id', { as: 'count' }).first();
        
          const measurements: any = await KnexAdapter.connection('measurements').where({station_id})
               .orderBy('created_at','desc').limit(limit).offset(offset)

          if(!measurements || measurements.length == 0) return null
     
          return ({
               total: Number(count),
               page_index: Math.ceil(offset / limit),
               page_limit: limit,
               data: measurements
          })
     }

     async findMeasurementsByInterval(station_id: string, start_date: Date, end_date: Date): Promise<MeasurementMetrics> {

          const AVG_LIST = ['temperature', 'airHumidity', 'windSpeed', 'rainVolume', 'accRainVolume' ];
          const metrics: any= await KnexAdapter.connection('measurements')
          .where({station_id})
          .andWhereBetween('created_at', [start_date, end_date])
          .select( [ ...AVG_LIST.map( p=>KnexAdapter.connection.raw( 'avg(??) as ??',[p,p])) ,
               KnexAdapter.connection.raw( 'max(??) as winddirection',['windDirection']) ,
               KnexAdapter.connection.raw( 'count(??) as amount',['id']) ,
          ])
          .first();
          
         if(!metrics) return null

          const measurement: MeasurementMetrics = {
               start_limit: start_date,
               end_limit: end_date,
               amount: Number(metrics.amount) || 0,
               mTemperature: metrics.temperature || 0,
               mAirHumidity: metrics.airHumidity || 0,
               mWindSpeed: metrics.windSpeed || 0,
               mdWindDirection: metrics.winddirection || null,
               mRainVolume: metrics.rainVolume || 0,
               mAccRainVolume: metrics.accRainVolume || 0
          } 

          return measurement

     }

     async findStation(id:string): Promise<StationView>{

          const resultado: any = await KnexAdapter.connection('stations')
          .select(["stations.*", KnexAdapter.connection.raw("JSON_AGG( add.*) as address") ])
          .leftJoin('addresses AS add', 'add.id', "=", "stations.address_id")
          .groupBy("stations.id")
          .where({'stations.id': id})
          .first();

          if(!resultado) return null

          const address = ( resultado?.address ) ?  resultado.address[0] : null

          delete resultado.address

          return new StationView(resultado, address);
     }
     
     async upsert(model:Station): Promise<void> {
          await this._upsert( model, ['description','longitude','latitude','altitude'])
          return 
     }
}

