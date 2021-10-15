import SchemaBd, { SchemaBuilder } from '../../../libs/ApplicatonSchema/SchemaBuilder'

export const Measurement_CreateBodySchema: SchemaBuilder.Schema = SchemaBd.create( (s: SchemaBuilder )=> {
     s.number("temperature").description("Temperatura")
     s.number("airHumidity").description("Umidade do ar")
     s.number("rainVolume").description("Volume de chuva")
     s.number("windSpeed").description("Velocidade do vento")
     s.number("windDirection").description("Direção do vento")
     s.uuid("station_id").description("Estação de Meteorologia")
     s.date("created_at").description("Data de criação")
});

   

