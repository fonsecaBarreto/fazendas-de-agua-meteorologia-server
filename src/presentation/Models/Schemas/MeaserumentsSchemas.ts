import SchemaBd, { SchemaBuilder } from '../../../libs/ApplicatonSchema/SchemaBuilder'

export const Measurement_CreateBodySchema: SchemaBuilder.Schema = SchemaBd.create( (s: SchemaBuilder )=> {
     s.date("date").description("Data da Medição")
     s.hour("hour").description("Hora da Medição")
     s.number("temperature").description("Temperatura")
     s.number("airHumidity").description("Umidade do ar")
     s.number("windSpeed").description("Velocidade do vento")
     s.string("windDirection").description("Direção do vento")
     s.number("rainVolume").description("Volume de chuva")
     s.number("AccRainVolume").description("Chuva Acumulada")
});

export const MutiplesMeasurements_CreateParamsSchema: SchemaBuilder.Schema = SchemaBd.create( (s: SchemaBuilder )=> {
     s.uuid("station_id").description("Estação de Meteorologia")
});



