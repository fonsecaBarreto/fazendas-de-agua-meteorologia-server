export enum CardialPoints {
     North = "N",
     East = "E",
     South = "S",
     West = "W",
     Northeast = "NE",
     Southeast = "SE",
     Southwest = "SW",
     Northwest = "NW", 
} 

export type Coordinates = number[];

export interface Measurement{
     id: string
     station_id: string,
     coordinates: Coordinates

     created_at:Date
     temperature: number
     airHumidity: number,
     windSpeed: number,
     windDirection: CardialPoints
     rainVolume: number,
     AccRainVolume: number
}

/* data,
hora, 
temperatura,
umidade,
velocidade_do_vento,
direção_do_vento,
chuva_minuto
chuva_acumulada
 */







