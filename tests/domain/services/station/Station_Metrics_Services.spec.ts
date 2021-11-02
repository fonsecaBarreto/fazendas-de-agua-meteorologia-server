import { MakeFakeMeasurementMetrics } from "@/../tests/mocks/dtos";
import {MakeFakeStation } from "@/../tests/mocks/entities"
import { IStationRepository } from "@/domain/Interfaces"
import Station_Metrics_Services, { IFindStationMetricsService } from "@/domain/Services/Stations/Station_Metrics_Services";
import {  MeasurementMetrics, StationView } from "@/domain/Views";

const MakeSut = () =>{

     const faked_stations = [ MakeFakeStation()]

     class StationRepoStub implements Pick<IStationRepository, 'findStation' | 'findMeasurementsByInterval'> {
          findStation(id: String): Promise<StationView> {
               return Promise.resolve(new StationView(faked_stations[0], null))
          }

          findMeasurementsByInterval(station_id: string, start_date: Date, end_date: Date): Promise<MeasurementMetrics> {
              return Promise.resolve(MakeFakeMeasurementMetrics({
                   start_limit: start_date,
                   end_limit: end_date
              }))
          }
     }  

     const stationsRepository = new StationRepoStub()
     const sut = new Station_Metrics_Services(stationsRepository)
     return { sut, stationsRepository, faked_stations }
}

const MakeFindStationMetricsParams =  ( fields?: Partial<IFindStationMetricsService.Params>): IFindStationMetricsService.Params => {
     return ({
          start_date: new Date('2021-01-01T00:00:00'),
          station_id: 'any_station_id',
          intervals: 1,
          amplitude: 60,
          ...fields
     })
}


describe('station Metrics Servies', () =>{

     test('should call station Repository with correct values', async () =>{
          const { sut, stationsRepository }= MakeSut()
          const respoSpy = jest.spyOn(stationsRepository,'findStation')
          const resp = await sut.execute(MakeFindStationMetricsParams({station_id:'any_station_id'})) 
          expect(respoSpy).toHaveBeenCalledWith('any_station_id')
     })
     test('should return null if no station Repository were found', async () =>{
          const { sut, stationsRepository }= MakeSut()
          jest.spyOn(stationsRepository,'findStation').mockImplementationOnce(()=>Promise.resolve(null))
          const resp = await sut.execute(MakeFindStationMetricsParams({station_id:'any_station_id'})) 
          expect(resp).toBe(null)
     })

     describe('One Day Scale', () =>{
          test('should call repo 24 times if a minute interval between', async () =>{
               const { sut, stationsRepository }= MakeSut()
               const findSpy = jest.spyOn(stationsRepository, 'findMeasurementsByInterval');

               await sut.execute(MakeFindStationMetricsParams({
                    start_date: new Date('2021-01-01T00:00:00'),
                    intervals: 24,
                    amplitude: 60
               })) 

               expect(findSpy).toHaveBeenCalledTimes(24)
               expect(findSpy).toHaveBeenNthCalledWith(1,'any_station_id',new Date('2021-01-01T00:00:00'), new Date('2021-01-01T01:00:00'))
               expect(findSpy).toHaveBeenNthCalledWith(2,'any_station_id',new Date('2021-01-01T01:00:00'), new Date('2021-01-01T02:00:00'))
               expect(findSpy).toHaveBeenNthCalledWith(3,'any_station_id',new Date('2021-01-01T02:00:00'), new Date('2021-01-01T03:00:00'))
               expect(findSpy).toHaveBeenNthCalledWith(4,'any_station_id',new Date('2021-01-01T03:00:00'), new Date('2021-01-01T04:00:00'))
          })
          
          test('should station View', async () =>{
               const { sut } = MakeSut()
               const resp = await sut.execute(MakeFindStationMetricsParams({
                    start_date: new Date('2021-01-01T00:00:00'),
                    intervals: 24,
                    amplitude: 60
               })) 
               expect(resp.measurements.data.length).toBe(24)
               expect(resp.measurements).toHaveProperty('amplitude')
          }) 
     })

     describe('One Week Scale', () =>{
          test('should call repo 7 times if a one day interval between', async () =>{
               const { sut, stationsRepository }= MakeSut()
               const findSpy = jest.spyOn(stationsRepository, 'findMeasurementsByInterval');

               await sut.execute(MakeFindStationMetricsParams({
                    start_date: new Date('2021-01-01T00:00:00'),
                    intervals: 7,
                    amplitude: 60 * 24
               })) 

               expect(findSpy).toHaveBeenCalledTimes(7)
               expect(findSpy).toHaveBeenNthCalledWith(1,'any_station_id',new Date('2021-01-01T00:00:00'), new Date('2021-01-02T00:00:00'))
               expect(findSpy).toHaveBeenNthCalledWith(2,'any_station_id',new Date('2021-01-02T00:00:00'), new Date('2021-01-03T00:00:00'))
               expect(findSpy).toHaveBeenNthCalledWith(3,'any_station_id',new Date('2021-01-03T00:00:00'), new Date('2021-01-04T00:00:00'))
               expect(findSpy).toHaveBeenNthCalledWith(4,'any_station_id',new Date('2021-01-04T00:00:00'), new Date('2021-01-05T00:00:00'))
          })
         
          test('should station View', async () =>{
               const { sut } = MakeSut()
               const resp =await sut.execute(MakeFindStationMetricsParams({
                    start_date: new Date('2021-01-01T00:00:00'),
                    intervals: 7,
                    amplitude: 60 * 24
               })) 

               expect(resp.measurements.data.length).toBe(7)
               expect(resp.measurements).toHaveProperty('amplitude')
          }) 
     })




})